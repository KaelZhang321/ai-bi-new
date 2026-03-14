from sqlalchemy import text
from sqlalchemy.orm import Session

from app.schemas.progress import ProgressItem, ProgressSummary


def get_progress(db: Session) -> ProgressSummary:
    sql = text("""
        SELECT
            t.region AS region_name,
            COALESCE(d.deal_amount, 0) AS deal_amount,
            COALESCE(t.max_deal, 0) AS high_limit
        FROM meeting_region_transaction_targets t
        LEFT JOIN (
            SELECT region, SUM(new_deal_amount) AS deal_amount
            FROM meeting_transaction_details
            GROUP BY region
        ) d ON t.region = d.region
        ORDER BY deal_amount DESC
    """)
    rows = db.execute(sql).mappings().all()
    items = []
    rates = []
    for r in rows:
        deal = float(r["deal_amount"])
        high = float(r["high_limit"])
        rate = round(deal / high * 100, 2) if high else None
        items.append(ProgressItem(
            region=r["region_name"],
            deal_amount=deal,
            high_limit=high,
            completion_rate=rate,
        ))
        if rate is not None:
            rates.append(rate)

    avg_rate = round(sum(rates) / len(rates), 2) if rates else None
    return ProgressSummary(items=items, avg_completion_rate=avg_rate)
