---
kb: meeting-bi
doc_type: api
source_path: docs/rag/apis/operations-kpi.md
source_file: operations-kpi.md
title: 接口卡：运营 KPI
summary: `GET /v1/operations/kpi` 按日期返回签到、接机、离开、到院 4 个运营指标。
language: zh-CN
version_date: 2026-03-17
---
# 接口卡：运营 KPI

一句话摘要：`GET /v1/operations/kpi` 按日期返回签到、接机、离开、到院 4 个运营指标。

## 基本信息
- 路径：`/v1/operations/kpi`
- 方法：`GET`
- 入参：`date_from`、`date_to`
- 服务对象：运营 KPI 卡片
- 可信度：已代码验证

## 返回字段
- `checkin_count`
- `pickup_count`
- `leave_count`
- `hospital_count`

## 调用方
- `frontend/src/hooks/useApi.ts#useOperationsKpi`
- `frontend/src/components/sections/OperationsSection.tsx`

## 后端实现
- 服务：`backend/app/services/operations_service.py#get_operations_kpi`

## 当前限制
- SQL 使用日期字符串拼接
- 当前前端只按单日调用
