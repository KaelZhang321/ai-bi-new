---
kb: meeting-bi
doc_type: glossary
source_path: docs/rag/glossary.md
source_file: glossary.md
title: 会议 BI 术语表
summary: 本表收录会议 BI 系统中高频业务词、页面词与技术词，用于减少 RAG 回答时的口径歧义。
language: zh-CN
version_date: 2026-03-17
---
# 会议 BI 术语表

一句话摘要：本表收录会议 BI 系统中高频业务词、页面词与技术词，用于减少 RAG 回答时的口径歧义。

## 术语清单

### 会议 BI
- 定义：当前系统的整体名称，包含大屏看板、AI 问数、企业微信能力。
- 相关卡：`pages/customer-page.md`、`pages/operations-page.md`、`pages/achievement-page.md`

### 客户总览
- 定义：桌面端一级页面之一，聚焦报名、画像、来源、目标客户抵达。
- 相关卡：`pages/customer-page.md`

### 运营数据
- 定义：桌面端一级页面之一，聚焦运营 KPI 与时间趋势。
- 相关卡：`pages/operations-page.md`

### 目标达成
- 定义：桌面端一级页面之一，聚焦区域达成、完成度、方案概览。
- 相关卡：`pages/achievement-page.md`

### AI 问数
- 定义：用户用自然语言发问，系统自动生成 SQL 并返回答案与图表的能力。
- 相关卡：`ai/ai-query-capability.md`

### 企业微信机器人
- 定义：基于长连接和 Webhook 的企业微信接入能力，可单聊问数、卡片展示、定时推送。
- 相关卡：`ai/wecom-bot-capability.md`

### 完成度
- 定义：当前 `progress` 模块中使用 `达成金额 / 成交高限` 计算出的区域完成率。
- 相关卡：`metrics/completion-rate.md`

### 达成率
- 定义：当前 `achievement` 模块中使用 `实际金额 / 目标金额` 计算出的达成率。
- 相关卡：`modules/achievement-section.md`

### 优质目标客户
- 定义：当前实现中以 `meeting_customer_analysis.min_deal >= 100` 识别的客户集合。
- 相关卡：`metrics/target-customer.md`

### 图表独立页
- 定义：`/chart/:id` 对应的单图页面，企业微信卡片可跳转查看。
- 相关卡：`apis/chart-get.md`
