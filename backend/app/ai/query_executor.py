"""
AI 查询执行器 - Vanna 生成 SQL + 自动图表推荐
"""
import re
import logging
from decimal import Decimal
from datetime import date, datetime

from sqlalchemy import text
from sqlalchemy.orm import Session

import json

from app.schemas.ai_query import AiQueryResponse, ChartConfig
from app.ai.context_store import get_last_question, save_round, get_recent_rounds, QARound

logger = logging.getLogger(__name__)


def validate_sql(sql: str) -> bool:
    cleaned = sql.strip().upper()
    if not cleaned.startswith("SELECT"):
        return False
    for kw in ["INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "CREATE", "TRUNCATE", "EXEC", "EXECUTE", "GRANT", "REVOKE"]:
        if re.search(rf"\b{kw}\b", cleaned):
            return False
    return True


def _clean_sql(sql: str) -> str:
    sql = re.sub(r"^```\w*\n?", "", sql.strip())
    sql = re.sub(r"\n?```$", "", sql)
    return sql.strip().rstrip(";")


def _serialize_value(v):
    if v is None:
        return None
    if isinstance(v, Decimal):
        return float(v)
    if isinstance(v, (date, datetime)):
        return str(v)
    if isinstance(v, bytes):
        return v.decode("utf-8", errors="replace")
    return v


def _to_float(v) -> float:
    try:
        return float(v)
    except (TypeError, ValueError):
        return 0.0


def _build_chart(columns: list[str], rows: list[dict]) -> ChartConfig | None:
    """根据数据结构自动推荐图表类型。"""
    if not rows or len(rows) < 2 or len(columns) < 2:
        return None

    # 分析列类型: 找出 string 列和 number 列
    str_cols = []
    num_cols = []
    for col in columns:
        values = [r.get(col) for r in rows[:10] if r.get(col) is not None]
        if not values:
            continue
        is_num = all(isinstance(v, (int, float, Decimal)) or (isinstance(v, str) and _is_numeric(v)) for v in values)
        if is_num:
            num_cols.append(col)
        else:
            str_cols.append(col)

    if not str_cols or not num_cols:
        return None

    cat_col = str_cols[0]
    categories = [str(r.get(cat_col, "")) for r in rows]

    # 判断图表类型
    if len(num_cols) == 1 and len(rows) <= 8:
        # 单数值列 + 少量分类 → 饼图
        series = [{"name": num_cols[0], "data": [{"name": categories[i], "value": _to_float(rows[i].get(num_cols[0]))} for i in range(len(rows))]}]
        return ChartConfig(chart_type="pie", categories=categories, series=series)

    if len(num_cols) == 1:
        # 单数值列 + 多分类 → 柱状图
        series = [{"name": num_cols[0], "data": [_to_float(r.get(num_cols[0])) for r in rows]}]
        if len(rows) > 6:
            return ChartConfig(chart_type="horizontal_bar", categories=categories, series=series)
        return ChartConfig(chart_type="bar", categories=categories, series=series)

    # 多数值列 → 分组柱状图
    series = [{"name": col, "data": [_to_float(r.get(col)) for r in rows]} for col in num_cols[:4]]
    return ChartConfig(chart_type="grouped_bar", categories=categories, series=series)


def _is_numeric(v: str) -> bool:
    try:
        float(v)
        return True
    except ValueError:
        return False


def _rewrite_question(vn, question: str, conversation_id: str | None) -> str:
    """有上下文时改写问题为完整表述，否则原样返回。"""
    if not conversation_id:
        return question
    last_q = get_last_question(conversation_id)
    if not last_q:
        return question
    try:
        rewritten = vn.generate_rewritten_question(last_q, question)
        if rewritten and rewritten.strip():
            logger.info(f"Question rewritten: '{question}' -> '{rewritten}'")
            return rewritten.strip()
    except Exception as e:
        logger.warning(f"Question rewrite failed, using original: {e}")
    return question


def _build_history_prompt(conversation_id: str | None) -> str:
    """构建最近 2 轮历史 Q&A 的 prompt 片段。"""
    if not conversation_id:
        return ""
    rounds = get_recent_rounds(conversation_id, n=2)
    if not rounds:
        return ""
    lines = []
    for r in rounds:
        lines.append(f"Q: {r.rewritten}")
        if r.answer:
            lines.append(f"A: {r.answer[:200]}")
    return "历史对话：\n" + "\n".join(lines) + "\n\n"


def execute_ai_query(question: str, db: Session, conversation_id: str | None = None) -> AiQueryResponse:
    try:
        from app.ai.vanna_client import get_vanna
        vn = get_vanna()
    except Exception as e:
        logger.error(f"Vanna init failed: {e}")
        return AiQueryResponse(sql="", columns=[], rows=[], answer=f"AI 服务初始化失败: {str(e)}")

    # 上下文改写
    rewritten = _rewrite_question(vn, question, conversation_id)

    # 生成 SQL
    try:
        sql = vn.generate_sql(question=rewritten)
        if not sql:
            return AiQueryResponse(sql="", columns=[], rows=[], answer="无法生成 SQL，请尝试更具体的描述。")
        sql = _clean_sql(sql)
        logger.info(f"Generated SQL: {sql}")
    except Exception as e:
        return AiQueryResponse(sql="", columns=[], rows=[], answer=f"SQL 生成失败: {str(e)}")

    if not validate_sql(sql):
        return AiQueryResponse(sql=sql, columns=[], rows=[], answer="生成的 SQL 不安全，已拒绝执行。")

    # 执行 SQL
    try:
        result = db.execute(text(sql))
        columns = list(result.keys())
        raw_rows = result.fetchall()
        rows = [{col: _serialize_value(val) for col, val in zip(columns, row)} for row in raw_rows]
    except Exception as e:
        return AiQueryResponse(sql=sql, columns=[], rows=[], answer=f"SQL 执行失败: {str(e)}")

    # 生成图表
    chart = _build_chart(columns, rows)

    # 生成自然语言回答
    try:
        display_rows = rows[:30]
        history_prompt = _build_history_prompt(conversation_id)
        answer_prompt = (
            f"{history_prompt}"
            f"用户问题：{rewritten}\nSQL：{sql}\n结果（共{len(rows)}行）：{display_rows}\n\n"
            f"请用简洁中文回答，直接给出关键数据和结论。"
        )
        answer = vn.submit_prompt([{"role": "user", "content": answer_prompt}])
    except Exception:
        answer = f"查询成功，共返回 {len(rows)} 条数据。"

    # 保存本轮到上下文缓存
    if conversation_id:
        save_round(conversation_id, QARound(
            question=question,
            rewritten=rewritten,
            sql=sql,
            answer=answer[:200] if answer else "",
        ))

    # 序列化所有值为 JSON 兼容
    safe_rows = [{k: (str(v) if v is not None and not isinstance(v, (int, float)) else v) for k, v in row.items()} for row in rows]

    return AiQueryResponse(sql=sql, columns=columns, rows=safe_rows, answer=answer, chart=chart)


async def execute_ai_query_stream(question: str, db: Session, conversation_id: str | None = None):
    """SSE 流式执行 AI 查询，分阶段 yield 事件。"""

    def _sse(event: str, data: dict) -> dict:
        return {"event": event, "data": json.dumps(data, ensure_ascii=False)}

    # 初始化 Vanna
    try:
        from app.ai.vanna_client import get_vanna
        vn = get_vanna()
    except Exception as e:
        logger.error(f"Vanna init failed: {e}")
        yield _sse("error", {"message": f"AI 服务初始化失败: {str(e)}"})
        return

    # 上下文改写
    rewritten = _rewrite_question(vn, question, conversation_id)

    # 阶段 1: 生成 SQL
    try:
        sql = vn.generate_sql(question=rewritten)
        if not sql:
            yield _sse("error", {"message": "无法生成 SQL，请尝试更具体的描述。"})
            return
        sql = _clean_sql(sql)
        logger.info(f"Generated SQL: {sql}")
    except Exception as e:
        yield _sse("error", {"message": f"SQL 生成失败: {str(e)}"})
        return

    if not validate_sql(sql):
        yield _sse("error", {"message": "生成的 SQL 不安全，已拒绝执行。"})
        return

    yield _sse("sql", {"sql": sql})

    # 阶段 2: 执行 SQL
    try:
        result = db.execute(text(sql))
        columns = list(result.keys())
        raw_rows = result.fetchall()
        rows = [{col: _serialize_value(val) for col, val in zip(columns, row)} for row in raw_rows]
        safe_rows = [
            {k: (str(v) if v is not None and not isinstance(v, (int, float)) else v) for k, v in row.items()}
            for row in rows
        ]
    except Exception as e:
        yield _sse("error", {"message": f"SQL 执行失败: {str(e)}"})
        return

    yield _sse("data", {"columns": columns, "rows": safe_rows})

    # 阶段 3: 生成图表
    chart = _build_chart(columns, rows)
    if chart:
        yield _sse("chart", {"chart": chart.model_dump()})

    # 阶段 4: 生成自然语言回答
    try:
        display_rows = rows[:30]
        history_prompt = _build_history_prompt(conversation_id)
        answer_prompt = (
            f"{history_prompt}"
            f"用户问题：{rewritten}\nSQL：{sql}\n结果（共{len(rows)}行）：{display_rows}\n\n"
            f"请用简洁中文回答，直接给出关键数据和结论。"
        )
        answer = vn.submit_prompt([{"role": "user", "content": answer_prompt}])
    except Exception:
        answer = f"查询成功，共返回 {len(rows)} 条数据。"

    # 保存本轮到上下文缓存
    if conversation_id:
        save_round(conversation_id, QARound(
            question=question,
            rewritten=rewritten,
            sql=sql,
            answer=answer[:200] if answer else "",
        ))

    yield _sse("answer", {"answer": answer})
