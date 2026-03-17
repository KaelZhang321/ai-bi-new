---
kb: meeting-bi
doc_type: metric
source_path: docs/rag/metrics/arrived-customers.md
source_file: arrived-customers.md
title: 指标卡：已抵达客户
summary: 已抵达客户表示签到状态为“已签到”的去重客户数，是衡量实际到场质量的核心指标。
language: zh-CN
version_date: 2026-03-17
---
# 指标卡：已抵达客户

一句话摘要：已抵达客户表示签到状态为“已签到”的去重客户数，是衡量实际到场质量的核心指标。

## 指标信息
- 指标名称：已抵达客户
- 可信度：已代码验证

## 当前计算规则
- 数据表：`meeting_registration`
- 条件：`sign_in_status = '已签到'`
- 去重字段：`customer_unique_id`
- 过滤：排除市场和陪同相关记录

## 展示位置
- 顶部 KPI
- 客户总览相关模块的业务解释中

## 当前风险
- 依赖签到状态文本是否标准化
