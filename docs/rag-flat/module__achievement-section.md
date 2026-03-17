---
kb: meeting-bi
doc_type: module
source_path: docs/rag/modules/achievement-section.md
source_file: achievement-section.md
title: 模块卡：目标 VS 达成
summary: 目标 VS 达成模块从区域维度展示目标、达成金额、达成率，并支持下钻成交明细。
language: zh-CN
version_date: 2026-03-17
---
# 模块卡：目标 VS 达成

一句话摘要：目标 VS 达成模块从区域维度展示目标、达成金额、达成率，并支持下钻成交明细。

## 模块信息
- 类型：模块卡
- 模块名称：目标 VS 达成
- 所属页面：目标达成页
- 业务目的：复盘各区域经营结果
- 可信度：已代码验证

## 展示内容
- 区域达成图
- 达成率明细表
- 成交明细弹窗

## 关联接口
- `../apis/achievement-chart.md`
- `../apis/achievement-table.md`
- `../apis/achievement-detail.md`

## 关键字段
- `region`
- `deal_target`
- `deal_target_low`
- `deal_target_high`
- `new_deal_amount`

## 当前限制
- 图和表的目标字段来源同表，但业务解释仍需口径统一
- 明细接口的 SQL 组装存在维护风险

## 代码锚点
- `frontend/src/components/sections/AchievementSection.tsx`
- `backend/app/services/achievement_service.py`
