from pydantic import BaseModel


class SourceCount(BaseModel):
    region: str
    source_type: str
    customer_count: int


class TargetArrival(BaseModel):
    region: str
    target_count: int
    arrive_count: int
