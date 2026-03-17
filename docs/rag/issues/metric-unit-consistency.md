# 问题卡：金额单位一致性风险

一句话摘要：当前多个金额接口与模块都涉及“是否换算为万”的问题，RAG 和业务阅读都存在单位误判风险。

## 问题信息
- 类型：指标口径风险
- 影响范围：KPI、目标达成、方案概览
- 当前状态：已存在，待统一

## 现象描述
- 部分服务层会将金额除以 10000
- 不同模块中的目标金额与实际金额显示方式可能不同
- 页面文案不总是显式说明单位换算来源

## 建议后续动作
- 增加统一金额单位规范
- 在接口卡和指标卡中强制标注单位

## 代码锚点
- `backend/app/services/kpi_service.py`
- `backend/app/services/achievement_service.py`
- `backend/app/services/proposal_service.py`
