# 接口卡：报名签到明细

一句话摘要：`GET /v1/registration/detail` 按区域和标签返回客户明细，用于报名/抵达图表点击后的下钻弹窗。

## 基本信息
- 路径：`/v1/registration/detail`
- 方法：`GET`
- 入参：`region`、`level`
- 服务对象：报名签到明细弹窗
- 可信度：已代码验证

## 返回字段
- `customer_name`
- `sign_in_status`
- `customer_category`
- `real_identity`
- `attendee_role`
- `store_name`
- `region`

## 调用方
- `frontend/src/api/registration.ts#fetchRegistrationDetail`
- `frontend/src/components/sections/RegistrationSection.tsx`

## 后端实现
- 服务：`backend/app/services/registration_service.py#get_registration_detail`

## 当前限制
- `level=未分类` 会特殊转成 `real_identity IS NULL`
- 当前排序规则偏展示导向，不是业务优先级排序
