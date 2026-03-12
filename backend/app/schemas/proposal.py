from pydantic import BaseModel


class ProposalRow(BaseModel):
    region: str
    proposal_type: str
    target_count: int
    achieved_count: int


class ProposalCrossRow(BaseModel):
    region: str
    proposals: dict[str, int]
