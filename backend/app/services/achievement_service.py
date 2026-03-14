from sqlalchemy import text
from sqlalchemy.orm import Session

from app.schemas.achievement import AchievementBar, AchievementRow, AchievementDetail


def get_achievement_chart(db: Session) -> list[AchievementBar]:
    sql = text("""
        SELECT
            region,
            deal_target_low AS low_limit,
            deal_target_high AS high_limit,
            new_deal_amount AS deal_amount
        FROM meeting_region_proposal_targets
		WHERE region_owner IS NOT NULL
		ORDER BY region
    """)
    rows = db.execute(sql).mappings().all()
    return [
        AchievementBar(
            region=r["region"],
            low_limit=float(r["low_limit"] or 0),
            high_limit=float(r["high_limit"] or 0),
            deal_amount=float(r["deal_amount"] or 0),
        )
        for r in rows
    ]


def get_achievement_table(db: Session) -> list[AchievementRow]:
    sql = text("""
        SELECT
            region,
			COALESCE(new_deal_amount, 0) AS actual_amount,
			COALESCE(deal_target, 0) AS target_amount,
            COALESCE(deal_target_low, 0) AS min_limit,
            COALESCE(deal_target_high, 0) AS max_limit
        FROM meeting_region_proposal_targets
		WHERE region_owner IS NOT NULL
		ORDER BY region
    """)
    rows = db.execute(sql).mappings().all()
    result = []
    for i, r in enumerate(rows, 1):
        actual = float(r["actual_amount"] or 0)
        target = float(r["target_amount"] or 0)
        rate = round(actual / target * 100, 2) if target else None
        result.append(AchievementRow(
            row_num=i,
            region=r["region"],
            actual_amount=actual,
            target_amount=target,
            min_limit=float(r["min_limit"] or 0),
            max_limit=float(r["max_limit"] or 0),
            achievement_rate=rate,
            difference=actual - target,
        ))
    return result


def get_achievement_detail(db: Session, region: str | None = None) -> list[AchievementDetail]:
    """目标达成下钻：成交明细"""
    conditions = []
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
