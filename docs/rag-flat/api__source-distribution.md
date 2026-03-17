---
kb: meeting-bi
doc_type: api
source_path: docs/rag/apis/source-distribution.md
source_file: source-distribution.md
title: 接口卡：客户来源分布
summary: `GET /v1/source/distribution` 返回各区域按来源类型统计的客户数，用于客户报名统计图。
language: zh-CN
version_date: 2026-03-17
---
# 接口卡：客户来源分布

一句话摘要：`GET /v1/source/distribution` 返回各区域按来源类型统计的客户数，用于客户报名统计图。

## 基本信息
- 路径：`/v1/source/distribution`
- 方法：`GET`
- 服务对象：客户报名统计
- 可信度：已代码验证

## 返回字段
- `region`
- `source_type`
- `customer_count`

## 调用方
- `frontend/src/hooks/useApi.ts#useSourceDistribution`
- `frontend/src/components/sections/CustomerSourceSection.tsx`

## 后端实现
- 服务：`backend/app/services/source_service.py#get_source_distribution`

## 当前限制
- 来源类型按 `store_name` 模糊匹配为盟主/商务/店铺三类
