---
kb: meeting-bi
doc_type: api
source_path: docs/rag/apis/proposal-detail.md
source_file: proposal-detail.md
title: 接口卡：方案明细下钻
summary: `GET /v1/proposal/detail` 按区域和方案类型返回成交明细，用于方案视角的下钻查看。
language: zh-CN
version_date: 2026-03-17
---
# 接口卡：方案明细下钻

一句话摘要：`GET /v1/proposal/detail` 按区域和方案类型返回成交明细，用于方案视角的下钻查看。

## 基本信息
- 路径：`/v1/proposal/detail`
- 方法：`GET`
- 入参：`region`、`proposal_type`
- 服务对象：方案明细
- 可信度：已代码验证

## 返回字段
- `customer_name`
- `region`
- `deal_content`
- `new_deal_amount`
- `received_amount`
- `record_date`

## 后端实现
- 服务：`backend/app/services/proposal_service.py#get_proposal_detail`

## 当前限制
- 海心卡 / 细胞卡使用特殊模糊匹配逻辑
