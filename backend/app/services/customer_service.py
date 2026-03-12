from sqlalchemy import text
from sqlalchemy.orm import Session

from app.schemas.customer import PieSlice, CustomerProfile


def get_customer_profile(db: Session) -> CustomerProfile:
    # 金额等级分布 (meeting_customer_analysis)
    level_rows = db.execute(text("""
        SELECT
            COALESCE(customer_level, '未分类') AS name,
            COUNT(*) AS value
        FROM meeting_customer_analysis
        GROUP BY name
        ORDER BY value DESC
    """)).mappings().all()
    total_level = sum(r["value"] for r in level_rows) or 1
    level_dist = [
        PieSlice(name=r["name"], value=int(r["value"]),
                 percentage=round(int(r["value"]) / total_level * 100, 2))
        for r in level_rows
    ]

    # 身份类型分布 (meeting_registration.attendee_role)
    role_rows = db.execute(text("""
        SELECT
            COALESCE(attendee_role, '未知') AS name,
            COUNT(DISTINCT customer_unique_id) AS value
        FROM meeting_registration
        GROUP BY name
        ORDER BY value DESC
    """)).mappings().all()
    total_role = sum(r["value"] for r in role_rows) or 1
    role_dist = [
        PieSlice(name=r["name"], value=int(r["value"]),
                 percentage=round(int(r["value"]) / total_role * 100, 2))
        for r in role_rows
    ]

    # 新老客户 (meeting_registration.customer_category)
    new_old_rows = db.execute(text("""
        SELECT
            COALESCE(customer_category, '未知') AS name,
            COUNT(DISTINCT customer_unique_id) AS value
        FROM meeting_registration
        GROUP BY name
        ORDER BY value DESC
    """)).mappings().all()
    total_no = sum(r["value"] for r in new_old_rows) or 1
    new_old_dist = [
        PieSlice(name=r["name"], value=int(r["value"]),
                 percentage=round(int(r["value"]) / total_no * 100, 2))
        for r in new_old_rows
    ]

    return CustomerProfile(
        level_distribution=level_dist,
        role_distribution=role_dist,
        new_old_distribution=new_old_dist,
    )
