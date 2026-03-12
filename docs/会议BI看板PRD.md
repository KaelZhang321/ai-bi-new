# 会议BI数据看板系统 功能需求与数据需求文档

---

## 三、功能需求

### 3.1 功能架构总览

看板页面分为以下主要板块：

```
会议BI总览
├── 核心数据KPI（6个指标）
├── 一、报名 VS 签到情况（看客户池）
│   ├── 签到柱状图
│   └── 签席信息矩阵表
├── 客户分析/客户画像
│   ├── 客户金额等级分布
│   ├── 身份类型分布
│   ├── 新老客户对比
├── 客户来源+任务进展
│   ├── 客户报名统计（按大区·来源）
│   └── 优质目标客户抵达情况
├── 二、会议运营数据
│   ├── 运营KPI
│   ├── 趋势折线图
│   └── 筛选面板
├── 三、议题 VS 目标 /（看结果）
│   ├── 目标VS达成
│   └── 维度说明表格
├── 完成进度
│   ├── 完成度排行
│   └── 备注/说明
└── VS方案情报
    ├── 方案概览表
    └── 多维交叉明细表
```

### 3.2 核心数据KPI展示

#### 3.2.1 功能描述

在页面顶部展示6个核心运营指标，作为数据看板的摘要视图，让用户第一时间掌握整体情况。

#### 3.2.2 数据指标定义

| 指标名称 | 计算方式 | 数据来源表 | 字段 |
|---------|---------|-----------|------|
| 报名客户 | COUNT(DISTINCT customer_unique_id) | meeting_registration | customer_unique_id |
| 已抵达客户 | COUNT(DISTINCT customer_unique_id) WHERE sign_in_status = '已签到' | meeting_registration | customer_unique_id, sign_in_status |
| 已成交金额 | SUM(new_deal_amount) | meeting_transaction_details | new_deal_amount |
| 已消耗预算 | SUM(consumed_amount) | meeting_transaction_details | consumed_amount |
| 已收款金额 | SUM(received_amount) | meeting_transaction_details | received_amount |
| 总投资回报率 | 6000000 / SUM(new_deal_amount) × 0.4 | 计算字段 | - |

#### 3.2.3 交互需求

- 支持按日期范围筛选（默认显示全部）
- 鼠标悬停显示指标说明
- 数值格式：千分位分隔符，金额显示¥符号，百分比显示%符号

#### 3.2.4 验收标准

- [ ] 6个KPI指标全部展示
- [ ] 数值计算正确
- [ ] 支持日期筛选
- [ ] 数值格式符合规范

---

### 3.3 报名 VS 签到情况

#### 3.3.1 签到柱状图

**3.3.1.1 功能描述**

展示各区域按客户金额等级的报名人数与实际抵达人数对比，以堆积柱状图形式呈现。

**3.3.1.2 图表配置**

| 配置项 | 取值 |
|-------|------|
| 图表类型 | 堆积柱状图 |
| X轴 | 大区（从 meeting_registration.market_service_attribution 取逗号前第一段） |
| Y轴 | 客户数量 |
| 堆积维度 | 金额等级（meeting_registration.customer_level_name） |
| 双系列 | 报名、抵达 |

**3.3.1.3 数据映射**

```
数据源：meeting_registration

大区字段：SUBSTRING_INDEX(market_service_attribution, ',', 1)
取值示例：
- 蒋晓莹大区、田晓静大区、王红丽大区
- 段延芳大区、陈秀敏大区、黄刚大区
- 李红霞大区、李英大区、樊明花大区
- 公司直管、商务BU、营销铁军

customer_level_name字段取值：
- 千万客户、千万家属、千万朋友、千万总裁
- 300万以上客户、300万以上家属、300万以上总裁
- 百万客户、百万家属、百万朋友、百万总裁
- 累计百万、百万累计
- NULL（未分类）
```

**3.3.1.4 SQL参考**

```sql
-- 基础字段清洗（可改为视图/临时表）
WITH base AS (
    SELECT
        SUBSTRING_INDEX(market_service_attribution, ',', 1) AS region,
        CASE
            WHEN customer_level_name LIKE '%千万%' THEN '千万'
            WHEN customer_level_name LIKE '%300万%' THEN '300万'
            WHEN customer_level_name LIKE '%百万%' THEN '百万'
            ELSE '百万以下'
        END AS level_group,
        customer_unique_id,
        sign_in_status
    FROM meeting_registration
    WHERE market_service_attribution IS NOT NULL
)

-- 获取各区域各等级报名人数
SELECT
    region,
    level_group,
    COUNT(DISTINCT customer_unique_id) AS register_count
FROM base
GROUP BY region, level_group;

-- 获取各区域各等级抵达人数
SELECT
    region,
    level_group,
    COUNT(DISTINCT customer_unique_id) AS arrive_count
FROM base
WHERE sign_in_status = '已签到'
GROUP BY region, level_group;
```

**3.3.1.5 交互需求**

- 鼠标悬停显示具体数值
- 点击柱体可下钻查看明细
- 图例可点击切换显示/隐藏

**3.3.1.6 验收标准**

- [ ] 图表正确展示各区域数据
- [ ] 区分报名/抵达两个系列
- [ ] 按金额等级堆积显示
- [ ] 图例清晰可辨

---

#### 3.3.2 签席信息矩阵表

**3.3.2.1 功能描述**

以表格形式详细展示各区域各金额等级的报名与抵达数量，支持分页查看。

**3.3.2.2 表格配置**

| 列名 | 数据来源 | 说明 |
|-----|---------|------|
| 大区 | SUBSTRING_INDEX(meeting_registration.market_service_attribution, ',', 1) | 区域名称 |
| 千万(报名) | meeting_registration | customer_level_name LIKE '%千万%' 的报名人数 |
| 千万(抵达) | meeting_registration | sign_in_status='已签到' 的抵达人数 |
| 百万(报名) | meeting_registration | customer_level_name LIKE '%百万%' 的报名人数 |
| 百万(抵达) | meeting_registration | sign_in_status='已签到' 的抵达人数 |
| 普通(报名) | meeting_registration | customer_level_name 为 NULL 或其他的报名人数 |
| 普通(抵达) | meeting_registration | sign_in_status='已签到' 的抵达人数 |
| 总数 | 计算 | 报名总数/抵达总数 |

**3.3.2.3 SQL参考**

```sql
WITH level_data AS (
    SELECT
        SUBSTRING_INDEX(market_service_attribution, ',', 1) AS region,
        CASE
            WHEN customer_level_name LIKE '%千万%' THEN '千万'
            WHEN customer_level_name LIKE '%300万%' THEN '300万'
            WHEN customer_level_name LIKE '%百万%' THEN '百万'
            ELSE '百万以下'
        END AS level_group,
        sign_in_status,
        customer_unique_id
    FROM meeting_registration
    WHERE market_service_attribution IS NOT NULL
)
SELECT
    region,
    SUM(CASE WHEN level_group = '千万' THEN 1 ELSE 0 END) AS lvl_10m_register,
    SUM(CASE WHEN level_group = '千万' AND sign_in_status = '已签到' THEN 1 ELSE 0 END) AS lvl_10m_arrive,
    SUM(CASE WHEN level_group = '300万' THEN 1 ELSE 0 END) AS lvl_3m_register,
    SUM(CASE WHEN level_group = '300万' AND sign_in_status = '已签到' THEN 1 ELSE 0 END) AS lvl_3m_arrive,
    SUM(CASE WHEN level_group = '百万' THEN 1 ELSE 0 END) AS lvl_1m_register,
    SUM(CASE WHEN level_group = '百万' AND sign_in_status = '已签到' THEN 1 ELSE 0 END) AS lvl_1m_arrive,
    SUM(CASE WHEN level_group = '百万以下' THEN 1 ELSE 0 END) AS sub_1m_register,
    SUM(CASE WHEN level_group = '百万以下' AND sign_in_status = '已签到' THEN 1 ELSE 0 END) AS sub_1m_arrive,
    COUNT(DISTINCT customer_unique_id) AS total_register,
    COUNT(DISTINCT CASE WHEN sign_in_status = '已签到' THEN customer_unique_id END) AS total_arrive
FROM level_data
GROUP BY region
ORDER BY total_register DESC;
```

**3.3.2.4 验收标准**

- [ ] 表格展示所有区域数据
- [ ] 支持分页（每页10-20条）
- [ ] 数值格式规范

---

### 3.4 客户画像分析

#### 3.4.1 客户金额等级分布

**3.4.1.1 功能描述**

展示整体客户的金额等级构成，以饼图形式呈现。

**3.4.1.2 数据映射**

| 图表区块 | 数据来源 | 字段 | 说明 |
|---------|---------|------|------|
| 各金额等级 | meeting_customer_analysis | customer_level | COUNT(DISTINCT customer_unique_id)，按 customer_level 分组 |

> 注：Excel 字段映射表指定使用 `customer_level_name`，但 meeting_customer_analysis 表实际只有 `customer_level` 字段（取值：千万客户/百万客户/普通客户/NULL）。meeting_registration 表有 `customer_level_name` 字段（取值更细：千万客户/300万以上客户/百万客户等）。开发时应按实际表结构选择字段。

**3.4.1.3 SQL参考**

```sql
WITH level_mapping AS (
    SELECT
        CASE
            WHEN customer_level_name LIKE '%千万%' THEN '千万'
            WHEN customer_level_name LIKE '%300万%' THEN '300万'
            WHEN customer_level_name LIKE '%百万%' THEN '百万'
            ELSE '百万以下'
        END AS level_group,
        customer_unique_id
    FROM meeting_registration
),
agg AS (
    SELECT level_group, COUNT(DISTINCT customer_unique_id) AS customer_count
    FROM level_mapping
    GROUP BY level_group
)
SELECT
    level_group,
    customer_count,
    ROUND(customer_count * 100.0 / (SELECT SUM(customer_count) FROM agg), 2) AS percentage
FROM agg
ORDER BY FIELD(level_group, '千万', '300万', '百万', '百万以下');
```

**3.4.1.4 验收标准**

- [ ] 饼图正确显示各等级占比
- [ ] 标注具体百分比
- [ ] 图例清晰

---

#### 3.4.2 身份类型分布

**3.4.2.1 功能描述**

展示参会人员的身份类型构成，以饼图形式呈现。

**3.4.2.2 数据映射**

| 图表区块 | 数据来源 | 字段 | 说明 |
|---------|---------|------|------|
| 身份类型 | meeting_registration | attendee_role | 按 attendee_role 分组统计 COUNT(DISTINCT customer_unique_id) |

> 注：Excel 字段映射表指定字段为 `customer_type`，但 meeting_registration 表实际不存在该字段。实际可用字段为 `attendee_role`，取值：终端顾客/市场人员/店铺陪同（总裁/股东/美容师等）/百万VIP贵宾/千万VIP贵宾/千万家属/百万家属。

**3.4.2.3 SQL参考**

```sql
SELECT
    attendee_role,
    COUNT(DISTINCT customer_unique_id) AS person_count,
    ROUND(COUNT(DISTINCT customer_unique_id) * 100.0 /
        (SELECT COUNT(DISTINCT customer_unique_id) FROM meeting_registration), 2) AS percentage
FROM meeting_registration
GROUP BY attendee_role
ORDER BY person_count DESC;
```

**3.4.2.4 验收标准**

- [ ] 饼图正确显示各类别占比
- [ ] 标注具体百分比

---

#### 3.4.3 新老客户对比

**3.4.3.1 功能描述**

展示新客户与老客户的占比，以饼图形式呈现。

**3.4.3.2 数据映射**

| 图表区块 | 数据来源 | 字段 | 取值 |
|---------|---------|------|------|
| 新客户 | meeting_registration | customer_category | 新顾客 |
| 老客户 | meeting_registration | customer_category | 老顾客 |
| 陪同 | meeting_registration | customer_category | 陪同 |

**3.4.3.3 SQL参考**

```sql
SELECT
    customer_category,
    COUNT(DISTINCT customer_unique_id) AS person_count,
    ROUND(COUNT(DISTINCT customer_unique_id) * 100.0 /
        (SELECT COUNT(DISTINCT customer_unique_id) FROM meeting_registration), 2) AS percentage
FROM meeting_registration
GROUP BY customer_category
ORDER BY person_count DESC;
```

**3.4.3.4 验收标准**

- [ ] 饼图正确显示新/老客户比例
- [ ] 标注具体百分比

---

### 3.5 客户来源与任务进展

#### 3.5.1 客户报名统计（按大区·来源）

**3.5.1.1 功能描述**

展示各区域的客户来源分布，以堆积柱状图形式呈现。

**3.5.1.2 数据映射**

| 维度 | 数据来源 | 字段 | 说明 |
|-----|---------|------|------|
| X轴 | meeting_registration | SUBSTRING_INDEX(market_service_attribution, ',', 1) | 大区 |
| 堆积 | meeting_registration | store_name | 来源判断规则见下 |

**3.5.1.3 来源判断规则**

```sql
CASE
    WHEN store_name LIKE '%盟主%' THEN '盟主'
    WHEN store_name LIKE '%商务%' THEN '商务'
    ELSE '店铺'
END AS simplify_store_name
```

**3.5.1.4 SQL参考**

```sql
SELECT
    SUBSTRING_INDEX(market_service_attribution, ',', 1) AS region,
    CASE
        WHEN store_name LIKE '%盟主%' THEN '盟主'
        WHEN store_name LIKE '%商务%' THEN '商务'
        ELSE '店铺'
    END AS simplify_store_name,
    COUNT(DISTINCT customer_unique_id) AS customer_count
FROM meeting_registration
WHERE market_service_attribution IS NOT NULL
    AND store_name IS NOT NULL
GROUP BY region, simplify_store_name
ORDER BY region, customer_count DESC;
```

**3.5.1.5 验收标准**

- [ ] 堆积柱状图正确展示
- [ ] 区分不同来源类型（盟主/商务/店铺）

---

#### 3.5.2 优质目标客户抵达情况

**3.5.2.1 功能描述**

展示各区域目标客户与实际抵达的对比，以分组柱状图形式呈现。

**3.5.2.2 数据映射**

| 指标 | 计算方式 | 数据来源 |
|-----|---------|---------|
| 大区 | SUBSTRING_INDEX(market_service_attribution, ',', 1) | meeting_registration |
| 目标客户 | min_deal > 0 OR consumption_target > 0 | meeting_customer_analysis |
| 抵达客户 | 目标客户中 sign_in_status = '已签到' | 关联 meeting_registration |

**3.5.2.3 SQL参考**

```sql
-- 目标客户统计（按大区）
SELECT
    region,
    COUNT(*) AS target_count
FROM meeting_customer_analysis
WHERE (min_deal > 0 OR consumption_target > 0)
    AND region IS NOT NULL
    AND region != '细胞。和王艳红夫妻'
GROUP BY region;

-- 抵达的目标客户（需通过 customer_name 关联）
SELECT
    mca.region,
    COUNT(*) AS arrive_count
FROM meeting_customer_analysis mca
INNER JOIN meeting_registration mr ON mca.customer_name = mr.customer_name
WHERE (mca.min_deal > 0 OR mca.consumption_target > 0)
    AND mr.sign_in_status = '已签到'
    AND mca.region IS NOT NULL
    AND mca.region != '细胞。和王艳红夫妻'
GROUP BY mca.region;
```

> 注：meeting_customer_analysis 表的 customer_unique_id 当前全部为 NULL，跨表关联暂使用 customer_name 字段。待 customer_unique_id 数据补充后应切换回标准关联方式。

**3.5.2.4 验收标准**

- [ ] 分组柱状图展示目标vs抵达对比
- [ ] 直观显示差距

---

### 3.6 会议运营数据

#### 3.6.1 运营KPI

**3.6.1.1 功能描述**

展示会议期间的过程指标，4个核心KPI。

**3.6.1.2 指标定义**

| 指标 | 计算方式 | 数据来源 | 字段 |
|-----|---------|---------|------|
| 签到人数 | COUNT(DISTINCT customer_unique_id) WHERE sign_in_date_1 IS NOT NULL 且在筛选日期范围内 | meeting_registration | customer_unique_id, sign_in_date_1 |
| 接机人数 | COUNT(DISTINCT customer_unique_id) WHERE flight_info IS NOT NULL AND sign_in_date_1 IS NOT NULL 且在筛选日期范围内 | meeting_registration | customer_unique_id, flight_info, sign_in_date_1 |
| 离开人数 | people_count WHERE time_period = '离开人数' | meeting_schedule_stats | people_count, time_period |
| 到院人数 | people_count WHERE time_period = '医院人数合计' | meeting_schedule_stats | people_count, time_period |

> 注：Excel 字段映射表引用 `sign_in_time` 字段，但 meeting_registration 表实际不存在该字段。实际可用的签到时间字段为 `sign_in_date_1`（date 类型）。

**3.6.1.3 SQL参考**

```sql
SELECT
    -- 签到人数
    (SELECT COUNT(DISTINCT customer_unique_id)
     FROM meeting_registration
     WHERE sign_in_date_1 IS NOT NULL) AS checkin_count,
    -- 接机人数
    (SELECT COUNT(DISTINCT customer_unique_id)
     FROM meeting_registration
     WHERE flight_info IS NOT NULL
       AND sign_in_date_1 IS NOT NULL) AS pickup_count,
    -- 离开人数
    (SELECT COALESCE(SUM(people_count), 0)
     FROM meeting_schedule_stats
     WHERE time_period = '离开人数') AS leave_count,
    -- 到院人数
    (SELECT COALESCE(SUM(people_count), 0)
     FROM meeting_schedule_stats
     WHERE time_period = '医院人数合计') AS hospital_count;
```

**3.6.1.4 验收标准**

- [ ] 4个运营指标正确展示
- [ ] 支持日期范围筛选

---

#### 3.6.2 趋势折线图

**3.6.2.1 功能描述**

展示会议期间各时段的人流变化趋势，以多折线图形式呈现。标题：时间维度数据分析。

**3.6.2.2 图表配置**

| 配置项 | 取值 |
|-------|------|
| 图表类型 | 多折线图 |
| X轴 | 时间段（按 schedule_date × day_time_period 组合） |
| Y轴 | 人数 |
| 线条维度 | 场景类型（听课/抵达/离开/午餐/晚餐/到院体检） |

**3.6.2.3 数据映射**

```
时间段提取规则（从 time_period 提取）：
    WHEN time_period LIKE '%上午%' THEN '上午'
    WHEN time_period LIKE '%下午%' THEN '下午'
    WHEN time_period LIKE '%午餐%' THEN '下午'
    WHEN time_period LIKE '%晚餐%' THEN '晚上'
    WHEN time_period LIKE '%晚上%' THEN '晚上'
    ELSE '全天'

场景提取规则（从 time_period 提取）：
    WHEN time_period LIKE '%听课%' THEN '听课'
    WHEN time_period LIKE '%抵达%' THEN '抵达'
    WHEN time_period LIKE '%离开%' THEN '离开'
    WHEN time_period LIKE '%午餐%' THEN '午餐'
    WHEN time_period LIKE '%晚餐%' THEN '用餐'
    WHEN time_period LIKE '%体检%' THEN '到院体检'
    ELSE '其他'
```

**3.6.2.4 SQL参考**

```sql
SELECT
    schedule_date,
    CASE
        WHEN time_period LIKE '%上午%' THEN '上午'
        WHEN time_period LIKE '%下午%' THEN '下午'
        WHEN time_period LIKE '%午餐%' THEN '下午'
        WHEN time_period LIKE '%晚餐%' THEN '晚上'
        WHEN time_period LIKE '%晚上%' THEN '晚上'
        ELSE '全天'
    END AS day_time_period,
    CASE
        WHEN time_period LIKE '%听课%' THEN '听课'
        WHEN time_period LIKE '%抵达%' THEN '抵达'
        WHEN time_period LIKE '%离开%' THEN '离开'
        WHEN time_period LIKE '%午餐%' THEN '午餐'
        WHEN time_period LIKE '%晚餐%' THEN '用餐'
        WHEN time_period LIKE '%体检%' THEN '到院体检'
        ELSE '其他'
    END AS scene_label,
    SUM(people_count) AS people_count
FROM meeting_schedule_stats
WHERE time_period NOT LIKE '%率%'
    AND time_period NOT LIKE '%占比%'
GROUP BY schedule_date, day_time_period, scene_label
ORDER BY schedule_date, day_time_period;
```

**3.6.2.5 验收标准**

- [ ] 折线图展示各时段趋势
- [ ] 多条曲线清晰可辨
- [ ] 图例完整

---

#### 3.6.3 筛选面板

**3.6.3.1 功能描述**

支持多维度数据筛选，实现数据下钻分析。

**3.6.3.2 筛选维度**

| 筛选字段 | 数据来源 | 说明 |
|---------|---------|------|
| 区域 | meeting_registration.market_service_attribution | 大区筛选 |
| 门店 | meeting_registration.store_name | 店铺筛选 |
| 日期 | meeting_schedule_stats.schedule_date | 日期范围 |
| 时段 | meeting_schedule_stats.time_period | 时间段筛选 |
| 场景 | meeting_schedule_stats.scene | 场景筛选 |

**3.6.3.3 验收标准**

- [ ] 筛选器正常工作
- [ ] 筛选后图表数据同步更新

---

### 3.7 议题 VS 目标达成

#### 3.7.1 目标VS达成柱状图

**3.7.1.1 功能描述**

展示各区域的目标完成情况，以分组柱状图形式呈现。

**3.7.1.2 数据映射**

| 维度 | 数据来源 | 字段 | 说明 |
|-----|---------|------|------|
| X轴（大区） | meeting_region_transaction_targets | region | 区域 |
| 成交低限 | meeting_region_transaction_targets | min_deal | 目标低限线 |
| 成交高限 | meeting_region_transaction_targets | max_deal | 目标高限线 |
| 达成金额 | meeting_transaction_details | new_deal_amount | 按 region 汇总 SUM(new_deal_amount) |

**3.7.1.3 SQL参考**

```sql
SELECT
    t.region,
    t.min_deal AS low_limit,
    t.max_deal AS high_limit,
    COALESCE(SUM(d.new_deal_amount), 0) AS deal_amount
FROM meeting_region_transaction_targets t
LEFT JOIN meeting_transaction_details d
    ON t.region = d.region AND d.deal_type = '新成交'
GROUP BY t.region, t.min_deal, t.max_deal
ORDER BY t.region;
```

**3.7.1.4 验收标准**

- [ ] 分组柱状图展示达成vs目标
- [ ] 辅助线标注低限/高限

---

#### 3.7.2 维度说明表格

**3.7.2.1 功能描述**

详细展示各区域的达成数据表格。

**3.7.2.2 表格配置**

| 列名 | 数据来源 | 说明 |
|-----|---------|------|
| 序号 | 序号 | 自动生成 |
| 区域 | meeting_region_transaction_targets.region | 区域名称 |
| 达成 | meeting_transaction_details.new_deal_amount | 成交金额汇总 |
| 目标 | meeting_region_transaction_targets.performance_target | 业绩目标 |
| 低限 | meeting_region_transaction_targets.min_deal | 成交低限 |
| 高限 | meeting_region_transaction_targets.max_deal | 成交高限 |
| 达成率 | 计算 | 达成÷目标×100% |
| 差值 | 计算 | 达成-目标 |

**3.7.2.3 SQL参考**

```sql
SELECT
    @rownum := @rownum + 1 AS row_num,
    t.region AS region_name,
    COALESCE(d.deal_amount, 0) AS actual_amount,
    t.performance_target AS target_amount,
    t.min_deal AS min_limit,
    t.max_deal AS max_limit,
    ROUND(COALESCE(d.deal_amount, 0) / NULLIF(t.performance_target, 0) * 100, 2) AS achievement_rate,
    COALESCE(d.deal_amount, 0) - COALESCE(t.performance_target, 0) AS difference
FROM meeting_region_transaction_targets t
LEFT JOIN (
    SELECT region, SUM(new_deal_amount) AS deal_amount
    FROM meeting_transaction_details
    WHERE deal_type = '新成交'
    GROUP BY region
) d ON t.region = d.region,
(SELECT @rownum := 0) r
ORDER BY t.region;
```

**3.7.2.4 验收标准**

- [ ] 表格数据完整
- [ ] 达成率自动计算
- [ ] 正负差值清晰显示

---

### 3.8 完成进度

#### 3.8.1 完成度排行

**3.8.1.1 功能描述**

展示各区域的完成度排行，以条形图形式呈现。

**3.8.1.2 数据映射**

| 维度 | 数据来源 | 计算方式 |
|-----|---------|---------|
| 大区 | meeting_region_transaction_targets | region |
| 成交高限 | meeting_region_transaction_targets | max_deal |
| 达成金额 | meeting_transaction_details | SUM(new_deal_amount) 按 region |
| 完成度 | 计算 | SUM(new_deal_amount) / max_deal |

**3.8.1.3 SQL参考**

```sql
SELECT
    t.region AS region_name,
    COALESCE(d.deal_amount, 0) AS deal_amount,
    t.max_deal AS high_limit,
    ROUND(COALESCE(d.deal_amount, 0) / NULLIF(t.max_deal, 0) * 100, 2) AS completion_rate
FROM meeting_region_transaction_targets t
LEFT JOIN (
    SELECT region, SUM(new_deal_amount) AS deal_amount
    FROM meeting_transaction_details
    WHERE deal_type = '新成交'
    GROUP BY region
) d ON t.region = d.region
ORDER BY completion_rate DESC;
```

**3.8.1.4 汇总指标**

- 平均完成率 = 各区域完成率的平均值

**3.8.1.5 平均完成率 SQL**

```sql
SELECT
    ROUND(AVG(completion_rate), 2) AS avg_completion_rate
FROM (
    SELECT
        t.region,
        ROUND(COALESCE(d.deal_amount, 0) / NULLIF(t.max_deal, 0) * 100, 2) AS completion_rate
    FROM meeting_region_transaction_targets t
    LEFT JOIN (
        SELECT region, SUM(new_deal_amount) AS deal_amount
        FROM meeting_transaction_details
        WHERE deal_type = '新成交'
        GROUP BY region
    ) d ON t.region = d.region
    HAVING completion_rate IS NOT NULL
) t;
```

**3.8.1.6 验收标准**

- [ ] 条形图正确展示
- [ ] 成交金额与成交高限对比显示
- [ ] 平均完成率计算正确

---

### 3.9 方案情报

#### 3.9.1 方案概览表

**3.9.1.1 功能描述**

展示各成交方案的目标与达成情况。

**3.9.1.2 表格配置**

| 列名 | 数据来源 | 字段 |
|-----|---------|------|
| 大区 | meeting_region_proposal_targets | region |
| 方案类型 | meeting_region_proposal_targets | proposal_type |
| 目标数量 | meeting_region_proposal_targets | target_count |
| 达成数量 | meeting_transaction_details | COUNT(id)，按 region 关联，deal_type 包含 '新成交' 且 deal_content 包含对应 proposal_type |

**3.9.1.3 达成数量匹配规则**

```sql
-- 达成数量：匹配 deal_content 中是否包含 proposal_type 关键词
-- 特殊规则：deal_content 中的"海心卡"或"细胞卡"都对应 proposal_type 的"海心卡/细胞卡"
SELECT
    p.region,
    p.proposal_type,
    p.target_count,
    COUNT(d.id) AS achieved_count
FROM meeting_region_proposal_targets p
LEFT JOIN meeting_transaction_details d
    ON p.region = d.region
    AND d.deal_type LIKE '%新成交%'
    AND (
        d.deal_content LIKE CONCAT('%', p.proposal_type, '%')
        OR (p.proposal_type LIKE '%海心卡%' AND (d.deal_content LIKE '%海心卡%' OR d.deal_content LIKE '%细胞卡%'))
        OR (p.proposal_type LIKE '%细胞卡%' AND (d.deal_content LIKE '%海心卡%' OR d.deal_content LIKE '%细胞卡%'))
    )
GROUP BY p.region, p.proposal_type, p.target_count
ORDER BY p.region, p.proposal_type;
```

> 注：meeting_region_proposal_targets 表当前为空（0 条数据），需先灌入方案目标配置数据后才能正常使用。

**3.9.1.4 验收标准**

- [ ] 方案数据完整展示
- [ ] 达成数量匹配正确

---

#### 3.9.2 多维交叉明细表

**3.9.2.1 功能描述**

展示各方案在各区域的达成情况交叉矩阵。

**3.9.2.2 表格配置**

| 列名 | 数据来源 |
|-----|---------|
| 大区 | meeting_region_transaction_targets.region |
| 各方案列 | 来自 meeting_region_proposal_targets.proposal_type 的动态列 |

**3.9.2.3 验收标准**

- [ ] 矩阵表格正确展示
- [ ] 数据清晰

---

## 四、数据需求

### 4.1 数据源概述

所有数据通过以下核心数据表提供：

1. **meeting_registration**：报名客户信息表（1,250条记录）
2. **meeting_customer_analysis**：客户分析表（3,676条记录）
3. **meeting_schedule_stats**：运营时段统计表（88条记录）
4. **meeting_transaction_details**：成交明细表（5条记录）
5. **meeting_region_transaction_targets**：区域成交目标配置表（11条记录）
6. **meeting_region_proposal_targets**：区域方案目标配置表（当前 0 条，待灌入数据）

### 4.2 数据表详细结构

#### 4.2.1 meeting_registration（报名客户表）

**表用途**：存储客户的报名签到信息

**记录数**：1,250条

**字段结构**：

| 字段名 | 类型 | 说明 | 取值示例 |
|-------|------|------|---------|
| id | int | 主键 | 1 |
| audit_status | varchar(50) | 审核状态 | - |
| sign_in_status | varchar(50) | 签到状态 | 未签到 |
| customer_name | varchar(100) | 客户姓名 | 张三 |
| gender | varchar(10) | 性别 | - |
| customer_category | varchar(50) | 客户类别 | 老顾客/新顾客/陪同 |
| attendee_role | varchar(50) | 参会角色 | 终端顾客/市场人员/店铺陪同/百万VIP贵宾/千万VIP贵宾/千万家属/百万家属 |
| store_name | varchar(100) | 店铺/来源企业 | 海南丽滋、XXX健康管理等 |
| president_name | varchar(100) | 总裁姓名 | - |
| market_service_attribution | varchar(100) | 市场服务归属（含大区信息） | 蒋晓莹大区,XX分公司 |
| ticket | varchar(100) | 门票类型 | - |
| customer_level | varchar(50) | 客户等级 | - |
| customer_level_name | varchar(100) | 客户金额等级名称 | 千万客户/300万以上客户/百万客户/NULL |
| customer_unique_id | varchar(50) | 客户唯一标识 | 3CC53B5A4A4011 |
| res_rights_days | int | 权益天数 | - |
| check_out_date | date | 退房日期 | - |
| record_date | date | 记录日期 | - |
| ticket_2 | varchar(100) | 门票2 | - |
| sign_in_code | varchar(50) | 签到码 | - |
| flight_info | varchar(255) | 航班信息 | - |
| allocation | varchar(100) | 分配 | - |
| pre_room_allocation | varchar(100) | 房间预分配 | - |
| sign_in_date_1 | date | 签到日期 | - |
| check_out_date_1 | date | 退房日期1 | - |
| remark | text | 备注 | - |
| family_id | varchar(50) | 家庭ID | - |
| family_total_consumption | decimal(15,2) | 家庭总消费 | - |
| ranking | int | 排名 | - |
| base_or_forum | varchar(100) | 基础/论坛 | - |
| created_at | timestamp | 创建时间 | - |
| updated_at | timestamp | 更新时间 | - |

**关键业务逻辑**：

- sign_in_status = '已签到' 表示客户已抵达
- customer_unique_id 是关联其他表的关键字段
- store_name 可用于判断客户来源（盟主/商务/店铺）
- SUBSTRING_INDEX(market_service_attribution, ',', 1) 用于提取大区名称
- customer_level_name 用于金额等级分组

---

#### 4.2.2 meeting_customer_analysis（客户分析表）

**表用途**：存储客户画像和目标客户分析数据

**记录数**：3,676条

**已知数据问题**：`customer_unique_id` 字段当前全部为 NULL，影响跨表关联。

**字段结构**：

| 字段名 | 类型 | 说明 | 取值示例 |
|-------|------|------|---------|
| id | int | 主键 | 1 |
| customer_unique_id | varchar(50) | 客户唯一标识 | **当前全部为 NULL** |
| region | varchar(50) | 大区 | 蒋晓莹大区/田晓静大区/王红丽大区/段延芳大区/陈秀敏大区/黄刚大区/李红霞大区/李英大区/樊明花大区/公司直管/商务BU |
| branch | varchar(100) | 分公司 | - |
| market_teacher | varchar(100) | 市场老师 | - |
| customer_name | varchar(100) | 客户姓名 | - |
| new_or_old_customer | varchar(20) | 新老客户 | 老顾客/新顾客/陪同/取消/老/新客户/老客户/终端 |
| customer_level | varchar(50) | 金额等级 | 千万客户/百万客户/普通客户/NULL |
| customer_type | varchar(50) | 客户类型 | - |
| invite_time | varchar(255) | 邀请时间 | - |
| invite_method_scene | varchar(100) | 邀请方式/场景 | - |
| is_confirmed_attend | varchar(20) | 是否确认参加 | - |
| prep_scene | varchar(100) | 铺垫场景 | - |
| prep_inviter | varchar(100) | 铺垫邀约人 | - |
| comm_content | text | 沟通内容 | - |
| customer_feedback | text | 客户反馈 | - |
| chief_complaint | text | 主要诉求 | - |
| cash_flow | varchar(100) | 现金流 | - |
| family_history | text | 家族史 | - |
| health_habits | text | 健康习惯 | - |
| deal_plan | text | 成交计划 | - |
| min_deal | decimal(15,2) | 成交低限 | - |
| max_deal | decimal(15,2) | 成交高限 | - |
| consumption_target | decimal(15,2) | 消耗目标 | - |
| prep_maturity | varchar(50) | 铺垫成熟度 | 0.1-100数值/铺垫成熟/取消等 |
| deal_path_proposal | text | 成交路径方案 | - |
| main_responsible_person | varchar(100) | 主要负责人 | - |
| warm_up_person | varchar(100) | 暖场人 | - |
| main_attacker | varchar(100) | 主攻人 | - |
| revival_person | varchar(100) | 唤醒人 | - |
| created_at | datetime | 创建时间 | - |
| updated_at | datetime | 更新时间 | - |

**关键业务逻辑**：

- region 字段需要清洗统一，排除无效值（如 '细胞。和王艳红夫妻'）
- customer_level = '千万客户'/'百万客户'/'普通客户' 用于金额等级分析
- min_deal > 0 OR consumption_target > 0 表示目标客户

---

#### 4.2.3 meeting_schedule_stats（运营时段统计表）

**表用途**：存储会议期间各时段的人流统计数据

**记录数**：88条

**字段结构**：

| 字段名 | 类型 | 说明 | 取值示例 |
|-------|------|------|---------|
| id | int | 主键 | 1 |
| scene | varchar(100) | 场景 | 住宿/参会/活动/在院环节/就餐环节/未参与环节人员 |
| time_period | varchar(50) | 时间段 | 住宿人数/离开人数/听课-下午/午餐/晚餐/体检人数等 |
| schedule_date | date | 日期 | 2024-12-14 至 2024-12-20 |
| people_count | int | 人数 | - |
| created_at | datetime | 创建时间 | - |
| updated_at | datetime | 更新时间 | - |

**数据维度说明**：

```
scene字段取值：
- 住宿
- 参会/活动
- 在院环节
- 就餐环节
- 未参与环节人员

time_period字段取值：
- 住宿人数、当日新抵达人数、理应在场人数
- 离开人数
- 参加会议.活动-上午、参加会议，活动-晚上、听课-下午
- 参加率-上午、参加率-下午、参加率-晚上
- 体检人数、医院人数-医美、医院人数合计
- 预约交付、预约见诊
- 午餐、晚餐
- 未参与环节人员

schedule_date取值：2024-12-14 至 2024-12-20（共7天）
```

---

#### 4.2.4 meeting_transaction_details（成交明细表）

**表用途**：存储客户成交记录

**记录数**：5条

**字段结构**：

| 字段名 | 类型 | 说明 | 取值示例 |
|-------|------|------|---------|
| id | int | 主键 | 1 |
| customer_unique_id | varchar(50) | 客户唯一标识 | - |
| record_date | date | 记录日期 | - |
| region | varchar(50) | 大区 | 段延芳大区/黄刚大区 |
| branch | varchar(100) | 分公司 | - |
| market_teacher | varchar(100) | 市场老师 | - |
| store_name | varchar(100) | 店铺 | - |
| president_name | varchar(100) | 总裁姓名 | - |
| identity_role | varchar(50) | 身份角色 | - |
| customer_category | varchar(50) | 客户类别 | - |
| sign_in_type | varchar(50) | 签到类型 | - |
| customer_name | varchar(100) | 客户姓名 | - |
| deal_type | varchar(50) | 成交类型 | 新成交/消耗 |
| deal_content | text | 成交内容 | 新成交：39.8万四维能量卡 |
| new_deal_amount | decimal(15,2) | 新成交金额 | 398000.00 |
| received_amount | decimal(15,2) | 收款金额 | 398000.00 |
| consumed_amount | decimal(15,2) | 消耗金额 | 656400.00 |
| new_deal_type | varchar(50) | 新成交类型 | - |
| plan_type | varchar(50) | 方案类型 | 100万及以内方案 |
| plan_type_sub | varchar(100) | 方案子类型 | - |
| plan_quantity | int(11) | 方案数量 | - |
| special_remarks | text | 特别备注 | - |
| created_at | datetime | 创建时间 | - |
| updated_at | datetime | 更新时间 | - |

**关键业务逻辑**：

- new_deal_amount 用于计算已成交金额
- received_amount 用于计算已收款金额
- consumed_amount 用于计算已消耗预算
- deal_type = '新成交' 用于区分新成交和消耗
- deal_content 用于匹配方案类型

---

#### 4.2.5 meeting_region_transaction_targets（区域成交目标配置表）

**表用途**：存储各区域的成交目标配置

**记录数**：11条

**字段结构**：

| 字段名 | 类型 | 说明 |
|-------|------|------|
| id | int | 主键 |
| region | varchar(100) | 大区 |
| attendance_target | int | 到场目标 |
| min_attendance_target | int | 最低到场目标 |
| system_registration_count | int | 系统报名人数 |
| prep_submission_count | int | 铺垫提交数 |
| prep_submission_rate | decimal(10,4) | 铺垫提交率 |
| performance_target | decimal(15,2) | 业绩目标 |
| min_deal | decimal(15,2) | 成交低限 |
| max_deal | decimal(15,2) | 成交高限 |
| consumption_target | decimal(15,2) | 消耗目标 |
| actual_consumption_target | decimal(15,2) | 实际消耗目标 |
| high_level_target | decimal(15,2) | 高水平目标 |
| low_level_target | decimal(15,2) | 低水平目标 |
| balance_payment | decimal(15,2) | 尾款 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

---

#### 4.2.6 meeting_region_proposal_targets（区域方案目标配置表）

**表用途**：存储各区域各方案的目标数量配置

**记录数**：0条（待灌入数据）

**字段结构**：

| 字段名 | 类型 | 说明 |
|-------|------|------|
| id | int | 主键 |
| region | varchar(100) | 大区 |
| proposal_type | varchar(100) | 方案类型 |
| target_count | int | 目标数量 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

---

### 4.3 数据关联关系

```
meeting_registration（报名签到表）
    ├── customer_unique_id ────→ 主键关联
    ├── market_service_attribution ────→ 大区提取
    ├── customer_level_name ────→ 金额等级
    ├── sign_in_status ────→ 已抵达判断
    ├── store_name ────→ 来源判断（盟主/商务/店铺）
    ├── attendee_role ────→ 身份类型
    └── customer_category ────→ 新老客户

meeting_customer_analysis（客户分析表）
    ├── customer_unique_id ────→ [当前为NULL，暂用customer_name关联]
    ├── region ────→ 区域维度
    ├── customer_level ────→ 金额等级
    ├── min_deal / consumption_target ────→ 目标客户判断
    └── prep_maturity ────→ 铺垫成熟度

meeting_transaction_details（成交明细表）
    ├── region ────→ 关联 meeting_region_transaction_targets
    ├── new_deal_amount ────→ 成交金额
    ├── received_amount ────→ 收款金额
    ├── consumed_amount ────→ 消耗金额
    └── deal_content ────→ 方案匹配

meeting_region_transaction_targets（成交目标表）
    ├── region ────→ 区域
    ├── min_deal / max_deal ────→ 低限/高限
    └── performance_target ────→ 业绩目标

meeting_region_proposal_targets（方案目标表）
    ├── region ────→ 区域
    ├── proposal_type ────→ 方案类型
    └── target_count ────→ 目标数量

meeting_schedule_stats（运营统计表）
    ├── schedule_date ────→ 时间维度
    ├── scene ────→ 场景分类
    └── time_period ────→ 时段分类
```

### 4.4 数据清洗规则

#### 4.4.1 区域字段清洗（meeting_registration）

```
从 market_service_attribution 提取大区：
SUBSTRING_INDEX(market_service_attribution, ',', 1)
```

#### 4.4.2 区域字段清洗（meeting_customer_analysis）

```
原始值 → 标准化
- 蒋晓莹大区 → 蒋晓莹大区
- 田晓静大区 → 田晓静大区
- 王红丽大区 → 王红丽大区
- 段延芳大区 → 段延芳大区
- 陈秀敏大区 → 陈秀敏大区
- 黄刚大区 → 黄刚大区
- 李红霞大区 → 李红霞大区
- 李英大区 → 李英大区
- 樊明花大区 → 樊明花大区
- 公司直管 → 公司直管
- 商务BU → 商务BU
- 细胞。和王艳红夫妻 → （无效数据，需过滤）
```

#### 4.4.3 新老客户清洗

```
原始值 → 标准化
- 老顾客/老客户/老 → 老客户
- 新顾客/新客户/新 → 新客户
- 陪同/终端 → 其他
- 取消 → 过滤
```

#### 4.4.4 铺垫成熟度清洗

```
原始值 → 标准化
- 数值型(0.1-100) → 直接使用
- "铺垫成熟"相关文本 → 高
- "取消" → 低
- 其他文本 → 中
```

### 4.5 数据更新机制

| 数据类型 | 更新频率 | 责任方 | 更新方式 |
|---------|---------|-------|---------|
| 报名/签到数据 | 实时 | 系统 | 导入meeting_registration |
| 客户分析数据 | 每日 | 运营 | 更新meeting_customer_analysis |
| 成交数据 | 每日 | 财务 | 更新meeting_transaction_details |
| 运营时段数据 | 每日 | 运营 | 更新meeting_schedule_stats |

### 4.6 数据质量要求

1. **唯一性**：customer_unique_id需保持唯一
2. **完整性**：关键字段不允许为空
3. **一致性**：region等枚举字段需使用标准值
4. **时效性**：数据需在每日18:00前更新完成

### 4.7 已知数据问题

| 问题 | 影响 | 建议 |
|------|------|------|
| meeting_customer_analysis.customer_unique_id 全部为 NULL | 所有跨表 JOIN 查询返回 0 条结果 | 尽快补充 customer_unique_id 数据 |
| meeting_registration.sign_in_status 全部为 '未签到' | 签到相关指标均为 0 | 确认签到数据录入流程 |
| meeting_region_proposal_targets 表为空 | 方案概览表无目标数据 | 灌入各方案目标配置 |
| 数据库为 MySQL 5.7 | 不支持 ROW_NUMBER() 等窗口函数 | SQL 使用 @rownum 变量方式替代 |

---

## 五、附录：数据库连接信息

```
主机：rm-2ze1r48g54eg09z53.mysql.rds.aliyuncs.com
数据库：test_stat_data
用户名：stat_dev_251029
密码：8uI%K&$oybe@nCHB
MySQL版本：5.7.44
```

**核心数据表**：

- meeting_customer_analysis（客户分析表）
- meeting_registration（报名签到表）
- meeting_schedule_stats（运营时段统计表）
- meeting_transaction_details（成交明细表）
- meeting_region_proposal_targets（区域方案目标表）
- meeting_region_transaction_targets（区域成交目标表）
