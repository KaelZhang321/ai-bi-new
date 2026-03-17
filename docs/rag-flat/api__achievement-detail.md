---
kb: meeting-bi
doc_type: api
source_path: docs/rag/apis/achievement-detail.md
source_file: achievement-detail.md
title: 接口卡：成交明细下钻
summary: `GET /v1/achievement/detail` 根据区域返回成交明细，用于目标达成图或表的下钻弹窗。
language: zh-CN
version_date: 2026-03-17
---
# 接口卡：成交明细下钻

一句话摘要：`GET /v1/achievement/detail` 根据区域返回成交明细，用于目标达成图或表的下钻弹窗。

## 基本信息
- 路径：`/v1/achievement/detail`
- 方法：`GET`
- 入参：`region`
- 服务对象：成交明细弹窗
- 可信度：已代码验证

## 返回字段
- `customer_name`
- `region`
- `branch`
- `deal_type`
- `deal_content`
- `new_deal_amount`
- `received_amount`
- `plan_type`
- `record_date`

## 后端实现
- 服务：`backend/app/services/achievement_service.py#get_achievement_detail`

## 当前限制
- 条件 SQL 用字符串拼接，空条件时存在维护风险
