# 问题卡：目标达成明细查询存在 WHERE 组装风险

一句话摘要：目标达成明细接口使用字符串拼接构造 WHERE 条件，在无筛选条件时存在生成非法 SQL 的维护风险。

## 问题信息
- 类型：实现风险
- 影响范围：目标达成明细下钻
- 当前状态：已存在

## 现象描述
- `conditions` 初始为空
- `where = " AND ".join(conditions)`
- SQL 直接写入 `WHERE {where}`

## 根因判断
- 查询构造未对空条件做兜底处理

## 建议后续动作
- 改成基础条件 `1=1`
- 或在无筛选时直接不拼接 WHERE 子句

## 代码锚点
- `backend/app/services/achievement_service.py#get_achievement_detail`
