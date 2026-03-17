---
kb: meeting-bi
doc_type: api
source_path: docs/rag/apis/registration-chart.md
source_file: registration-chart.md
title: 接口卡：报名签到图表
summary: `GET /v1/registration/chart` 返回各区域按 `real_identity` 维度统计的报名数和抵达数，用于报名 VS 签到堆叠柱图。
language: zh-CN
version_date: 2026-03-17
---
# 接口卡：报名签到图表

一句话摘要：`GET /v1/registration/chart` 返回各区域按 `real_identity` 维度统计的报名数和抵达数，用于报名 VS 签到堆叠柱图。

## 基本信息
- 路径：`/v1/registration/chart`
- 方法：`GET`
- 服务对象：报名/抵达堆叠柱图
- 可信度：已代码验证

## 返回字段
- `region`
- `real_identity`
- `register_count`
- `arrive_count`

## 调用方
- `frontend/src/hooks/useApi.ts#useRegistrationChart`
- `frontend/src/components/sections/RegistrationSection.tsx`

## 后端实现
- 路由：`backend/app/api/v1/registration.py`
- 服务：`backend/app/services/registration_service.py#get_region_level_chart`

## 主要数据源
- `meeting_registration`

## 当前限制
- 图表语义上叫“金额等级”，实际字段是 `real_identity`
- 已过滤“市场”和“陪同”相关记录
