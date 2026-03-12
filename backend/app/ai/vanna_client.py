"""
Vanna.ai 集成 - 使用 ChromaDB 本地向量存储 + 火山引擎 DeepSeek-v3 作为 LLM。
"""
import logging
from vanna.chromadb import ChromaDB_VectorStore

from app.config import settings
from app.ai.training_data import DDL_STATEMENTS, QA_PAIRS

logger = logging.getLogger(__name__)

_vn = None


class VolcanoVanna(ChromaDB_VectorStore):
    """使用 ChromaDB 做向量存储, 火山引擎 DeepSeek-v3 做 LLM 的 Vanna 实现。"""

    def __init__(self, config=None):
        ChromaDB_VectorStore.__init__(self, config=config)
        from openai import OpenAI
        self._llm_client = OpenAI(
            api_key=settings.VOLCANO_API_KEY,
            base_url=settings.VOLCANO_BASE_URL,
        )

    def system_message(self, message: str) -> dict:
        return {"role": "system", "content": message}

    def user_message(self, message: str) -> dict:
        return {"role": "user", "content": message}

    def assistant_message(self, message: str) -> dict:
        return {"role": "assistant", "content": message}

    def submit_prompt(self, prompt, **kwargs) -> str:
        """调用火山引擎 DeepSeek-v3 生成回复。"""
        if isinstance(prompt, str):
            messages = [{"role": "user", "content": prompt}]
        else:
            messages = prompt

        response = self._llm_client.chat.completions.create(
            model=settings.VOLCANO_MODEL,
            messages=messages,
            temperature=0.1,
            max_tokens=4096,
        )
        return response.choices[0].message.content or ""


def get_vanna() -> VolcanoVanna:
    """获取 Vanna 单例，首次调用时训练。"""
    global _vn
    if _vn is not None:
        return _vn

    logger.info("Initializing Vanna with ChromaDB + Volcano Engine...")
    _vn = VolcanoVanna(config={"model": "meeting-bi"})

    # 连接 MySQL
    _vn.connect_to_mysql(
        host=settings.DB_HOST,
        dbname=settings.DB_NAME,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        port=settings.DB_PORT,
    )

    # 训练: DDL + QA 对
    _train(_vn)
    logger.info("Vanna training complete.")
    return _vn


def _train(vn: VolcanoVanna):
    """用 DDL 语句和 QA 对训练 Vanna。"""
    for ddl in DDL_STATEMENTS:
        try:
            vn.train(ddl=ddl)
        except Exception as e:
            logger.warning(f"DDL training warning: {e}")

    for qa in QA_PAIRS:
        try:
            vn.train(question=qa["question"], sql=qa["sql"])
        except Exception as e:
            logger.warning(f"QA training warning: {e}")
