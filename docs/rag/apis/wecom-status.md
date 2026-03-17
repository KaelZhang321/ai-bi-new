# 接口卡：企业微信状态

一句话摘要：`GET /v1/wecom/status` 返回企业微信长连接状态、订阅用户数量、调度时间和服务器时间，主要用于运维与调试。

## 基本信息
- 路径：`/v1/wecom/status`
- 方法：`GET`
- 服务对象：企业微信运维状态查看
- 可信度：已代码验证

## 返回重点
- `enabled`
- `connected`
- `connected_at`
- `message_count`
- `last_error`
- `subscribers`
- `subscriber_count`
- `scheduler_push_times`
- `server_time_cst`

## 后端实现
- `backend/app/api/v1/wecom.py#wecom_status`
- `backend/app/wecom/longconn.py`
- `backend/app/wecom/subscribers.py`
