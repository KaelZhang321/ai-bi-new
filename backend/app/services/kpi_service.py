from sqlalchemy import text
from sqlalchemy.orm import Session

from app.schemas.kpi import KpiItem, KpiOverview

TOTAL_BUDGET = 6_000_000


def get_kpi_overview(db: Session) -> KpiOverview:
    # 报名客户
    row = db.execute(
        text("SELECT COUNT(DISTINCT customer_unique_id) AS cnt FROM meeting_registration")
    ).mappings().first()
    registered = int(row["cnt"])

    # 已抵达客户
    row = db.execute(
        text(
            "SELECT COUNT(DISTINCT customer_unique_id) AS cnt "
            "FROM meeting_registration WHERE sign_in_status = '已签到'"
        )
    ).mappings().first()
    arrived = int(row["cnt"])

    # 成交/消耗/收款
    row = db.execute(
        text(
            "SELECT "
            "  COALESCE(SUM(new_deal_amount), 0) AS deal, "
            "  COALESCE(SUM(consumed_amount), 0) AS consumed, "
            "  COALESCE(SUM(received_amount), 0) AS received "
            "FROM meeting_transaction_details"
        )
    ).mappings().first()
    deal = float(row["deal"])
    consumed = float(row["consumed"])
    received = float(row["received"])

    # ROI
    roi = round(TOTAL_BUDGET / deal * 0.4, 4) if deal else 0

    return KpiOverview(
        registered_customers=KpiItem(label="报名客户", value=registered, unit="人"),
        arrived_customers=KpiItem(label="已抵达客户", value=arrived, unit="人"),
        deal_amount=KpiItem(label="已成交金额", value=deal, prefix="¥"),
        consumed_budget=KpiItem(label="已消耗预算", value=consumed, prefix="¥"),
        received_amount=KpiItem(label="已收款金额", value=received, prefix="¥"),
        roi=KpiItem(label="总投资回报率", value=roi * 100, unit="%"),
    )
