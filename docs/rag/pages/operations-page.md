# 页面卡：运营数据页

一句话摘要：运营数据页展示会议过程中的签到、接机、离开、到院等运营指标与时间趋势，用于会中监控和过程复盘。

## 基本信息
- 类型：页面卡
- 页面名称：运营数据
- 桌面端入口：`/` 页面中的“运营数据”页签
- 移动端入口：移动端第 2 个 Tab
- 目标用户：会议运营、管理层、数据支持
- 可信度：已代码验证

## 页面目标
- 快速查看当天核心运营人数
- 判断不同时间段的过程趋势
- 通过场景筛选定位波动点

## 核心模块
- `../modules/operations-section.md`

## 关键接口
- `../apis/operations-kpi.md`
- `../apis/operations-trend.md`

## 关键指标
- 签到人数
- 接机人数
- 离开人数
- 到院人数
- 各场景时段人数

## 当前限制
- KPI 支持单日查询，趋势接口当前未按日期过滤
- 时间段和场景依赖字符串匹配归类

## 代码锚点
- `frontend/src/pages/PageOperations.tsx`
- `frontend/src/components/sections/OperationsSection.tsx`
