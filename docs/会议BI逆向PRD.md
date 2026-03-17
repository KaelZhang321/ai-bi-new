# 会议 BI 系统逆向产品需求文档

- 文档类型：逆向 PRD
- 文档日期：2026-03-17
- 适用对象：内部 PM / 研发 / 业务
- 文档目标：基于当前代码、接口与页面实现，还原系统现状，用于统一认知、支持研发定位、并为后续 RAG 知识库提供事实底稿

---

## 1. 文档说明

### 1.1 文档定位

本文不是未来版本需求文档，也不是业务蓝图文档，而是对当前仓库中“会议 BI 系统”现状的逆向整理。核心目标是回答以下问题：

1. 当前系统到底提供了哪些能力
2. 这些能力分别服务哪些业务场景
3. 前端页面、后端接口、服务逻辑、AI 与企业微信链路如何对应
4. 当前实现与旧文档或业务表达之间存在哪些差异和缺口

### 1.2 信息来源优先级

本文遵循以下事实优先级：

1. 当前代码实现
2. 当前接口定义与调用关系
3. README 与历史文档
4. 基于命名与界面表现的合理推断

原则：`代码 > 接口 > 文档 > 推断`

### 1.3 可信度标注规则

- `已代码验证`：已在前端 / 后端代码中直接找到实现
- `已接口验证`：已在 API 定义中确认，但细节需结合实现补充
- `文档提及，待代码核实`：历史文档中存在，但当前代码未完全对应
- `基于命名推断`：代码未完整显式表达，只能根据命名和调用链判断

---

## 2. 产品总览

### 2.1 产品定位

会议 BI 系统是一个围绕大型会议场景搭建的数据分析驾驶舱，当前产品形态由三部分组成：

1. Web 大屏 / H5 看板
2. AI 自然语言问数能力
3. 企业微信机器人与定时推送能力

从当前代码看，该系统更像一个“会议经营数据中台的前台表达层”，把报名、签到、客户画像、客户来源、运营过程、成交达成、方案完成情况等数据汇总为可视化和可问答的统一入口。`已代码验证`

### 2.2 核心业务价值

从业务视角看，当前系统主要解决 4 类问题：

1. 会议前后与会中核心经营指标的统一查看
2. 客户质量、来源结构、抵达情况的快速判断
3. 运营过程中的签到、接机、离开、到院等过程数据监控
4. 成交目标、区域完成度、方案达成度的结果复盘

在此基础上，AI 问数与企业微信机器人进一步降低了数据查询门槛，使非研发角色可以通过自然语言直接获取数据结论。`已代码验证`

### 2.3 典型使用方式

- 管理层：查看整体 KPI、成交达成、区域完成度
- 业务负责人：查看客户结构、重点客户抵达、来源效果
- 运营团队：查看签到、接机、离开、到院趋势
- 数据支持 / 研发：定位某页面对应接口、SQL 逻辑与字段口径
- 企业微信使用者：在群聊或机器人单聊中直接问数、查看摘要卡片与图表

---

## 3. 角色与使用场景

### 3.1 主要角色

| 角色 | 关注重点 | 主要使用能力 |
|---|---|---|
| 业务管理层 | 总体经营效果、区域达成、方案结果 | KPI、目标达成、方案概览、区域完成度 |
| 会议运营人员 | 会中动态、到场情况、运营过程异常 | 运营 KPI、趋势分析、报名/抵达明细 |
| 客户运营 / 市场 | 客户来源、客户结构、目标客户抵达 | 客户画像、来源统计、目标客户明细 |
| 研发 / 数据 | 接口映射、SQL 来源、指标口径 | API、Service、AI 查询链路、问题清单 |

### 3.2 核心场景

#### 场景 A：会议经营总览

业务或管理层进入看板首页，先查看顶部 KPI，快速掌握报名、抵达、成交、收款、消耗、投资回报率等整体状态。`已代码验证`

#### 场景 B：客户结构分析

业务侧进入“客户总览”，查看报名与抵达、客户画像、客户来源和优质目标客户抵达情况，用于判断客户质量与到场质量。`已代码验证`

#### 场景 C：会中运营监控

运营侧进入“运营数据”，按日期查看签到、接机、离开、到院等核心 KPI，并按场景筛选趋势。`已代码验证`

#### 场景 D：结果复盘

会后或经营复盘阶段，查看“目标达成”“各区域完成度”“方案概览表”，判断区域与方案的结果表现。`已代码验证`

#### 场景 E：自然语言问数

用户通过桌面端、移动端或企业微信机器人输入问题，系统自动生成 SQL、执行查询、给出自然语言回答，并在合适时推荐图表。`已代码验证`

---

## 4. 信息架构与页面地图

### 4.1 前端主路由

当前前端主路由包括：

- `/`：桌面端主入口
- `/mobile`：移动端入口
- `/chart/:id`：图表独立查看页，用于企业微信卡片跳转

对应代码：

- `frontend/src/App.tsx`
- `frontend/src/pages/ChartView.tsx`

`已代码验证`

### 4.2 桌面端一级页面

桌面端通过顶部切换展示 3 个一级页面：

1. 客户总览
2. 运营数据
3. 目标达成

对应代码：

- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/pages/PageCustomer.tsx`
- `frontend/src/pages/PageOperations.tsx`
- `frontend/src/pages/PageAchievement.tsx`

`已代码验证`

### 4.3 移动端结构

移动端复用了同一套业务能力，采用单独的移动端容器与 Tab 结构，顶部展示 KPI，底部切换页面，并带 AI 浮动按钮。`已代码验证`

核心文件：

- `frontend/src/pages/mobile/MobileDashboard.tsx`

### 4.4 模块地图

#### 客户总览

- 报名 VS 签到情况
- 客户画像分析
- 客户来源 + 任务进展

#### 运营数据

- 运营 KPI
- 时间维度趋势分析

#### 目标达成

- 目标 VS 达成
- 各区域完成度
- 方案概览表

#### 共享能力

- 顶部 KPI
- AI 聊天问数面板
- 图表独立查看页
- 企业微信机器人

---

## 5. 页面与模块说明

本章采用“事实描述 + 业务解释 + 当前限制”的逆向写法。

### 5.1 全局 KPI 区

#### 事实描述

系统在桌面端首页和移动端顶部展示 6 个核心指标：

1. 报名客户
2. 已抵达客户
3. 已成交金额
4. 新规划消耗
5. 已收款金额
6. 总投资回报率

前端：

- `frontend/src/components/sections/CoreKpiRow.tsx`
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/pages/mobile/MobileDashboard.tsx`

后端接口：

- `GET /v1/kpi/overview`

后端服务：

- `backend/app/api/v1/kpi.py`
- `backend/app/services/kpi_service.py`

`已代码验证`

#### 业务解释

该区域承担“系统摘要面板”的角色，是所有角色进入系统后的第一层判断依据。

#### 当前限制

1. ROI 公式当前直接基于固定预算 `600` 与成交金额计算，预算来源不是动态配置。`已代码验证`
2. 当前标签为“新规划消耗”，与旧文档中的“已消耗预算”存在表达差异。`已代码验证`

### 5.2 页面一：客户总览

#### 5.2.1 模块：报名 VS 签到情况

##### 事实描述

该模块由两部分组成：

1. 报名/抵达堆叠柱图
2. 金额等级矩阵表

前端组件：

- `frontend/src/components/sections/RegistrationSection.tsx`

前端数据：

- `useRegistrationChart()`
- `useRegistrationMatrix()`
- `fetchRegistrationDetail()`

接口：

- `GET /v1/registration/chart`
- `GET /v1/registration/matrix`
- `GET /v1/registration/detail`

后端：

- `backend/app/api/v1/registration.py`
- `backend/app/services/registration_service.py`

`已代码验证`

##### 业务解释

该模块用于判断不同大区的客户报名规模与实际到场质量，并可通过下钻查看具体客户明细，适合会前准备与会中确认。

##### 当前限制

1. 当前分层字段使用的是 `real_identity`，而非旧 PRD 中反复提到的 `customer_level_name`。`已代码验证`
2. 图表图例虽然在界面文案上表达为“金额等级”，但实际上更接近“身份 / 档位标签”的混合字段。`已代码验证`
3. “未分类”逻辑仅在下钻时做了特殊处理。`已代码验证`

#### 5.2.2 模块：客户画像分析

##### 事实描述

该模块由三张图构成：

1. 金额等级分布
2. 身份类型分布
3. 新老客户对比

前端组件：

- `frontend/src/components/sections/CustomerProfileSection.tsx`

接口：

- `GET /v1/customer/profile`

后端：

- `backend/app/api/v1/customer.py`
- `backend/app/services/customer_service.py`

`已代码验证`

##### 业务解释

该模块承担客户结构画像作用，帮助业务判断参会客群质量、角色构成和新老占比。

##### 当前限制

1. 当前“金额等级分布”前端已改为柱状图，但后端实际统计字段仍来自 `meeting_registration.real_identity`，并不完全等同于“金额等级”。`已代码验证`
2. 身份类型分布与金额等级分布存在字段口径交叉，容易被业务误读为两个完全独立维度。`已代码验证`

#### 5.2.3 模块：客户来源 + 任务进展

##### 事实描述

该模块由两部分组成：

1. 客户报名统计（按大区·来源）
2. 优质目标客户抵达

前端组件：

- `frontend/src/components/sections/CustomerSourceSection.tsx`

接口：

- `GET /v1/source/distribution`
- `GET /v1/source/target-arrival`
- `GET /v1/source/target-detail`

后端：

- `backend/app/api/v1/source.py`
- `backend/app/services/source_service.py`

`已代码验证`

##### 业务解释

该模块用于判断不同来源渠道贡献，以及优质目标客户的实际抵达情况，适合业务复盘和重点客户跟进。

##### 当前限制

1. 来源类型当前仅按 `盟主 / 商务 / 店铺` 三类粗分，规则来自 `store_name` 模糊匹配。`已代码验证`
2. 目标客户的筛选逻辑当前使用 `meeting_customer_analysis.min_deal >= 100`，属于实现口径，不一定等同于业务侧最终“优质客户”定义。`已代码验证`

### 5.3 页面二：运营数据

#### 5.3.1 模块：运营 KPI

##### 事实描述

该模块展示 4 个核心运营指标：

1. 签到人数
2. 接机人数
3. 离开人数
4. 到院人数

前端组件：

- `frontend/src/components/sections/OperationsSection.tsx`

接口：

- `GET /v1/operations/kpi`

后端：

- `backend/app/api/v1/operations.py`
- `backend/app/services/operations_service.py`

`已代码验证`

##### 业务解释

用于会中过程管理，帮助运营实时判断关键环节人数变化。

##### 当前限制

1. KPI 查询支持按日期传参，但当前仅支持单日场景，前端默认传 `selectedDate -> selectedDate`。`已代码验证`
2. SQL 直接拼接日期字符串，存在一定实现层安全与维护成本。`已代码验证`

#### 5.3.2 模块：时间维度趋势分析

##### 事实描述

该模块通过折线图展示不同时间段、不同场景的人数趋势，支持按场景筛选。

场景标签由后端根据 `meeting_schedule_stats.time_period` 归类为：

- 参会
- 抵达
- 离开
- 用餐
- 到院

前端组件：

- `frontend/src/components/sections/OperationsSection.tsx`

接口：

- `GET /v1/operations/trend`

后端：

- `backend/app/api/v1/operations.py`
- `backend/app/services/operations_service.py`

`已代码验证`

##### 业务解释

这是一个“过程趋势图”，帮助运营理解不同时间段的人流分布与场景切换。

##### 当前限制

1. 趋势接口当前不接收日期范围参数，前端只能对返回结果做场景筛选。`已代码验证`
2. 时间段映射规则是基于字符串匹配，不是强结构化事件数据。`已代码验证`

### 5.4 页面三：目标达成

#### 5.4.1 模块：目标 VS 达成

##### 事实描述

该模块由图表与明细表组成：

1. 各区域目标 VS 达成图
2. 达成率明细表
3. 点击区域可下钻成交明细

前端组件：

- `frontend/src/components/sections/AchievementSection.tsx`

接口：

- `GET /v1/achievement/chart`
- `GET /v1/achievement/table`
- `GET /v1/achievement/detail`

后端：

- `backend/app/api/v1/achievement.py`
- `backend/app/services/achievement_service.py`

`已代码验证`

##### 业务解释

该模块承担区域维度的结果复盘作用，帮助业务管理者判断各区域是否达成既定目标。

##### 当前限制

1. 数据来源当前是 `meeting_region_proposal_targets` 与 `meeting_transaction_details` 左连接，不是旧文档里提到的独立“区域成交目标配置表”逻辑。`已代码验证`
2. 达成金额统一换算为“万”，但不同字段单位需业务侧再次确认。`已代码验证`
3. 下钻明细查询在无筛选时会直接拼出 `WHERE ` 空条件风险；当前前端一定传区域时问题较小，但实现方式需要收敛。`已代码验证`

#### 5.4.2 模块：各区域完成度

##### 事实描述

该模块以横向条形图展示各区域：

- 达成金额
- 成交高限
- 完成率

前端组件：

- `frontend/src/components/sections/ProgressSection.tsx`

接口：

- `GET /v1/progress/ranking`

后端：

- `backend/app/api/v1/progress.py`
- `backend/app/services/progress_service.py`

`已代码验证`

##### 业务解释

该模块是区域结果排行视图，比“目标 VS 达成”更强调横向对比与完成率排序。

##### 当前限制

1. 完成率当前基于 `deal_amount / deal_target_high` 计算，采用的是“高限”而非“目标值”。`已代码验证`
2. 业务上“完成度”与“达成率”是否应使用同一目标口径，需后续统一。`已代码验证`

#### 5.4.3 模块：方案概览表

##### 事实描述

该模块当前在目标达成页右侧展示“方案概览表”，字段包括：

- 方案名称
- 目标数量
- 目标金额
- 实际数量
- 实际金额

前端组件：

- `frontend/src/components/sections/ProposalSection.tsx`

接口：

- `GET /v1/proposal/overview`

后端：

- `backend/app/api/v1/proposal.py`
- `backend/app/services/proposal_service.py`

`已代码验证`

##### 业务解释

该模块用于从方案维度复盘经营结果，是区域视角之外的另一层结果表达。

##### 当前限制

1. 当前“实际数量”通过 `COUNT(t.special_remarks)` 统计，与业务上的“方案成交数量”定义可能存在偏差。`已代码验证`
2. 实际金额统一换算为“万”，但目标金额未做同样换算，页面显示前需确认单位一致性。`已代码验证`

#### 5.4.4 模块：多维交叉明细表

##### 事实描述

前端仍保留“多维交叉明细表”能力位，但当前后端 `/v1/proposal/cross-table` 已被注释，前端仅在开启该区域时请求该接口。当前目标达成页实际只展示方案概览表，不展示交叉表。`已代码验证`

##### 业务解释

这说明“方案矩阵能力”曾被设计过，但当前版本并未完整落地到正式接口。

##### 当前限制

1. 前端存在调用代码，后端无正式开放接口。`已代码验证`
2. 这是当前代码中比较明确的“设计存在、能力未完整上线”案例。`已代码验证`

---

## 6. 接口与数据依赖

### 6.1 后端接口域总表

当前后端按以下业务域注册路由：

| 业务域 | 路由前缀 | 说明 |
|---|---|---|
| KPI | `/v1/kpi` | 全局摘要指标 |
| 报名签到 | `/v1/registration` | 报名、抵达、矩阵、明细 |
| 客户画像 | `/v1/customer` | 客户结构画像 |
| 客户来源 | `/v1/source` | 来源统计、目标客户抵达 |
| 运营数据 | `/v1/operations` | 运营 KPI、趋势 |
| 目标达成 | `/v1/achievement` | 区域目标达成与明细 |
| 完成进度 | `/v1/progress` | 区域完成度排行 |
| 方案情报 | `/v1/proposal` | 方案概览与下钻 |
| AI 查询 | `/v1/ai` | 问数、流式问数 |
| 企业微信 | `/v1/wecom` | 状态、测试推送 |
| 图表缓存 | `/v1/chart` | 图表临时查看 |

来源：

- `backend/app/api/router.py`
- `backend/app/api/v1/*.py`

`已代码验证`

### 6.2 前端模块到接口映射

| 前端模块 | Hook / API | 后端接口 |
|---|---|---|
| 顶部 KPI | `useKpiOverview` | `/v1/kpi/overview` |
| 报名/抵达图 | `useRegistrationChart` | `/v1/registration/chart` |
| 报名矩阵表 | `useRegistrationMatrix` | `/v1/registration/matrix` |
| 报名明细弹窗 | `fetchRegistrationDetail` | `/v1/registration/detail` |
| 客户画像 | `useCustomerProfile` | `/v1/customer/profile` |
| 来源统计 | `useSourceDistribution` | `/v1/source/distribution` |
| 目标客户抵达 | `useTargetArrival` | `/v1/source/target-arrival` |
| 目标客户明细 | `fetchTargetCustomerDetail` | `/v1/source/target-detail` |
| 运营 KPI | `useOperationsKpi` | `/v1/operations/kpi` |
| 运营趋势 | `useTrendData` | `/v1/operations/trend` |
| 达成图表 | `useAchievementChart` | `/v1/achievement/chart` |
| 达成表格 | `useAchievementTable` | `/v1/achievement/table` |
| 达成下钻 | `fetchAchievementDetail` | `/v1/achievement/detail` |
| 完成度排行 | `useProgress` | `/v1/progress/ranking` |
| 方案概览 | `useProposalOverview` | `/v1/proposal/overview` |
| 方案交叉表 | `useProposalCrossTable` | 预期 `/v1/proposal/cross-table`，当前未正式开放 |
| AI 问数 | `postAiQuery` / `streamAiQuery` | `/v1/ai/query`、`/v1/ai/query/stream` |
| 图表页 | `fetch(/v1/chart/:id)` | `/v1/chart/{chart_id}` |

来源：

- `frontend/src/hooks/useApi.ts`
- `frontend/src/api/*.ts`

`已代码验证`

### 6.3 主要底层数据表

从服务层 SQL 可以确认当前系统主要依赖以下表：

1. `meeting_registration`
2. `meeting_customer_analysis`
3. `meeting_schedule_stats`
4. `meeting_transaction_details`
5. `meeting_region_proposal_targets`
6. `meeting_proposal_targets`

README 中还提到 `meeting_region_transaction_targets`，但在当前主要业务 SQL 中未见核心使用。`已代码验证`

---

## 7. AI 问数能力

### 7.1 能力概述

当前 AI 问数能力由前端 `AiChatPanel`、后端 `ai_query` 路由、`query_executor`、`vanna_client` 共同组成。

前端：

- `frontend/src/components/sections/AiChatPanel.tsx`
- `frontend/src/api/ai.ts`

后端：

- `backend/app/api/v1/ai_query.py`
- `backend/app/ai/query_executor.py`
- `backend/app/ai/vanna_client.py`
- `backend/app/ai/context_store.py`

`已代码验证`

### 7.2 处理流程

当前同步问数链路大致为：

1. 用户输入自然语言问题
2. 系统根据历史上下文尝试重写问题
3. AI 判断问题是否属于会议 BI 数据域
4. Vanna 生成 SQL
5. 系统做 SQL 安全校验，只允许 `SELECT`
6. 执行 SQL 获取结果
7. 自动分析结果结构并推荐图表
8. 生成中文自然语言回答
9. 保存对话上下文

流式问数链路则把 SQL、数据、图表、答案分阶段通过 SSE 推送给前端。`已代码验证`

### 7.3 当前技术实现

- 向量存储：`ChromaDB_VectorStore`
- 大模型接入：火山引擎兼容 OpenAI 的聊天接口
- 语义 SQL 框架：Vanna
- 训练素材：数据库真实 DDL + 预置问答对

`已代码验证`

### 7.4 图表自动推荐

系统会根据结果集结构自动推荐：

- 饼图
- 柱状图
- 横向条形图
- 分组柱状图

如果图表被生成，在企业微信场景下还会缓存图表配置，并通过 `/v1/chart/{id}` 供独立页面打开。`已代码验证`

### 7.5 当前限制

1. SQL 校验虽限制了高危关键字，但仍属于规则型校验，不是完整 SQL 沙箱。`已代码验证`
2. 问题相关性判断失败时默认放行。`已代码验证`
3. 图表推荐是结构型启发式逻辑，不具备真正的业务语义理解。`已代码验证`

---

## 8. 企业微信能力

### 8.1 能力概述

当前企业微信能力包含两部分：

1. 长连接机器人
2. 定时群推送

核心代码：

- `backend/app/api/v1/wecom.py`
- `backend/app/wecom/longconn.py`
- `backend/app/wecom/handlers.py`
- `backend/app/wecom/scheduler.py`
- `backend/app/wecom/subscribers.py`

`已代码验证`

### 8.2 长连接机器人

机器人管理器 `WeComLongConnManager` 负责：

- 建立 WebSocket 长连接
- 注册消息与事件处理器
- 维护连接状态
- 在启动时并行拉起定时调度器

支持的消息 / 事件包括：

- 文本消息
- 图片消息
- 语音消息
- 文件消息
- 进入会话事件
- 模板卡片事件
- 用户反馈事件

`已代码验证`

### 8.3 文本与语音问数

文本消息会进入现有 AI 问数服务，处理完成后：

1. 先流式回“正在查询中”
2. 再回完整答案
3. 如有数据则发送模板卡片
4. 如有图表则额外渲染并发送图片

语音消息则先读取企业微信转写文本，再复用文本消息处理逻辑。`已代码验证`

### 8.4 定时推送

调度器当前通过群机器人 Webhook 推送 KPI 摘要，推送内容包括：

- 报名客户
- 已抵达客户
- 已成交金额
- 新规划消耗
- 已收款金额
- 总投资回报率
- 移动端大屏链接

当前代码中的推送时间为：

- 12:00
- 18:00
- 21:00

`已代码验证`

### 8.5 当前限制

1. `scheduler.py` 文件头注释写的是“12:00 和 19:00”，但实际 `PUSH_TIMES` 为 `12:00 / 18:00 / 21:00`，存在文档与代码不一致。`已代码验证`
2. 企业微信状态 API 主要偏运维侧，可见性较强，但不是业务页面的一部分。`已代码验证`

---

## 9. 关键指标与业务口径

### 9.1 当前系统中最核心的指标

| 指标 | 当前实现口径 | 主要来源 | 可信度 |
|---|---|---|---|
| 报名客户 | `meeting_registration` 去重客户数，过滤市场与陪同 | `kpi_service.py` | 已代码验证 |
| 已抵达客户 | `sign_in_status='已签到'` 的去重客户数 | `kpi_service.py` | 已代码验证 |
| 已成交金额 | `meeting_transaction_details.new_deal_amount` 求和后换算为万 | `kpi_service.py` | 已代码验证 |
| 新规划消耗 | `meeting_transaction_details.consumed_amount` 求和后换算为万 | `kpi_service.py` | 已代码验证 |
| 已收款金额 | `meeting_transaction_details.received_amount` 求和后换算为万 | `kpi_service.py` | 已代码验证 |
| ROI | 固定预算 600 与成交金额换算 | `kpi_service.py` | 已代码验证 |
| 完成率 / 达成率 | 不同模块存在不同分母口径 | `achievement_service.py` / `progress_service.py` | 已代码验证 |

### 9.2 当前存在的口径风险

1. “客户金额等级”“身份类型”“real_identity”在部分模块中交叉使用。  
2. “达成率”与“完成度”并非完全同一计算口径。  
3. “目标金额”与“实际金额”的单位显示需要统一复核。  
4. “优质目标客户”的判定当前以 `min_deal >= 100` 表达，偏实现口径。  

---

## 10. 当前问题与缺口

### 10.1 已实现但存在表达偏差

1. 旧 PRD 中“金额等级”的业务表达，与当前 `real_identity` 字段使用并不完全一致。  
2. 客户画像中的“金额等级分布”当前更像身份 / 档位分布。  

### 10.2 前后端不一致

1. 前端保留 `proposal/cross-table` 请求能力，但后端接口已注释。  
2. 企业微信推送说明文案与实际推送时间不一致。  

### 10.3 代码实现存在可维护性风险

1. 部分 SQL 采用字符串拼接条件。  
2. 个别下钻查询存在空 `WHERE` 拼接隐患。  
3. 指标口径在不同模块中缺少统一配置层。  

### 10.4 文档缺失

1. 当前仓库缺少一份以代码为准的正式逆向 PRD。  
2. 缺少面向 RAG 的模块化知识卡。  
3. 缺少跨页面的统一指标词典。  

---

## 11. 附录

### 11.1 关键代码锚点

#### 前端

- `frontend/src/App.tsx`
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/pages/PageCustomer.tsx`
- `frontend/src/pages/PageOperations.tsx`
- `frontend/src/pages/PageAchievement.tsx`
- `frontend/src/pages/mobile/MobileDashboard.tsx`
- `frontend/src/components/sections/CoreKpiRow.tsx`
- `frontend/src/components/sections/RegistrationSection.tsx`
- `frontend/src/components/sections/CustomerProfileSection.tsx`
- `frontend/src/components/sections/CustomerSourceSection.tsx`
- `frontend/src/components/sections/OperationsSection.tsx`
- `frontend/src/components/sections/AchievementSection.tsx`
- `frontend/src/components/sections/ProgressSection.tsx`
- `frontend/src/components/sections/ProposalSection.tsx`
- `frontend/src/components/sections/AiChatPanel.tsx`
- `frontend/src/pages/ChartView.tsx`
- `frontend/src/hooks/useApi.ts`
- `frontend/src/api/*.ts`

#### 后端

- `backend/app/api/router.py`
- `backend/app/api/v1/kpi.py`
- `backend/app/api/v1/registration.py`
- `backend/app/api/v1/customer.py`
- `backend/app/api/v1/source.py`
- `backend/app/api/v1/operations.py`
- `backend/app/api/v1/achievement.py`
- `backend/app/api/v1/progress.py`
- `backend/app/api/v1/proposal.py`
- `backend/app/api/v1/ai_query.py`
- `backend/app/api/v1/wecom.py`
- `backend/app/api/v1/chart.py`
- `backend/app/services/kpi_service.py`
- `backend/app/services/registration_service.py`
- `backend/app/services/customer_service.py`
- `backend/app/services/source_service.py`
- `backend/app/services/operations_service.py`
- `backend/app/services/achievement_service.py`
- `backend/app/services/progress_service.py`
- `backend/app/services/proposal_service.py`
- `backend/app/services/chart_store.py`
- `backend/app/ai/query_executor.py`
- `backend/app/ai/vanna_client.py`
- `backend/app/wecom/longconn.py`
- `backend/app/wecom/handlers.py`
- `backend/app/wecom/scheduler.py`
- `backend/app/wecom/subscribers.py`

### 11.2 本文与历史文档关系

历史文档 `docs/会议BI看板PRD.md` 仍可作为背景材料，但不能直接视为当前系统真实实现。后续若出现冲突，应以当前代码和接口为准。`已代码验证`

### 11.3 后续建议

基于本文，后续最自然的动作是：

1. 继续拆解 `docs/rag/` 知识卡
2. 输出指标词典与问题清单
3. 为关键指标建立统一口径表

