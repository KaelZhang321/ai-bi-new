# 接口卡：客户画像

一句话摘要：`GET /v1/customer/profile` 返回金额等级分布、身份类型分布、新老客户分布三组数据，用于客户画像分析模块。

## 基本信息
- 路径：`/v1/customer/profile`
- 方法：`GET`
- 服务对象：客户画像分析
- 可信度：已代码验证

## 返回结构
- `level_distribution`
- `role_distribution`
- `new_old_distribution`

每组元素包含：`name`、`value`、`percentage`

## 调用方
- `frontend/src/hooks/useApi.ts#useCustomerProfile`
- `frontend/src/components/sections/CustomerProfileSection.tsx`

## 后端实现
- 服务：`backend/app/services/customer_service.py#get_customer_profile`

## 当前限制
- 三组分布的字段来源不同，页面解释上容易被看作同一层级指标
