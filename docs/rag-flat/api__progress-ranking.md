---
kb: meeting-bi
doc_type: api
source_path: docs/rag/apis/progress-ranking.md
source_file: progress-ranking.md
title: 接口卡：区域完成度排行
summary: `GET /v1/progress/ranking` 返回各区域的达成金额、成交高限与完成率，用于区域完成度模块。
language: zh-CN
version_date: 2026-03-17
---
# 接口卡：区域完成度排行

一句话摘要：`GET /v1/progress/ranking` 返回各区域的达成金额、成交高限与完成率，用于区域完成度模块。

## 基本信息
- 路径：`/v1/progress/ranking`
- 方法：`GET`
- 服务对象：各区域完成度
- 可信度：已代码验证

## 返回结构
- `items`：数组
- `avg_completion_rate`：平均完成率

`items` 字段：
- `region`
- `deal_amount`
- `high_limit`
- `completion_rate`

## 后端实现
- 服务：`backend/app/services/progress_service.py#get_progress`

## 当前限制
- 完成率分母使用 `high_limit`
