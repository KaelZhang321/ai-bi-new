---
kb: meeting-bi
doc_type: api
source_path: docs/rag/apis/chart-get.md
source_file: chart-get.md
title: 接口卡：图表缓存读取
summary: `GET /v1/chart/{chart_id}` 根据缓存 ID 返回图表配置，供企业微信卡片跳转到独立图表页查看。
language: zh-CN
version_date: 2026-03-17
---
# 接口卡：图表缓存读取

一句话摘要：`GET /v1/chart/{chart_id}` 根据缓存 ID 返回图表配置，供企业微信卡片跳转到独立图表页查看。

## 基本信息
- 路径：`/v1/chart/{chart_id}`
- 方法：`GET`
- 服务对象：图表独立页
- 可信度：已代码验证

## 返回结构
- `chart_type`
- `categories`
- `series`

## 调用方
- `frontend/src/pages/ChartView.tsx`

## 后端实现
- 路由：`backend/app/api/v1/chart.py`
- 缓存：`backend/app/services/chart_store.py`

## 当前限制
- 图表缓存采用内存 TTL，默认 24 小时，重启后会丢失
