# 指标卡：已成交金额

一句话摘要：已成交金额是当前系统用于衡量经营结果的核心金额指标，多个模块都会引用它或其衍生值。

## 指标信息
- 指标名称：已成交金额
- 可信度：已代码验证

## 当前计算规则
- 数据表：`meeting_transaction_details`
- 字段：`new_deal_amount`
- 计算：求和后在多个服务中换算为“万”

## 展示位置
- 顶部 KPI
- 目标达成图
- 区域完成度
- 方案概览表的实际金额

## 常见误解
- 页面中有的金额已换算为“万”，有的目标金额显示口径待确认

## 代码锚点
- `backend/app/services/kpi_service.py`
- `backend/app/services/achievement_service.py`
- `backend/app/services/progress_service.py`
- `backend/app/services/proposal_service.py`
