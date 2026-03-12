from pydantic import BaseModel


class AchievementBar(BaseModel):
    region: str
    low_limit: float
    high_limit: float
    deal_amount: float


class AchievementRow(BaseModel):
    row_num: int
    region: str
    actual_amount: float
    target_amount: float
    min_limit: float
    max_limit: float
    achievement_rate: float | None
    difference: float
