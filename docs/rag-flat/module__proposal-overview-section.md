---
kb: meeting-bi
doc_type: module
source_path: docs/rag/modules/proposal-overview-section.md
source_file: proposal-overview-section.md
title: 模块卡：方案概览表
summary: 方案概览表模块从方案维度展示目标数量、目标金额、实际数量、实际金额，是结果复盘中的方案视角看板。
language: zh-CN
version_date: 2026-03-17
---
# 模块卡：方案概览表

一句话摘要：方案概览表模块从方案维度展示目标数量、目标金额、实际数量、实际金额，是结果复盘中的方案视角看板。

## 模块信息
- 类型：模块卡
- 模块名称：方案概览表
- 所属页面：目标达成页
- 业务目的：从方案而非区域维度复盘经营结果
- 可信度：已代码验证

## 展示内容
- 方案名称
- 目标数量
- 目标金额
- 实际数量
- 实际金额

## 关联接口
- `../apis/proposal-overview.md`
- `../apis/proposal-detail.md`

## 关键字段
- `proposal_type`
- `target_count`
- `target_amount`
- `actual_count`
- `actual_amount`

## 当前限制
- 实际数量当前按 `special_remarks` 计数
- 多维交叉明细表能力位还未正式开放后端接口

## 代码锚点
- `frontend/src/components/sections/ProposalSection.tsx`
- `backend/app/services/proposal_service.py`
