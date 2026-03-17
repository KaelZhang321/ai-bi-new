---
kb: meeting-bi
doc_type: api
source_path: docs/rag/apis/registration-matrix.md
source_file: registration-matrix.md
title: 接口卡：报名签到矩阵表
summary: `GET /v1/registration/matrix` 返回各区域的千万/百万/普通报名与抵达矩阵，用于金额等级矩阵表展示。
language: zh-CN
version_date: 2026-03-17
---
# 接口卡：报名签到矩阵表

一句话摘要：`GET /v1/registration/matrix` 返回各区域的千万/百万/普通报名与抵达矩阵，用于金额等级矩阵表展示。

## 基本信息
- 路径：`/v1/registration/matrix`
- 方法：`GET`
- 服务对象：报名签到矩阵表
- 可信度：已代码验证

## 返回字段
- `region`
- `qianwan_register`
- `qianwan_arrive`
- `baiwan_register`
- `baiwan_arrive`
- `putong_register`
- `putong_arrive`
- `total_register`
- `total_arrive`

## 调用方
- `frontend/src/hooks/useApi.ts#useRegistrationMatrix`
- `frontend/src/components/sections/RegistrationSection.tsx`

## 后端实现
- 服务：`backend/app/services/registration_service.py#get_matrix_table`

## 当前限制
- 千万/百万/普通的分类规则基于 `real_identity LIKE` 字符串判断
