# 接口卡：目标客户明细

一句话摘要：`GET /v1/source/target-detail` 按区域返回目标客户详细信息和是否抵达状态，用于目标客户下钻弹窗。

## 基本信息
- 路径：`/v1/source/target-detail`
- 方法：`GET`
- 入参：`region`
- 服务对象：目标客户明细弹窗
- 可信度：已代码验证

## 返回字段
- `customer_name`
- `region`
- `customer_level`
- `new_or_old_customer`
- `min_deal`
- `max_deal`
- `prep_maturity`
- `is_arrived`

## 后端实现
- 服务：`backend/app/services/source_service.py#get_target_customer_detail`

## 当前限制
- `is_arrived` 仅依据签到状态映射布尔值
