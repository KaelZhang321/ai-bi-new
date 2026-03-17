---
kb: meeting-bi
doc_type: page
source_path: docs/rag/pages/achievement-page.md
source_file: achievement-page.md
title: 页面卡：目标达成页
summary: 目标达成页汇总区域目标达成、区域完成度与方案概览，用于会议结果复盘和经营判断。
language: zh-CN
version_date: 2026-03-17
---
# 页面卡：目标达成页

一句话摘要：目标达成页汇总区域目标达成、区域完成度与方案概览，用于会议结果复盘和经营判断。

## 基本信息
- 类型：页面卡
- 页面名称：目标达成
- 桌面端入口：`/` 页面中的“目标达成”页签
- 移动端入口：移动端第 3 个 Tab
- 目标用户：管理层、业务负责人、数据支持
- 可信度：已代码验证

## 页面目标
- 看各区域目标完成情况
- 看区域横向完成度排行
- 看各成交方案目标与实际达成

## 核心模块
- `../modules/achievement-section.md`
- `../modules/progress-section.md`
- `../modules/proposal-overview-section.md`

## 关键接口
- `../apis/achievement-chart.md`
- `../apis/achievement-table.md`
- `../apis/progress-ranking.md`
- `../apis/proposal-overview.md`

## 关键指标
- 达成金额
- 目标金额
- 达成率
- 完成度
- 方案目标金额
- 方案实际金额

## 当前限制
- “达成率”和“完成度”不是同一口径
- 多维交叉明细表前端有能力位，后端未正式开放接口

## 代码锚点
- `frontend/src/pages/PageAchievement.tsx`
- `frontend/src/components/sections/AchievementSection.tsx`
- `frontend/src/components/sections/ProgressSection.tsx`
- `frontend/src/components/sections/ProposalSection.tsx`
