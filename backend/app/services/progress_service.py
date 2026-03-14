from sqlalchemy import text
from sqlalchemy.orm import Session

from app.schemas.progress import ProgressItem, ProgressSummary


def get_progress(db: Session) -> ProgressSummary:
    sql = text("""
        SELECT
            region,
            COALESCE(deal_target_high, 0) AS high_limit,
            COALESCE(new_deal_amount, 0) AS deal_amount
        FROM meeting_region_proposal_targets
		WHERE region_owner IS NOT NULL
        ORDER BY deal_amount DESC
    """)
    rows = db.execute(sql).mappings().all()
    items = []
    rates = []
    for r in rows:
        deal = float(r["deal_amount"] or 0)
        high = float(r["high_limit"] or 0)
        rate = round(deal / high * 100, 2) if high else None
        items.append(ProgressItem(
            region=r["region"],
            deal_amount=deal,
            high_limit=high,
            completion_rate=rate,
        ))
        if rate is not None:
            rates.append(rate)

    avg_rate = round(sum(rates) / len(rates), 2) if rates else None
    return ProgressSummary(items=items, avg_completion_rate=avg_rate)
