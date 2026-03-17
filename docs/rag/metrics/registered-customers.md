# 指标卡：报名客户

一句话摘要：报名客户是当前系统顶部 KPI 之一，表示满足过滤条件的去重报名客户数。

## 指标信息
- 指标名称：报名客户
- 可信度：已代码验证

## 业务含义
表示本次会议报名进入客户池的客户规模，是判断活动覆盖面的基础指标。

## 当前计算规则
- 数据表：`meeting_registration`
- 口径：`COUNT(DISTINCT customer_unique_id)`
- 过滤：`real_identity IS NOT NULL`，且排除“市场”“陪同”相关记录

## 展示位置
- 顶部 KPI
- 移动端首页 KPI

## 常见误解
- 不是所有报名记录数，而是去重客户数
- 不包含市场和陪同相关记录

## 代码锚点
- `backend/app/services/kpi_service.py`
