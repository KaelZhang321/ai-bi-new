# 会议 BI RAG 入库规范说明

一句话摘要：本文定义会议 BI 知识库的入库边界、chunk 规则、metadata 结构、标签规范、更新流程与检索建议，供向量库或混合检索系统直接采用。

## 1. 适用范围

- 适用目录：`docs/rag/`
- 适用对象：向量库入库、检索服务、知识运营、提示工程
- 配套主稿：`docs/会议BI逆向PRD.md`
- 配套设计：`docs/plans/2026-03-17-meeting-bi-reverse-prd-rag-design.md`

## 2. 推荐入库边界

建议优先入库以下文档：

1. `00-知识库导航.md`
2. `glossary.md`
3. `pages/`
4. `modules/`
5. `apis/`
6. `ai/`
7. `metrics/`
8. `issues/`

建议不作为业务知识正文入库的文档：

- 本规范说明本身
- 纯流程说明、提交记录、Git 说明
- 与当前系统无关的历史草稿

## 3. Chunk 策略

### 3.1 推荐原则

- 以“单卡单主题”为主，不再二次切碎
- 单文件优先作为一个主 chunk
- 当单文件超过模型检索窗口时，再按二级标题拆分

### 3.2 当前建议

对当前 `docs/rag/`：

- 页面卡：1 文件 = 1 chunk
- 模块卡：1 文件 = 1 chunk
- 接口卡：1 文件 = 1 chunk
- 能力卡：1 文件 = 1 chunk
- 指标卡：1 文件 = 1 chunk
- 问题卡：1 文件 = 1 chunk
- 术语表：按三级标题或每个术语拆分更佳
- 导航文件：1 文件 = 1 chunk

### 3.3 不建议的拆分方式

- 不要把“字段列表”和“当前限制”拆成独立 chunk
- 不要把一句话摘要单独拆出去
- 不要跨文件拼接 chunk

## 4. Metadata 规范

每个 chunk 至少带以下 metadata：

- `kb`: `meeting-bi`
- `source_path`: 原始相对路径
- `source_file`: 文件名
- `doc_type`: `nav` / `glossary` / `page` / `module` / `api` / `ai` / `metric` / `issue`
- `title`: 文档标题
- `summary`: 一句话摘要
- `language`: `zh-CN`
- `version_date`: `2026-03-17`
- `confidence`: `已代码验证` / `已接口验证` / 其他

可选 metadata：

- `page_name`
- `module_name`
- `api_path`
- `related_tags`
- `code_anchors`

## 5. Tag 规范

建议统一使用以下标签体系：

### 5.1 一级标签

- `page`
- `module`
- `api`
- `ai`
- `metric`
- `issue`
- `glossary`

### 5.2 业务标签

- `客户总览`
- `运营数据`
- `目标达成`
- `企业微信`
- `AI问数`
- `KPI`
- `成交`
- `报名签到`
- `客户画像`
- `来源分析`

### 5.3 技术标签

- `FastAPI`
- `React`
- `Vanna`
- `SSE`
- `Webhook`
- `SQL`
- `ECharts`

## 6. 检索建议

### 6.1 推荐检索策略

建议使用“关键词检索 + 向量检索”的混合策略。

优先召回规则：

1. 若问题中出现明确接口路径，优先命中 `apis/`
2. 若问题中出现“页面 / 模块 / 看板 / 展示”，优先命中 `pages/` 或 `modules/`
3. 若问题中出现“怎么计算 / 口径 / 指标”，优先命中 `metrics/`
4. 若问题中出现“问题 / 风险 / 为什么不一致”，优先命中 `issues/`
5. 若问题中出现“AI / 企业微信 / 机器人 / 流式”，优先命中 `ai/`

### 6.2 回答约束建议

在回答层建议加以下约束：

- 优先引用“已代码验证”的内容
- 若同一问题涉及多个口径，必须显式指出差异
- 若问题命中 `issues/`，应说明这是“当前问题”而非产品目标状态
- 若问题涉及“完成率”，必须区分 `achievement` 与 `progress` 两套口径

## 7. 扁平化导入建议

为了方便向量库直接导入，仓库已额外生成：

- `docs/rag-flat/`

该目录特征：

- 单层目录
- 文件名前缀保留类别
- 每个文件增加 frontmatter 便于抽取 metadata
- 更适合直接批量导入向量库

## 8. 更新流程

建议使用以下更新顺序：

1. 先更新 `docs/会议BI逆向PRD.md`
2. 再同步更新 `docs/rag/` 对应知识卡
3. 然后重新生成 `docs/rag-flat/`
4. 最后执行一次抽样检索验证

## 9. 最低验收标准

- 每张卡都有标题和一句话摘要
- 每张卡能独立回答一个问题
- metadata 可由文件路径和 frontmatter 稳定抽取
- “完成率”“金额单位”“企业微信推送时间”这类高风险知识已显式记录
- 扁平化目录与原目录内容一一对应
