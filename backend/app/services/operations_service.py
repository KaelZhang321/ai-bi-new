from sqlalchemy import text
from sqlalchemy.orm import Session

from app.schemas.operations import OperationsKpi, TrendPoint


def get_operations_kpi(db: Session, date_from: str | None = None, date_to: str | None = None) -> OperationsKpi:
    date_filter = ""
    if date_from and date_to:
        date_filter_1 = f" AND sign_in_date_1 BETWEEN '{date_from}' AND '{date_to}'"
        date_filter_2 = f" AND schedule_date BETWEEN '{date_from}' AND '{date_to}'"

    checkin = db.execute(text(
        f"SELECT COUNT(DISTINCT customer_unique_id) AS cnt FROM meeting_registration WHERE sign_in_date_1 IS NOT NULL{date_filter_1}"
    )).mappings().first()

    pickup = db.execute(text(
        f"SELECT COUNT(DISTINCT customer_unique_id) AS cnt FROM meeting_registration WHERE flight_info IS NOT NULL AND sign_in_date_1 IS NOT NULL{date_filter_1}"
    )).mappings().first()

    leave = db.execute(text(
        f"SELECT COALESCE(SUM(people_count), 0) AS cnt FROM meeting_schedule_stats WHERE time_period = '离开人数'{date_filter_2}"
    )).mappings().first()

    hospital = db.execute(text(
        f"SELECT COALESCE(SUM(people_count), 0) AS cnt FROM meeting_schedule_stats WHERE time_period = '医院人数合计'{date_filter_2}"
    )).mappings().first()

    return OperationsKpi(
        checkin_count=int(checkin["cnt"]),
        pickup_count=int(pickup["cnt"]),
        leave_count=int(leave["cnt"]),
        hospital_count=int(hospital["cnt"]),
    )


def get_trend_data(db: Session) -> list[TrendPoint]:
    sql = text("""
        SELECT
            schedule_date,
            CASE
                WHEN time_period LIKE '%上午%' THEN '上午'
                WHEN time_period LIKE '%下午%' THEN '下午'
                WHEN time_period LIKE '%午餐%' THEN '下午'
                WHEN time_period LIKE '%晚餐%' THEN '晚上'
                WHEN time_period LIKE '%晚上%' THEN '晚上'
                ELSE '全天'
            END AS day_time_period,
            CASE
                WHEN time_period LIKE '%参加会议%' THEN '参会'
                WHEN time_period LIKE '%签到%' THEN '抵达'
                WHEN time_period LIKE '%离开%' THEN '离开'
                WHEN time_period LIKE '%午餐%' THEN '用餐'
                WHEN time_period LIKE '%晚餐%' THEN '用餐'
                WHEN time_period LIKE '%医院%' THEN '到院'
                ELSE '其他'
            END AS scene_label,
            SUM(people_count) AS people_count
        FROM meeting_schedule_stats
        WHERE time_period NOT LIKE '%率%'
            AND time_period NOT LIKE '%占比%'
        GROUP BY schedule_date, day_time_period, scene_label
        ORDER BY schedule_date, day_time_period
    """)
    rows = db.execute(sql).mappings().all()
    return [
        TrendPoint(
            schedule_date=str(r["schedule_date"]),
            day_time_period=r["day_time_period"],
            scene_label=r["scene_label"],
            people_count=int(r["people_count"]),
        )
        for r in rows
    ]
