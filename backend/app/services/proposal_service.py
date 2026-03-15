from sqlalchemy import text
from sqlalchemy.orm import Session

from app.schemas.proposal import ProposalRow, ProposalCrossRow, ProposalDetail

def get_proposal_overview(db: Session) -> list[ProposalRow]:
    sql = text("""
            SELECT
                p.proposal_type,
                p.target_count,
                p.target_amount,
                COUNT(t.special_remarks) AS actual_count,
                SUM(t.new_deal_amount) AS actual_amount
            FROM meeting_proposal_targets AS p
						LEFT JOIN meeting_transaction_details AS t ON p.proposal_type = TRIM(t.special_remarks)
						GROUP BY p.proposal_type, p.target_count, p.target_amount
            ORDER BY proposal_type;
    """)
    rows = db.execute(sql).mappings().all()
    return [
        ProposalRow(
            proposal_type=r["proposal_type"],
            target_count=int(r["target_count"] or 0),
            target_amount=float(r["target_amount"] or 0),
            actual_count=int(r["actual_count"] or 0),
            actual_amount=float(r["actual_amount"] or 0) / 10000,
        )
        for r in rows
    ]


# def get_proposal_cross_table(db: Session) -> list[ProposalCrossRow]:
#     types = db.execute(text(
#         "SELECT DISTINCT proposal_type FROM meeting_proposal_targets ORDER BY proposal_type"
#     )).scalars().all()
#
#     if not types:
#         return []
#
#     overview = db.execute(text("""
#         SELECT
#             p.region,
#             p.proposal_type,
#             COUNT(d.id) AS achieved_count
#         FROM meeting_proposal_targets p
#         LEFT JOIN meeting_transaction_details d
#             ON p.region = d.region
#             AND d.deal_type LIKE '%新成交%'
#             AND (
#                 d.deal_content LIKE CONCAT('%', p.proposal_type, '%')
#                 OR (p.proposal_type LIKE '%海心卡%' AND (d.deal_content LIKE '%海心卡%' OR d.deal_content LIKE '%细胞卡%'))
#                 OR (p.proposal_type LIKE '%细胞卡%' AND (d.deal_content LIKE '%海心卡%' OR d.deal_content LIKE '%细胞卡%'))
#             )
#         GROUP BY p.region, p.proposal_type
#         ORDER BY p.region, p.proposal_type
#     """)).mappings().all()
#
#     region_map: dict[str, dict[str, int]] = {}
#     for row in overview:
#         region = row["region"]
#         proposal_type = row["proposal_type"]
#         achieved_count = int(row["achieved_count"] or 0)
#         region_map.setdefault(region, {t: 0 for t in types})
#         region_map[region][proposal_type] = achieved_count
#
#     return [ProposalCrossRow(region=region, proposals=proposals) for region, proposals in region_map.items()]


def get_proposal_detail(db: Session, region: str | None = None, proposal_type: str | None = None) -> list[ProposalDetail]:
    """方案情报下钻：成交明细"""
    conditions = ["deal_type LIKE '%新成交%'"]
    params: dict = {}
    if region:
        conditions.append("region = :region")
        params["region"] = region
    if proposal_type:
        if "海心卡" in proposal_type or "细胞卡" in proposal_type:
            conditions.append("(deal_content LIKE '%海心卡%' OR deal_content LIKE '%细胞卡%')")
        else:
            conditions.append("deal_content LIKE CONCAT('%', :proposal_type, '%')")
            params["proposal_type"] = proposal_type
    where = " AND ".join(conditions)
    sql = text(f"""
        SELECT
            customer_name,
            region,
            deal_content,
            COALESCE(new_deal_amount, 0) AS new_deal_amount,
            COALESCE(received_amount, 0) AS received_amount,
            record_date
        FROM meeting_transaction_details
        WHERE {where}
        ORDER BY new_deal_amount DESC
    """)
    rows = db.execute(sql, params).mappings().all()
    return [
        ProposalDetail(
            **{k: (str(v) if k == "record_date" and v else v) for k, v in r.items()}
        )
        for r in rows
    ]
