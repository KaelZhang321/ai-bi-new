# 问题卡：报名与画像字段口径混用

一句话摘要：当前客户相关模块大量使用 `real_identity`，但前端和旧文档中常把它表述为“金额等级”，存在字段语义错位。

## 问题信息
- 类型：口径偏差
- 影响范围：客户总览页、画像模块、报名签到模块
- 当前状态：已存在，待统一

## 现象描述
- 报名图表和矩阵表按 `real_identity` 分组
- 客户画像中的“金额等级分布”也基于 `real_identity`
- 历史文档更倾向使用 `customer_level_name` 等描述

## 根因判断
- 页面表达沿用了业务说法，但实际实现字段不同

## 建议后续动作
- 统一“金额等级”“身份类型”“real_identity”的业务命名
- 为 RAG 增加强提示，避免回答时混淆

## 代码锚点
- `backend/app/services/registration_service.py`
- `backend/app/services/customer_service.py`
