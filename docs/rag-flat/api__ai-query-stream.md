---
kb: meeting-bi
doc_type: api
source_path: docs/rag/apis/ai-query-stream.md
source_file: ai-query-stream.md
title: 接口卡：AI 流式问数
summary: `POST /v1/ai/query/stream` 通过 SSE 分阶段返回 SQL、数据、图表和答案，用于更强交互反馈的 AI 问数体验。
language: zh-CN
version_date: 2026-03-17
---
# 接口卡：AI 流式问数

一句话摘要：`POST /v1/ai/query/stream` 通过 SSE 分阶段返回 SQL、数据、图表和答案，用于更强交互反馈的 AI 问数体验。

## 基本信息
- 路径：`/v1/ai/query/stream`
- 方法：`POST`
- 协议：SSE
- 服务对象：AI 流式问数
- 可信度：已代码验证

## 事件类型
- `sql`
- `data`
- `chart`
- `answer`
- `error`

## 调用方
- `frontend/src/api/ai.ts#streamAiQuery`
- `frontend/src/components/sections/AiChatPanel.tsx`

## 后端实现
- `backend/app/api/v1/ai_query.py#ai_query_stream`
- `backend/app/ai/query_executor.py#execute_ai_query_stream`

## 当前限制
- 事件是分阶段发送，不是 token 级文本流
