---
kb: meeting-bi
doc_type: issue
source_path: docs/rag/issues/ai-sql-safety.md
source_file: ai-sql-safety.md
title: 问题卡：AI SQL 安全校验仍偏规则型
summary: 当前 AI 问数仅通过关键字规则限制非 SELECT SQL，具备基础防护，但仍不是完整的安全执行沙箱。
language: zh-CN
version_date: 2026-03-17
---
# 问题卡：AI SQL 安全校验仍偏规则型

一句话摘要：当前 AI 问数仅通过关键字规则限制非 SELECT SQL，具备基础防护，但仍不是完整的安全执行沙箱。

## 问题信息
- 类型：技术风险
- 影响范围：AI 问数、企业微信问数
- 当前状态：已存在

## 现象描述
- 仅允许 `SELECT` 开头
- 通过正则排除更新、删除、DDL 等关键字
- 未引入更细粒度的 SQL AST 审核或数据库隔离策略

## 建议后续动作
- 增加更严格的 SQL 校验策略
- 对高风险表或字段增加白名单

## 代码锚点
- `backend/app/ai/query_executor.py#validate_sql`
