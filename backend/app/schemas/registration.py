from pydantic import BaseModel


class RegionLevelCount(BaseModel):
    region: str
    customer_level_name: str | None
    register_count: int
    arrive_count: int


class MatrixRow(BaseModel):
    region: str
    qianwan_register: int
    qianwan_arrive: int
    baiwan_register: int
    baiwan_arrive: int
    putong_register: int
    putong_arrive: int
    total_register: int
    total_arrive: int
