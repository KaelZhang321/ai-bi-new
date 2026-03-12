from typing import Any
from pydantic import BaseModel


class AiQueryRequest(BaseModel):
    question: str


class ChartConfig(BaseModel):
    chart_type: str  # pie | bar | grouped_bar | horizontal_bar | line | none
    categories: list[str]
    series: list[dict[str, Any]]  # [{ name, data: [] }]


class AiQueryResponse(BaseModel):
    sql: str
    columns: list[str]
    rows: list[dict[str, Any]]
    answer: str
    chart: ChartConfig | None = None
