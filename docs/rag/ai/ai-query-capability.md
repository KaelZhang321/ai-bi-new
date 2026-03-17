# 能力卡：AI 问数能力

一句话摘要：AI 问数能力允许用户直接提问会议数据问题，系统自动完成问题改写、相关性判断、SQL 生成、查询执行、图表推荐与答案生成。

## 能力信息
- 类型：AI 能力卡
- 能力名称：AI 问数
- 服务入口：桌面端 AI 面板、移动端 AI 面板、企业微信文本问数
- 可信度：已代码验证

## 处理流程
1. 接收问题
2. 基于上下文重写问题
3. 判断是否属于会议 BI 数据域
4. 生成 SQL
5. 校验 SQL 安全性
6. 执行 SQL
7. 自动推荐图表
8. 生成中文答案
9. 保存会话上下文

## 主要组件
- `backend/app/ai/query_executor.py`
- `backend/app/ai/vanna_client.py`
- `backend/app/ai/context_store.py`
- `frontend/src/components/sections/AiChatPanel.tsx`

## 输出形态
- SQL
- 表格结果
- 图表配置
- 自然语言答案

## 当前限制
- SQL 校验是规则型，不是完整隔离执行环境
- 图表推荐按结果结构启发式判断
