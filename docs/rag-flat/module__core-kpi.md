---
kb: meeting-bi
doc_type: module
source_path: docs/rag/modules/core-kpi.md
source_file: core-kpi.md
title: 模块卡：核心 KPI 区
summary: 核心 KPI 区提供整个会议经营情况的摘要视图，是所有页面进入后的第一层判断面板。
language: zh-CN
version_date: 2026-03-17
---
# 模块卡：核心 KPI 区

一句话摘要：核心 KPI 区提供整个会议经营情况的摘要视图，是所有页面进入后的第一层判断面板。

## 模块信息
- 类型：模块卡
- 模块名称：核心 KPI
- 所属页面：桌面端首页 / 移动端首页顶部
- 业务目的：用 6 个数字快速概括当前会议经营状态
- 可信度：已代码验证

## 展示内容
- 报名客户
- 已抵达客户
- 已成交金额
- 新规划消耗
- 已收款金额
- 总投资回报率

## 数据来源
- 主接口：`../apis/kpi-overview.md`
- 主服务：`backend/app/services/kpi_service.py`
- 主数据表：`meeting_registration`、`meeting_transaction_details`

## 交互方式
- 桌面端作为大屏顶部摘要
- 移动端作为首页卡片

## 当前限制
- ROI 基于固定预算 600 计算
- 指标名与历史文档中的表达不完全一致

## 代码锚点
- `frontend/src/components/sections/CoreKpiRow.tsx`
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/pages/mobile/MobileDashboard.tsx`
