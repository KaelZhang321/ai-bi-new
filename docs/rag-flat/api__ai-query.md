---
kb: meeting-bi
doc_type: api
source_path: docs/rag/apis/ai-query.md
source_file: ai-query.md
title: 接口卡：AI 问数
summary: `POST /v1/ai/query` 接收自然语言问题，返回 SQL、结果表、自然语言回答和可选图表配置。
language: zh-CN
version_date: 2026-03-17
---
# 接口卡：AI 问数

一句话摘要：`POST /v1/ai/query` 接收自然语言问题，返回 SQL、结果表、自然语言回答和可选图表配置。

## 基本信息
- 路径：`/v1/ai/query`
- 方法：`POST`
- 入参：`question`、`conversation_id`
- 服务对象：桌面端 / 移动端 AI 问数
- 可信度：已代码验证

## 返回字段
- `sql`
- `columns`
- `rows`
- `answer`
- `chart`

## 调用方
- `frontend/src/api/ai.ts#postAiQuery`
- `frontend/src/components/sections/AiChatPanel.tsx`

## 后端实现
- 路由：`backend/app/api/v1/ai_query.py`
- 核心执行：`backend/app/ai/query_executor.py#execute_ai_query`
- 模型接入：`backend/app/ai/vanna_client.py`

## 当前限制
- 只允许 `SELECT`
- 相关性判断失败时默认放行
