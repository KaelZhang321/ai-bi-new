# 能力卡：企业微信机器人能力

一句话摘要：企业微信机器人能力把 AI 问数和 KPI 推送延伸到企微场景，支持单聊问数、卡片回复、图表图片和定时群推送。

## 能力信息
- 类型：AI / 通道能力卡
- 能力名称：企业微信机器人
- 服务入口：企业微信长连接、Webhook 群机器人
- 可信度：已代码验证

## 支持能力
- 文本问数
- 语音转文字后问数
- 模板卡片回复
- 图表图片发送
- KPI 定时推送
- 连接状态查看

## 主要组件
- `backend/app/wecom/longconn.py`
- `backend/app/wecom/handlers.py`
- `backend/app/wecom/scheduler.py`
- `backend/app/wecom/subscribers.py`

## 当前限制
- 图片和文件消息暂不支持真正业务处理
- 定时推送文档注释与实际配置时间不一致
