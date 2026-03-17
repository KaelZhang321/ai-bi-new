# 接口卡：KPI 总览

一句话摘要：`GET /v1/kpi/overview` 返回系统顶部 6 个核心 KPI，是桌面端和移动端首页摘要区的主数据接口。

## 基本信息
- 路径：`/v1/kpi/overview`
- 方法：`GET`
- 服务对象：核心 KPI 区
- 可信度：已代码验证

## 返回字段
- `registered_customers`
- `arrived_customers`
- `deal_amount`
- `consumed_budget`
- `received_amount`
- `roi`

每个字段对象包含：`label`、`value`、`unit`、`prefix`

## 调用方
- `frontend/src/hooks/useApi.ts#useKpiOverview`
- `frontend/src/components/sections/CoreKpiRow.tsx`
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/pages/mobile/MobileDashboard.tsx`

## 后端实现
- 路由：`backend/app/api/v1/kpi.py`
- 服务：`backend/app/services/kpi_service.py`

## 主要数据源
- `meeting_registration`
- `meeting_transaction_details`

## 当前限制
- ROI 使用固定预算 600 计算
- 指标口径未被配置化管理
