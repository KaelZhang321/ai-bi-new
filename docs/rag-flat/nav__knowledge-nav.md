---
kb: meeting-bi
doc_type: nav
source_path: docs/rag/00-知识库导航.md
source_file: 00-知识库导航.md
title: 会议 BI RAG 知识库导航
summary: 本目录是会议 BI 系统的 RAG 入库导航，按页面、模块、接口、AI、指标、问题六个维度组织知识卡，供检索增强问答直接使用。
language: zh-CN
version_date: 2026-03-17
---
# 会议 BI RAG 知识库导航

一句话摘要：本目录是会议 BI 系统的 RAG 入库导航，按页面、模块、接口、AI、指标、问题六个维度组织知识卡，供检索增强问答直接使用。

## 1. 知识库定位

- 用途：供 RAG、内部问答、知识检索、新人 onboarding 使用
- 来源：当前仓库代码、接口定义、`docs/会议BI逆向PRD.md`
- 主原则：`代码 > 接口 > 文档 > 推断`
- 推荐入库方式：按文件逐篇入库，保留文件路径作为 metadata

## 2. 目录结构

- `pages/`：页面卡
- `modules/`：模块卡
- `apis/`：接口卡
- `ai/`：AI 与企业微信能力卡
- `metrics/`：指标口径卡
- `issues/`：问题卡
- `glossary.md`：术语表

## 3. 页面卡索引

- `pages/customer-page.md`
- `pages/operations-page.md`
- `pages/achievement-page.md`

## 4. 模块卡索引

- `modules/core-kpi.md`
- `modules/registration-section.md`
- `modules/customer-profile-section.md`
- `modules/customer-source-section.md`
- `modules/operations-section.md`
- `modules/achievement-section.md`
- `modules/progress-section.md`
- `modules/proposal-overview-section.md`

## 5. 接口卡索引

- `apis/kpi-overview.md`
- `apis/registration-chart.md`
- `apis/registration-matrix.md`
- `apis/registration-detail.md`
- `apis/customer-profile.md`
- `apis/source-distribution.md`
- `apis/source-target-arrival.md`
- `apis/source-target-detail.md`
- `apis/operations-kpi.md`
- `apis/operations-trend.md`
- `apis/achievement-chart.md`
- `apis/achievement-table.md`
- `apis/achievement-detail.md`
- `apis/progress-ranking.md`
- `apis/proposal-overview.md`
- `apis/proposal-detail.md`
- `apis/ai-query.md`
- `apis/ai-query-stream.md`
- `apis/wecom-status.md`
- `apis/wecom-test-push.md`
- `apis/chart-get.md`

## 6. 能力卡索引

- `ai/ai-query-capability.md`
- `ai/wecom-bot-capability.md`

## 7. 指标卡索引

- `metrics/registered-customers.md`
- `metrics/arrived-customers.md`
- `metrics/deal-amount.md`
- `metrics/roi.md`
- `metrics/completion-rate.md`
- `metrics/target-customer.md`

## 8. 问题卡索引

- `issues/registration-field-mismatch.md`
- `issues/proposal-cross-table-missing.md`
- `issues/metric-unit-consistency.md`
- `issues/wecom-schedule-mismatch.md`
- `issues/ai-sql-safety.md`
- `issues/achievement-detail-where-risk.md`

## 9. 推荐检索问法

- 客户总览页包含哪些模块
- 报名签到图表对应哪个接口
- 完成度的计算口径是什么
- AI 问数链路怎么跑
- 企业微信怎么回图表
- 当前系统有哪些已知问题

## 10. 关联主稿

- 逆向 PRD：`../会议BI逆向PRD.md`
- RAG 设计方案：`../plans/2026-03-17-meeting-bi-reverse-prd-rag-design.md`
