---
kb: meeting-bi
doc_type: api
source_path: docs/rag/apis/proposal-overview.md
source_file: proposal-overview.md
title: 接口卡：方案概览
summary: `GET /v1/proposal/overview` 返回各方案的目标数量、目标金额、实际数量、实际金额，用于方案概览表。
language: zh-CN
version_date: 2026-03-17
---
# 接口卡：方案概览

一句话摘要：`GET /v1/proposal/overview` 返回各方案的目标数量、目标金额、实际数量、实际金额，用于方案概览表。

## 基本信息
- 路径：`/v1/proposal/overview`
- 方法：`GET`
- 服务对象：方案概览表
- 可信度：已代码验证

## 返回字段
- `proposal_type`
- `target_count`
- `target_amount`
- `actual_count`
- `actual_amount`

## 后端实现
- 服务：`backend/app/services/proposal_service.py#get_proposal_overview`

## 当前限制
- 实际数量基于 `COUNT(t.special_remarks)`
- 实际金额会换算为万，目标金额显示单位需再次确认
