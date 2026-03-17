# 模块卡：客户画像分析

一句话摘要：客户画像分析模块从身份档位、身份类型、新老客户三个角度描述参会客群结构。

## 模块信息
- 类型：模块卡
- 模块名称：客户画像分析
- 所属页面：客户总览页
- 业务目的：看客户质量、角色构成和新老占比
- 可信度：已代码验证

## 展示内容
- 金额等级分布
- 身份类型分布
- 新老客户对比

## 关联接口
- `../apis/customer-profile.md`

## 关键字段
- `real_identity`
- `customer_category`
- `customer_unique_id`

## 当前限制
- 当前“金额等级分布”统计来源是 `real_identity`
- 身份类型与金额等级的业务解释边界不够清晰

## 代码锚点
- `frontend/src/components/sections/CustomerProfileSection.tsx`
- `backend/app/services/customer_service.py`
