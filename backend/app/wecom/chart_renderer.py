"""
图表渲染器

将 ChartConfig 渲染为 PNG 图片，用于企业微信机器人发送图表截图。
使用 plotly + kaleido 实现服务端图表生成。
"""

from __future__ import annotations

import logging
from typing import Any

import plotly.graph_objects as go

from app.schemas.ai_query import ChartConfig

logger = logging.getLogger("wecom.chart_renderer")

# 中文友好的颜色方案
COLORS = [
    "#5B8FF9", "#5AD8A6", "#F6BD16", "#E86452",
    "#6DC8EC", "#945FB9", "#FF9845", "#1E9493",
]


def render_chart(chart: ChartConfig) -> bytes | None:
    """
    将 ChartConfig 渲染为 PNG 图片

    :param chart: 图表配置
    :return: PNG 图片二进制数据，失败返回 None
    """
    try:
        fig = _build_figure(chart)
        if fig is None:
            return None

        img_bytes = fig.to_image(format="png", width=800, height=500, scale=2)
        logger.info(f"图表渲染成功: type={chart.chart_type}, size={len(img_bytes)} bytes")
        return img_bytes

    except Exception as e:
        logger.error(f"图表渲染失败: {e}")
        return None


def _build_figure(chart: ChartConfig) -> go.Figure | None:
    """根据 chart_type 构建 plotly Figure"""

    chart_type = chart.chart_type
    categories = chart.categories
    series = chart.series

    if not series:
        return None

    if chart_type == "pie":
        return _build_pie(categories, series)
    elif chart_type == "bar":
        return _build_bar(categories, series, orientation="v")
    elif chart_type == "horizontal_bar":
        return _build_bar(categories, series, orientation="h")
    elif chart_type == "grouped_bar":
        return _build_grouped_bar(categories, series)
    elif chart_type == "line":
        return _build_line(categories, series)
    else:
        # 默认用柱状图
        return _build_bar(categories, series, orientation="v")


def _build_pie(categories: list[str], series: list[dict[str, Any]]) -> go.Figure:
    """饼图"""
    s = series[0]
    data = s.get("data", [])

    labels = []
    values = []
    for item in data:
        if isinstance(item, dict):
            labels.append(item.get("name", ""))
            values.append(item.get("value", 0))
        else:
            values.append(item)

    if not labels:
        labels = categories

    fig = go.Figure(data=[go.Pie(
        labels=labels,
        values=values,
        marker=dict(colors=COLORS[:len(labels)]),
        textinfo="label+percent",
        textfont=dict(size=14),
    )])

    fig.update_layout(**_base_layout(), showlegend=True)
    return fig


def _build_bar(
    categories: list[str],
    series: list[dict[str, Any]],
    orientation: str = "v",
) -> go.Figure:
    """柱状图 / 条形图"""
    fig = go.Figure()

    for i, s in enumerate(series):
        data = _extract_values(s.get("data", []))
        color = COLORS[i % len(COLORS)]

        if orientation == "h":
            fig.add_trace(go.Bar(
                y=categories, x=data, name=s.get("name", ""),
                orientation="h", marker_color=color,
            ))
        else:
            fig.add_trace(go.Bar(
                x=categories, y=data, name=s.get("name", ""),
                marker_color=color,
            ))

    fig.update_layout(**_base_layout())
    return fig


def _build_grouped_bar(
    categories: list[str], series: list[dict[str, Any]]
) -> go.Figure:
    """分组柱状图"""
    fig = go.Figure()

    for i, s in enumerate(series):
        data = _extract_values(s.get("data", []))
        fig.add_trace(go.Bar(
            x=categories, y=data, name=s.get("name", ""),
            marker_color=COLORS[i % len(COLORS)],
        ))

    fig.update_layout(**_base_layout(), barmode="group")
    return fig


def _build_line(
    categories: list[str], series: list[dict[str, Any]]
) -> go.Figure:
    """折线图"""
    fig = go.Figure()

    for i, s in enumerate(series):
        data = _extract_values(s.get("data", []))
        fig.add_trace(go.Scatter(
            x=categories, y=data, name=s.get("name", ""),
            mode="lines+markers",
            line=dict(color=COLORS[i % len(COLORS)], width=2),
        ))

    fig.update_layout(**_base_layout())
    return fig


def _extract_values(data: list) -> list[float]:
    """从 series data 中提取数值列表"""
    values = []
    for item in data:
        if isinstance(item, dict):
            values.append(float(item.get("value", 0)))
        else:
            try:
                values.append(float(item))
            except (TypeError, ValueError):
                values.append(0.0)
    return values


def _base_layout() -> dict:
    """通用布局配置"""
    return dict(
        template="plotly_white",
        font=dict(size=14),
        margin=dict(l=60, r=40, t=40, b=60),
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
    )
