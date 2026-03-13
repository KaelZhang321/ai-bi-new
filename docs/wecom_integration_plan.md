# 企业微信集成技术方案

## 一、项目现状分析
- **架构**：仓库采用前后端分离（React 19 + Vite 前端，FastAPI + MySQL 后端），通过 Docker Compose 统一部署，API 暴露 `/api/v1` 路径。
- **后端**：` FastAPI` 入口启用 `lifespan` 进行数据库连通性检查，路由/服务按领域封装（如 `services/registration_service.py`），当前仅面向读多写少的看板查询，无用户级鉴权或外部平台集成。
- **配置**：`app/config.py` 仅包含数据库、火山引擎和 CORS 设置，可在此扩展企业微信所需的 `corp_id`、`secret` 等环境变量。
- **前端**：`axios` 统一调用 `/api`，结合 React Query 做缓存，未引入企业微信 JS-SDK，亦无免登或分享逻辑。
- **文档**：`docs/` 下暂无企业微信对接记录，需新增方案保证后续交接。

## 二、集成目标
1. **统一身份**：通过企业微信扫码/免登让内部用户直接访问 BI 看板，无需额外账号体系。
2. **消息触达**：定时或事件驱动推送 KPI 摘要、异常预警到企业微信应用/群。
3. **快捷入口**：在企业微信工作台、小程序或会话中嵌入仪表盘入口，并携带授权上下文。
4. **数据回流**：支持在企业微信内提交备注、触发 AI 问数等交互，结果写回系统。

## 三、分阶段实施方案

### 阶段 1：环境与企业微信配置
- 注册/启用企业微信自建应用或小程序，获取 `corp_id`、`agent_id`、`secret`、`token`、`encoding_aes_key`。
- 在 `.env` / `app/config.py` / `docker-compose.yml` 中新增 WeCom 相关变量并透传。
- 设置可信域名 `https://<bi-domain>/wecom`，准备公网可访问的 HTTPS 服务用于回调。

### 阶段 2：后端能力建设
- 新增 `services/wecom_service.py`，封装 `access_token` / `jsapi_ticket` 获取、缓存与消息发送，可使用 `httpx` 或 `wechatpy`。
- 建立缓存层（Redis 或 MySQL 表）保存 token/ticket；FastAPI `Depends` 注入统一校验。
- 提供基础 API：
  - `GET /api/v1/wecom/jsconfig?url=` 返回签名、`nonceStr`、`timestamp`。
  - `GET /api/v1/wecom/login?code=` 处理 OAuth 回调并绑定内部用户。
  - `POST /api/v1/wecom/interactive` 作为回调入口，校验 `msg_signature` 并分发事件。
- 设计 `wecom_users` 表（`wecom_userid`、`name`、`department_path`、`role` 等）与业务权限映射。

### 阶段 3：前端免登与工作台入口
- 在入口检测企业微信容器后调用 `/wecom/jsconfig`，注入企业微信 JS-SDK 并执行 `wx.login` 获取临时 `code`。
- 登录完成后由后台签发 JWT/Session，axios 拦截器附加 `Authorization` 头，实现受控访问。
- 新增 `WeComEntry` 页面/H5 轻量版本，专为企业微信工作台跳转；如需小程序，可以 WebView 承载现有 H5 并确保合法 `referer`。

### 阶段 4：消息推送与预警
- 基于现有 `kpi_service`、`progress_service` 等封装 KPI 统计函数，定义 Markdown/图文模板。
- 编写 `tasks/wecom_notifications.py`（APS cheduler 或 Celery）按日/周推送摘要，并提供 `POST /api/v1/wecom/notify` 手动触发接口。
- 对异常指标设阈值触发后台 `BackgroundTasks`，即时推送到指定群或个人。

### 阶段 5：交互与数据回流
- 为 AI 问数接口新增企业微信指令入口（机器人命令、Slash Command），经 `interactive` API 获取意图后调用现有 `ai_query` 服务并返回卡片。
- 在企业微信中使用表单/审批收集备注，Webhook 写入 `wecom_feedback` 表并展示到前端“备注/说明”组件。
- 全程记录回调验签与审计日志，满足安全与合规要求。

### 阶段 6：部署与测试
- 在 `docker-compose` 或 Kubernetes 中配置 Nginx/Ingress 提供 HTTPS，满足企业微信回调要求。
- 编写单元测试覆盖 token 缓存、回调验签、消息模板组装；准备沙箱企业微信账号做联调。
- 发布 checklist：配置项→免登→消息推送→回调→移动端自测→灰度发布。

## 四、长连接（WebSocket）接入方案

### 4.1 适用场景与约束
- 长连接 API 模式由企业微信官方在 2026-03-12 文档中定义，连接地址为 `wss://openws.work.weixin.qq.com`，通过 `aibot_subscribe` 完成身份校验。
- 无需公网回调 URL、无需处理加解密，更适合当前仅在内网运行的 FastAPI 服务；需自管心跳与单连接策略。
- 同一机器人同时仅允许一个连接，新的 `aibot_subscribe` 会踢掉旧连接，因此必须实现主备切换和断线事件 (`disconnected_event`) 监控。

### 4.2 配置与密钥管理
| 变量 | 说明 | 配置位置 |
| ---- | ---- | -------- |
| `WECOM_BOT_ID` | 企业微信智能机器人 BotID（例如用户提供的 `aibjHpfEoEovw25eaVIgsUKRg24KIF7LjG8`） | `backend/.env`、`docker-compose.yml`、`app/config.py` |
| `WECOM_BOT_SECRET` | 长连接专用 Secret（例如 `XAwPG1lq3jPTxrQF34PuPJoBTezuj7gjJQ9WKd1Vqyx`） | 同上 |

`app/config.py` 中新增配置段：

```python
class Settings(BaseSettings):
    WECOM_BOT_ID: str = ""
    WECOM_BOT_SECRET: str = ""
```

部署时只在 `.env` 填入真实值，不直接写入仓库。为区分不同模式，可预留 `WECOM_MODE=long_socket`。 

### 4.3 服务架构设计
1. **长连接管理器**：在 `backend/app/wecom/longconn.py` 中封装 `WeComLongConnManager`，基于 `websockets` 或官方 `aibot-python-sdk`。启动 FastAPI 时在 `lifespan` 内拉起后台 `asyncio.Task`。
2. **订阅流程**：
   - 建立 `wss://openws.work.weixin.qq.com` 连接。
   - 发送 `aibot_subscribe` JSON（含 `bot_id`, `secret`, `req_id`）。
   - 监听返回 `errcode == 0` 后进入事件循环，连接成功事件写入日志与 Prometheus 指标。
3. **事件路由**：将服务器推送拆分为 `aibot_msg_callback` 与 `aibot_event_callback`，映射到现有服务：
   - 文本消息 -> 调用 `ai_query` 或 KPI 查询接口。
   - 模板卡片事件 -> 更新 AI 结果卡片或 KPI 详情。
   - `enter_chat` -> 调用 `aibot_respond_welcome_msg` 返回欢迎语/菜单。
4. **消息回复封装**：
   - 编写 `respond_stream(stream_id, content, finish=False)` 助手，统一构造 `aibot_respond_msg`，以 `headers.req_id` 关联原请求。
   - 提供 `update_template_card` 与 `send_markdown` 方法，包装 `aibot_respond_update_msg`、`aibot_send_msg`。

### 4.4 流式消息与限频策略
- 每条流式消息使用唯一 `stream.id`，首次回复 `finish=false`，最终一次设置 `finish=true`，需在 6 分钟内完成。
- 记录每个 `chatid` 的 30 条/分钟、1000 条/小时限额；可在 Redis 维护滑动窗口，超限则回复“稍后重试”。
- 将 KPI/AI 查询拆成三段提示：接收 -> 查询中 -> 结果，避免长时间无反馈。

### 4.5 心跳与重连
- 每 30 秒发送一次 `ping`（自增 `req_id`），若 10 秒未收到响应则判定异常并断开重连。
- 监听 `disconnected_event` 并触发重连，保证主进程只有一个活跃连接，可在数据库或 Redis 写入 `longconn_status` 以供运维监控。
- 发生网络抖动时，重连流程需指数退避（如 2s/5s/10s）以避免频繁 `aibot_subscribe` 被限流。

### 4.6 与 BI 功能对齐
- **查询意图**：匹配消息内容中的关键词（如“今日KPI”“报名 vs 签到”），调用既有 service，拼装 Markdown / 模板卡片后通过 `aibot_respond_msg` 返回。
- **主动推送**：保留原 Stage 4 的 APScheduler 任务，但将发送端改为 `aibot_send_msg`，在第一次推送前需引导业务群 @ 机器人以建立会话上下文。
- **数据回流**：`feedback_event` 可落库到 `wecom_feedback`，并同步到前端“备注/说明”区块。

### 4.7 测试与上线 Checklist
1. 管理后台开启「API 模式-长连接」，确认无并行回调地址配置。
2. 在测试环境填入 BotID/Secret，运行长连接服务，观察订阅成功日志。
3. 用测试账号进入机器人单聊/群聊，验证 `enter_chat` 欢迎语、文本消息请求、模板卡片交互。
4. 校验流式消息 6 分钟内多次刷新、finish 标记是否生效。
5. 模拟断线/踢线，确认自动重连与 `disconnected_event` 告警。
6. 灰度发布：先在运维群验证，再扩展到正式业务群。

## 五、后续建议
- 明确目标用户与使用场景，决定是否同步建设小程序入口。
- 将本方案拆解为多任务（配置、后端、前端、消息、联调），在项目管理工具中跟踪进度。
- 结合企业微信审批/待办能力，后续可拓展 KPI 异常自动派单与闭环处理。
