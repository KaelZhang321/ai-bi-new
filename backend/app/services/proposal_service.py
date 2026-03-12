from sqlalchemy import text
from sqlalchemy.orm import Session

from app.schemas.proposal import ProposalRow, ProposalCrossRow


def get_proposal_overview(db: Session) -> list[ProposalRow]:
    sql = text("""
        SELECT
            p.region,
            p.proposal_type,
            p.target_count,
            COUNT(d.id) AS achieved_count
        FROM meeting_region_proposal_targets p
        LEFT JOIN meeting_transaction_details d
            ON p.region = d.region
            AND d.deal_type LIKE '%新成交%'
            AND (
                d.deal_content LIKE CONCAT('%', p.proposal_type, '%')
                OR (p.proposal_type LIKE '%海心卡%' AND (d.deal_content LIKE '%海心卡%' OR d.deal_content LIKE '%细胞卡%'))
                OR (p.proposal_type LIKE '%细胞卡%' AND (d.deal_content LIKE '%海心卡%' OR d.deal_content LIKE '%细胞卡%'))
            )
        GROUP BY p.region, p.proposal_type, p.target_count
        ORDER BY p.region, p.proposal_type
    """)
    rows = db.execute(sql).mappings().all()
    return [ProposalRow(**r) for r in rows]


def get_proposal_cross_table(db: Session) -> list[ProposalCrossRow]:
    # 获取所有方案类型
    types = db.execute(text(
        "SELECT DISTINCT proposal_type FROM meeting_region_proposal_targets ORDER BY proposal_type"
    )).scalars().all()

    if not types:
        return []

    # 获取各区域各方案的达成数量
    overview = get_proposal_overview(db)
    region_map: dict[str, dict[str, int]] = {}
    for row in overview:
        region_map.setdefault(row.region, {t: 0 for t in types})
        region_map[row.region][row.proposal_type] = row.achieved_count

    return [ProposalCrossRow(region=region, proposals=proposals) for region, proposals in region_map.items()]
