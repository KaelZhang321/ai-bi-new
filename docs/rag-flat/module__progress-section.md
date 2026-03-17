---
kb: meeting-bi
doc_type: module
source_path: docs/rag/modules/progress-section.md
source_file: progress-section.md
title: 模块卡：各区域完成度
summary: 各区域完成度模块以横向条形图展示不同区域的达成金额、成交高限和完成率，用于横向排行比较。
language: zh-CN
version_date: 2026-03-17
---
# 模块卡：各区域完成度

一句话摘要：各区域完成度模块以横向条形图展示不同区域的达成金额、成交高限和完成率，用于横向排行比较。

## 模块信息
- 类型：模块卡
- 模块名称：各区域完成度
- 所属页面：目标达成页
- 业务目的：比较不同区域的结果表现
- 可信度：已代码验证

## 展示内容
- 达成金额
- 成交高限
- 完成率
- 平均完成率

## 关联接口
- `../apis/progress-ranking.md`

## 关键字段
- `region`
- `deal_amount`
- `high_limit`
- `completion_rate`

## 当前限制
- 当前完成度分母使用 `deal_target_high`
- 与目标达成表的“达成率”不是一套口径

## 代码锚点
- `frontend/src/components/sections/ProgressSection.tsx`
- `backend/app/services/progress_service.py`
