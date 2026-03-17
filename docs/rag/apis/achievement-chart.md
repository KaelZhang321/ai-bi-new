# 接口卡：目标达成图表

一句话摘要：`GET /v1/achievement/chart` 返回各区域的成交低限、高限和达成金额，用于目标达成柱图。

## 基本信息
- 路径：`/v1/achievement/chart`
- 方法：`GET`
- 服务对象：目标 VS 达成图
- 可信度：已代码验证

## 返回字段
- `region`
- `low_limit`
- `high_limit`
- `deal_amount`

## 后端实现
- 服务：`backend/app/services/achievement_service.py#get_achievement_chart`

## 数据源
- `meeting_region_proposal_targets`
- `meeting_transaction_details`

## 当前限制
- 金额在服务层已统一换算为万
