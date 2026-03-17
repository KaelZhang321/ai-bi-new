---
kb: meeting-bi
doc_type: metric
source_path: docs/rag/metrics/roi.md
source_file: roi.md
title: 指标卡：总投资回报率
summary: 总投资回报率是顶部 KPI 中的结果型指标，当前由固定预算和成交金额换算得到。
language: zh-CN
version_date: 2026-03-17
---
# 指标卡：总投资回报率

一句话摘要：总投资回报率是顶部 KPI 中的结果型指标，当前由固定预算和成交金额换算得到。

## 指标信息
- 指标名称：总投资回报率
- 可信度：已代码验证

## 当前计算规则
- 常量预算：`TOTAL_BUDGET = 600`
- 公式：`600 / deal_amount * 0.4`
- 最终展示：乘以 100，输出百分比

## 展示位置
- 顶部 KPI
- 移动端 KPI

## 当前风险
- 预算不是动态配置
- 公式业务含义需业务侧确认是否仍然适用

## 代码锚点
- `backend/app/services/kpi_service.py`
