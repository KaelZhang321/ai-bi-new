from sqlalchemy import text
from sqlalchemy.orm import Session

from app.schemas.achievement import AchievementBar, AchievementRow, AchievementDetail


def get_achievement_chart(db: Session) -> list[AchievementBar]:
    sql = text("""
        SELECT
            t.region,
            t.min_deal AS low_limit,
            t.max_deal AS high_limit,
            COALESCE(SUM(d.new_deal_amount), 0) AS deal_amount
        FROM meeting_region_transaction_targets t
        LEFT JOIN meeting_transaction_details d
            ON t.region = d.region AND d.deal_type = '新成交'
        GROUP BY t.region, t.min_deal, t.max_deal
        ORDER BY t.region
    """)
    rows = db.execute(sql).mappings().all()
    return [
        AchievementBar(
            region=r["region"],
            low_limit=float(r["low_limit"] or 0),
            high_limit=float(r["high_limit"] or 0),
            deal_amount=float(r["deal_amount"]),
        )
        for r in rows
    ]


def get_achievement_table(db: Session) -> list[AchievementRow]:
    sql = text("""
        SELECT
            t.region AS region_name,
            COALESCE(d.deal_amount, 0) AS actual_amount,
            COALESCE(t.performance_target, 0) AS target_amount,
            COALESCE(t.min_deal, 0) AS min_limit,
            COALESCE(t.max_deal, 0) AS max_limit
        FROM meeting_region_transaction_targets t
        LEFT JOIN (
            SELECT region, SUM(new_deal_amount) AS deal_amount
            FROM meeting_transaction_details
            GROUP BY region
        ) d ON t.region = d.region
        ORDER BY t.region
    """)
    rows = db.execute(sql).mappings().all()
    result = []
    for i, r in enumerate(rows, 1):
        actual = float(r["actual_amount"])
        target = float(r["target_amount"])
        rate = round(actual / target * 100, 2) if target else None
        result.append(AchievementRow(
            row_num=i,
            region=r["region_name"],
            actual_amount=actual,
            target_amount=target,
            min_limit=float(r["min_limit"]),
            max_limit=float(r["max_limit"]),
            achievement_rate=rate,
            difference=actual - target,
        ))
    return result


def get_achievement_detail(db: Session, region: str | None = None) -> list[AchievementDetail]:
    """目标达成下钻：成交明细"""
    conditions = ["deal_type = '新成交'"]
    params: dict = {}
    if region:
        conditions.append("region = :region")
        params["region"] = region
    where = " AND ".join(conditions)
    sql = text(f"""
        SELECT
            customer_name,
            region,
            branch,
            deal_type,
            deal_content,
            COALESCE(new_deal_amount, 0) AS new_deal_amount,
            COALESCE(received_amount, 0) AS received_amount,
            plan_type,
            record_date
        FROM meeting_transaction_details
        WHERE {where}
        ORDER BY new_deal_amount DESC
    """)
    rows = db.execute(sql, params).mappings().all()
    return [
        AchievementDetail(
            **{k: (str(v) if k == "record_date" and v else v) for k, v in r.items()}
        )
        for r in rows
    ]
