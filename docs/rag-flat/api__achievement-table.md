---
kb: meeting-bi
doc_type: api
source_path: docs/rag/apis/achievement-table.md
source_file: achievement-table.md
title: 接口卡：目标达成明细表
summary: `GET /v1/achievement/table` 返回各区域的实际金额、目标金额、达成率和差值，用于达成率明细表。
language: zh-CN
version_date: 2026-03-17
---
# 接口卡：目标达成明细表

一句话摘要：`GET /v1/achievement/table` 返回各区域的实际金额、目标金额、达成率和差值，用于达成率明细表。

## 基本信息
- 路径：`/v1/achievement/table`
- 方法：`GET`
- 服务对象：达成率明细表
- 可信度：已代码验证

## 返回字段
- `row_num`
- `region`
- `actual_amount`
- `target_amount`
- `min_limit`
- `max_limit`
- `achievement_rate`
- `difference`

## 后端实现
- 服务：`backend/app/services/achievement_service.py#get_achievement_table`

## 当前限制
- 达成率以 `actual_amount / target_amount` 计算，与 progress 的完成度口径不同
