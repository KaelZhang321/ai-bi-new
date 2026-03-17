---
kb: meeting-bi
doc_type: module
source_path: docs/rag/modules/customer-source-section.md
source_file: customer-source-section.md
title: 模块卡：客户来源 + 任务进展
summary: 该模块同时展示客户来源结构和优质目标客户抵达情况，用于判断渠道贡献与重点客户到场质量。
language: zh-CN
version_date: 2026-03-17
---
# 模块卡：客户来源 + 任务进展

一句话摘要：该模块同时展示客户来源结构和优质目标客户抵达情况，用于判断渠道贡献与重点客户到场质量。

## 模块信息
- 类型：模块卡
- 模块名称：客户来源 + 任务进展
- 所属页面：客户总览页
- 业务目的：看来源效果和重点客户到场结果
- 可信度：已代码验证

## 展示内容
- 客户报名统计（按大区·来源）
- 优质目标客户抵达
- 目标客户明细下钻

## 关联接口
- `../apis/source-distribution.md`
- `../apis/source-target-arrival.md`
- `../apis/source-target-detail.md`

## 关键字段
- `store_name`
- `region`
- `min_deal`
- `sign_in_status`

## 当前限制
- 来源类型依赖店铺名称模糊匹配
- 目标客户定义当前使用 `min_deal >= 100`

## 代码锚点
- `frontend/src/components/sections/CustomerSourceSection.tsx`
- `backend/app/services/source_service.py`
