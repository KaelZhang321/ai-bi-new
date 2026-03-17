---
kb: meeting-bi
doc_type: api
source_path: docs/rag/apis/source-target-arrival.md
source_file: source-target-arrival.md
title: 接口卡：目标客户抵达
summary: `GET /v1/source/target-arrival` 返回各区域目标客户数与已抵达数，用于优质目标客户抵达图。
language: zh-CN
version_date: 2026-03-17
---
# 接口卡：目标客户抵达

一句话摘要：`GET /v1/source/target-arrival` 返回各区域目标客户数与已抵达数，用于优质目标客户抵达图。

## 基本信息
- 路径：`/v1/source/target-arrival`
- 方法：`GET`
- 服务对象：优质目标客户抵达
- 可信度：已代码验证

## 返回字段
- `region`
- `target_count`
- `arrive_count`

## 调用方
- `frontend/src/hooks/useApi.ts#useTargetArrival`
- `frontend/src/components/sections/CustomerSourceSection.tsx`

## 后端实现
- 服务：`backend/app/services/source_service.py#get_target_arrival`

## 主要数据源
- `meeting_customer_analysis`
- `meeting_registration`

## 当前限制
- 目标客户口径当前固定为 `min_deal >= 100`
