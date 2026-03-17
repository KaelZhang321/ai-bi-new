# 模块卡：报名 VS 签到情况

一句话摘要：该模块通过堆叠柱图和矩阵表展示各大区客户报名与抵达情况，并支持按区域与标签下钻客户明细。

## 模块信息
- 类型：模块卡
- 模块名称：报名 VS 签到情况
- 所属页面：客户总览页
- 业务目的：判断不同大区的参会规模和到场质量
- 可信度：已代码验证

## 展示内容
- 报名/抵达堆叠柱图
- 金额等级矩阵表
- 客户明细弹窗

## 关联接口
- `../apis/registration-chart.md`
- `../apis/registration-matrix.md`
- `../apis/registration-detail.md`

## 关键字段
- `market_service_attribution`
- `real_identity`
- `sign_in_status`
- `customer_unique_id`

## 当前限制
- 当前主分层字段是 `real_identity`
- “金额等级”属于界面表达，不完全等于真实字段语义

## 代码锚点
- `frontend/src/components/sections/RegistrationSection.tsx`
- `backend/app/services/registration_service.py`
