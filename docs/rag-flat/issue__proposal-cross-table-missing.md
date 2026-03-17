---
kb: meeting-bi
doc_type: issue
source_path: docs/rag/issues/proposal-cross-table-missing.md
source_file: proposal-cross-table-missing.md
title: 问题卡：多维交叉明细表未正式开放
summary: 前端仍保留方案交叉表能力位，但后端 `/v1/proposal/cross-table` 接口当前已注释，形成功能残缺状态。
language: zh-CN
version_date: 2026-03-17
---
# 问题卡：多维交叉明细表未正式开放

一句话摘要：前端仍保留方案交叉表能力位，但后端 `/v1/proposal/cross-table` 接口当前已注释，形成功能残缺状态。

## 问题信息
- 类型：前后端不一致
- 影响范围：目标达成页、方案模块
- 当前状态：前端预留，后端未开放

## 现象描述
- `frontend` 仍存在 `useProposalCrossTable`
- `proposal.py` 中 `cross-table` 路由被注释
- 页面当前主要展示方案概览表

## 建议后续动作
- 若能力废弃，应删除前端残留引用
- 若能力保留，应恢复接口并补充口径文档

## 代码锚点
- `frontend/src/hooks/useApi.ts`
- `frontend/src/components/sections/ProposalSection.tsx`
- `backend/app/api/v1/proposal.py`
