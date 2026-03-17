---
kb: meeting-bi
doc_type: module
source_path: docs/rag/modules/operations-section.md
source_file: operations-section.md
title: 模块卡：运营数据模块
summary: 运营数据模块按日期展示签到、接机、离开、到院 KPI，并通过趋势图查看不同场景在各时段的人数变化。
language: zh-CN
version_date: 2026-03-17
---
# 模块卡：运营数据模块

一句话摘要：运营数据模块按日期展示签到、接机、离开、到院 KPI，并通过趋势图查看不同场景在各时段的人数变化。

## 模块信息
- 类型：模块卡
- 模块名称：运营数据
- 所属页面：运营数据页
- 业务目的：服务会中运营监控和过程复盘
- 可信度：已代码验证

## 展示内容
- 4 个运营 KPI 卡片
- 时间维度趋势分析折线图
- 日期筛选
- 场景筛选

## 关联接口
- `../apis/operations-kpi.md`
- `../apis/operations-trend.md`

## 关键字段
- `schedule_date`
- `time_period`
- `people_count`
- `scene_label`

## 当前限制
- 趋势接口不支持前端传日期筛选
- 场景归类来自字符串规则，不是标准事件枚举

## 代码锚点
- `frontend/src/components/sections/OperationsSection.tsx`
- `backend/app/services/operations_service.py`
