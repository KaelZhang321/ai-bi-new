---
kb: meeting-bi
doc_type: api
source_path: docs/rag/apis/wecom-test-push.md
source_file: wecom-test-push.md
title: 接口卡：企业微信测试推送
summary: `POST /v1/wecom/test-push` 会手动触发一次群机器人 Webhook 推送，主要用于验证定时推送链路是否正常。
language: zh-CN
version_date: 2026-03-17
---
# 接口卡：企业微信测试推送

一句话摘要：`POST /v1/wecom/test-push` 会手动触发一次群机器人 Webhook 推送，主要用于验证定时推送链路是否正常。

## 基本信息
- 路径：`/v1/wecom/test-push`
- 方法：`POST`
- 服务对象：企业微信测试推送
- 可信度：已代码验证

## 执行逻辑
- 检查是否配置 `WECOM_WEBHOOK_URL`
- 调用 `push_via_webhook()`
- 返回推送结果

## 后端实现
- `backend/app/api/v1/wecom.py#test_push`
- `backend/app/wecom/scheduler.py#push_via_webhook`
