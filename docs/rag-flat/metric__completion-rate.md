---
kb: meeting-bi
doc_type: metric
source_path: docs/rag/metrics/completion-rate.md
source_file: completion-rate.md
title: 指标卡：完成度 / 完成率
summary: 当前系统中“达成率”和“完成度”是两个相近但不完全相同的指标口径，RAG 回答时必须区分模块上下文。
language: zh-CN
version_date: 2026-03-17
---
# 指标卡：完成度 / 完成率

一句话摘要：当前系统中“达成率”和“完成度”是两个相近但不完全相同的指标口径，RAG 回答时必须区分模块上下文。

## 指标信息
- 指标名称：完成度 / 达成率
- 可信度：已代码验证

## 当前两种口径

### 口径 A：目标达成模块中的达成率
- 公式：`actual_amount / target_amount * 100`
- 位置：`achievement` 模块表格
- 代码：`backend/app/services/achievement_service.py`

### 口径 B：区域完成度模块中的完成度
- 公式：`deal_amount / high_limit * 100`
- 位置：`progress` 模块
- 代码：`backend/app/services/progress_service.py`

## 当前风险
- 页面上都可能被业务理解为“完成率”
- RAG 若不带模块上下文，容易答错
