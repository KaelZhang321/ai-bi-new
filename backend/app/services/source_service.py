from sqlalchemy import text
from sqlalchemy.orm import Session

from app.schemas.source import SourceCount, TargetArrival


def get_source_distribution(db: Session) -> list[SourceCount]:
    """客户来源统计（按大区·来源）"""
    sql = text("""
        SELECT
            SUBSTRING_INDEX(market_service_attribution, ',', 1) AS region,
            CASE
                WHEN store_name LIKE '%盟主%' THEN '盟主'
                WHEN store_name LIKE '%商务%' THEN '商务'
                ELSE '店铺'
            END AS source_type,
            COUNT(DISTINCT customer_unique_id) AS customer_count
        FROM meeting_registration
        WHERE market_service_attribution IS NOT NULL
            AND store_name IS NOT NULL
        GROUP BY region, source_type
        ORDER BY region, customer_count DESC
    """)
    rows = db.execute(sql).mappings().all()
    return [SourceCount(**r) for r in rows]


def get_target_arrival(db: Session) -> list[TargetArrival]:
    """优质目标客户抵达情况"""
    # 目标客户（按大区）
    target_sql = text("""
        SELECT region, COUNT(*) AS target_count
        FROM meeting_customer_analysis
        WHERE (min_deal > 0 OR consumption_target > 0)
            AND region IS NOT NULL
            AND region != '细胞。和王艳红夫妻'
        GROUP BY region
    """)
    targets = {r["region"]: int(r["target_count"]) for r in db.execute(target_sql).mappings().all()}

    # 已抵达的目标客户
    arrive_sql = text("""
        SELECT mca.region, COUNT(*) AS arrive_count
        FROM meeting_customer_analysis mca
        INNER JOIN meeting_registration mr ON mca.customer_name = mr.customer_name
        WHERE (mca.min_deal > 0 OR mca.consumption_target > 0)
            AND mr.sign_in_status = '已签到'
            AND mca.region IS NOT NULL
            AND mca.region != '细胞。和王艳红夫妻'
        GROUP BY mca.region
    """)
    arrivals = {r["region"]: int(r["arrive_count"]) for r in db.execute(arrive_sql).mappings().all()}

    return [
        TargetArrival(region=region, target_count=count, arrive_count=arrivals.get(region, 0))
        for region, count in targets.items()
    ]
