---
kb: meeting-bi
doc_type: page
source_path: docs/rag/pages/customer-page.md
source_file: customer-page.md
title: 页面卡：客户总览页
summary: 客户总览页汇总报名与抵达、客户画像、来源结构和目标客户抵达情况，用于判断参会客户质量与到场质量。
language: zh-CN
version_date: 2026-03-17
---
# 页面卡：客户总览页

一句话摘要：客户总览页汇总报名与抵达、客户画像、来源结构和目标客户抵达情况，用于判断参会客户质量与到场质量。

## 基本信息
- 类型：页面卡
- 页面名称：客户总览
- 桌面端入口：`/` 页面中的“客户总览”页签
- 移动端入口：移动端第 1 个 Tab
- 目标用户：业务负责人、市场、客户运营、管理层
- 可信度：已代码验证

## 页面目标
- 看客户规模与到场质量
- 看客户结构与身份分布
- 看来源渠道与重点客户抵达情况

## 核心模块
- `../modules/registration-section.md`
- `../modules/customer-profile-section.md`
- `../modules/customer-source-section.md`

## 关键接口
- `../apis/registration-chart.md`
- `../apis/registration-matrix.md`
- `../apis/customer-profile.md`
- `../apis/source-distribution.md`
- `../apis/source-target-arrival.md`

## 关键指标
- 报名客户
- 已抵达客户
- 报名/抵达数量
- 身份分布
- 新老客户占比
- 目标客户抵达数

## 当前限制
- 报名模块与画像模块都大量使用 `real_identity`，容易和“金额等级”概念混淆
- 目标客户定义偏实现口径，不一定等于业务最终定义

## 代码锚点
- `frontend/src/pages/PageCustomer.tsx`
- `frontend/src/components/sections/RegistrationSection.tsx`
- `frontend/src/components/sections/CustomerProfileSection.tsx`
- `frontend/src/components/sections/CustomerSourceSection.tsx`
