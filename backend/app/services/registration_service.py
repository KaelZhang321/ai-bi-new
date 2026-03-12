from sqlalchemy import text
from sqlalchemy.orm import Session

from app.schemas.registration import RegionLevelCount, MatrixRow


def get_region_level_chart(db: Session) -> list[RegionLevelCount]:
    """签到柱状图：各区域各等级 报名/抵达数"""
    sql = text("""
        SELECT
            SUBSTRING_INDEX(market_service_attribution, ',', 1) AS region,
            customer_level_name,
            COUNT(DISTINCT customer_unique_id) AS register_count,
            COUNT(DISTINCT CASE WHEN sign_in_status = '已签到' THEN customer_unique_id END) AS arrive_count
        FROM meeting_registration
        WHERE market_service_attribution IS NOT NULL
        GROUP BY region, customer_level_name
        ORDER BY region
    """)
    rows = db.execute(sql).mappings().all()
    return [
        RegionLevelCount(
            region=r["region"],
            customer_level_name=r["customer_level_name"],
            register_count=int(r["register_count"]),
            arrive_count=int(r["arrive_count"]),
        )
        for r in rows
    ]


def get_matrix_table(db: Session) -> list[MatrixRow]:
    """签席信息矩阵表"""
    sql = text("""
        SELECT
            SUBSTRING_INDEX(market_service_attribution, ',', 1) AS region,
            SUM(CASE WHEN customer_level_name LIKE '%千万%' THEN 1 ELSE 0 END) AS qianwan_register,
            SUM(CASE WHEN customer_level_name LIKE '%千万%' AND sign_in_status = '已签到' THEN 1 ELSE 0 END) AS qianwan_arrive,
            SUM(CASE WHEN customer_level_name LIKE '%百万%' OR customer_level_name LIKE '%300万%' THEN 1 ELSE 0 END) AS baiwan_register,
            SUM(CASE WHEN (customer_level_name LIKE '%百万%' OR customer_level_name LIKE '%300万%') AND sign_in_status = '已签到' THEN 1 ELSE 0 END) AS baiwan_arrive,
            SUM(CASE WHEN customer_level_name IS NULL OR (customer_level_name NOT LIKE '%千万%' AND customer_level_name NOT LIKE '%百万%' AND customer_level_name NOT LIKE '%300万%') THEN 1 ELSE 0 END) AS putong_register,
            SUM(CASE WHEN (customer_level_name IS NULL OR (customer_level_name NOT LIKE '%千万%' AND customer_level_name NOT LIKE '%百万%' AND customer_level_name NOT LIKE '%300万%')) AND sign_in_status = '已签到' THEN 1 ELSE 0 END) AS putong_arrive,
            COUNT(DISTINCT customer_unique_id) AS total_register,
            COUNT(DISTINCT CASE WHEN sign_in_status = '已签到' THEN customer_unique_id END) AS total_arrive
        FROM meeting_registration
        WHERE market_service_attribution IS NOT NULL
        GROUP BY region
        ORDER BY total_register DESC
    """)
    rows = db.execute(sql).mappings().all()
    return [MatrixRow(**{k: int(v) if k != "region" else v for k, v in r.items()}) for r in rows]
