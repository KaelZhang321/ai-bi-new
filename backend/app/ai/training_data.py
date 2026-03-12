DDL_STATEMENTS = [
    """
    CREATE TABLE meeting_registration (
        id INT PRIMARY KEY,
        audit_status VARCHAR(50),
        sign_in_status VARCHAR(50) COMMENT '签到状态: 已签到/未签到',
        customer_name VARCHAR(100),
        gender VARCHAR(10),
        customer_category VARCHAR(50) COMMENT '客户类别: 老顾客/新顾客/陪同',
        attendee_role VARCHAR(50) COMMENT '参会角色',
        store_name VARCHAR(100) COMMENT '店铺/来源企业',
        president_name VARCHAR(100),
        market_service_attribution VARCHAR(100) COMMENT '市场服务归属(含大区), 格式: 大区名,分公司',
        ticket VARCHAR(100),
        customer_level VARCHAR(50),
        customer_level_name VARCHAR(100) COMMENT '金额等级: 千万客户/300万以上客户/百万客户',
        customer_unique_id VARCHAR(50) COMMENT '客户唯一标识',
        sign_in_date_1 DATE COMMENT '签到日期',
        flight_info VARCHAR(255) COMMENT '航班信息',
        family_total_consumption DECIMAL(15,2),
        created_at TIMESTAMP,
        updated_at TIMESTAMP
    ) COMMENT='报名客户信息表(1250条)';
    """,
    """
    CREATE TABLE meeting_customer_analysis (
        id INT PRIMARY KEY,
        customer_unique_id VARCHAR(50) COMMENT '当前全部为NULL',
        region VARCHAR(50) COMMENT '大区',
        branch VARCHAR(100),
        customer_name VARCHAR(100),
        new_or_old_customer VARCHAR(20) COMMENT '新老客户',
        customer_level VARCHAR(50) COMMENT '金额等级: 千万客户/百万客户/普通客户',
        min_deal DECIMAL(15,2) COMMENT '成交低限',
        max_deal DECIMAL(15,2) COMMENT '成交高限',
        consumption_target DECIMAL(15,2) COMMENT '消耗目标',
        prep_maturity VARCHAR(50) COMMENT '铺垫成熟度',
        created_at DATETIME,
        updated_at DATETIME
    ) COMMENT='客户分析表(3676条)';
    """,
    """
    CREATE TABLE meeting_schedule_stats (
        id INT PRIMARY KEY,
        scene VARCHAR(100) COMMENT '场景: 住宿/参会/活动/在院环节/就餐环节',
        time_period VARCHAR(50) COMMENT '时间段',
        schedule_date DATE COMMENT '日期: 2024-12-14至2024-12-20',
        people_count INT COMMENT '人数',
        created_at DATETIME,
        updated_at DATETIME
    ) COMMENT='运营时段统计表(88条)';
    """,
    """
    CREATE TABLE meeting_transaction_details (
        id INT PRIMARY KEY,
        customer_unique_id VARCHAR(50),
        record_date DATE,
        region VARCHAR(50) COMMENT '大区',
        store_name VARCHAR(100),
        customer_name VARCHAR(100),
        deal_type VARCHAR(50) COMMENT '成交类型: 新成交/消耗',
        deal_content TEXT COMMENT '成交内容',
        new_deal_amount DECIMAL(15,2) COMMENT '新成交金额',
        received_amount DECIMAL(15,2) COMMENT '收款金额',
        consumed_amount DECIMAL(15,2) COMMENT '消耗金额',
        plan_type VARCHAR(50) COMMENT '方案类型',
        created_at DATETIME,
        updated_at DATETIME
    ) COMMENT='成交明细表(5条)';
    """,
    """
    CREATE TABLE meeting_region_transaction_targets (
        id INT PRIMARY KEY,
        region VARCHAR(100) COMMENT '大区',
        attendance_target INT COMMENT '到场目标',
        performance_target DECIMAL(15,2) COMMENT '业绩目标',
        min_deal DECIMAL(15,2) COMMENT '成交低限',
        max_deal DECIMAL(15,2) COMMENT '成交高限',
        consumption_target DECIMAL(15,2) COMMENT '消耗目标',
        created_at TIMESTAMP,
        updated_at TIMESTAMP
    ) COMMENT='区域成交目标配置表(11条)';
    """,
    """
    CREATE TABLE meeting_region_proposal_targets (
        id INT PRIMARY KEY,
        region VARCHAR(100) COMMENT '大区',
        proposal_type VARCHAR(100) COMMENT '方案类型',
        target_count INT COMMENT '目标数量',
        created_at TIMESTAMP,
        updated_at TIMESTAMP
    ) COMMENT='区域方案目标配置表(当前0条)';
    """,
]

QA_PAIRS = [
    {
        "question": "报名了多少客户？",
        "sql": "SELECT COUNT(*) AS total FROM meeting_registration",
    },
    {
        "question": "已签到多少客户？",
        "sql": "SELECT COUNT(*) AS total FROM meeting_registration WHERE sign_in_status = '已签到'",
    },
    {
        "question": "总成交金额是多少？",
        "sql": "SELECT SUM(new_deal_amount) AS total FROM meeting_transaction_details WHERE deal_type = '新成交'",
    },
    {
        "question": "各大区报名人数是多少？",
        "sql": "SELECT SUBSTRING_INDEX(market_service_attribution, ',', 1) AS region, COUNT(*) AS cnt FROM meeting_registration WHERE market_service_attribution IS NOT NULL GROUP BY region ORDER BY cnt DESC",
    },
    {
        "question": "新老客户比例是多少？",
        "sql": "SELECT customer_category, COUNT(*) AS cnt FROM meeting_registration GROUP BY customer_category ORDER BY cnt DESC",
    },
    {
        "question": "各区域目标完成情况如何？",
        "sql": "SELECT t.region, COALESCE(SUM(d.new_deal_amount), 0) AS deal_amount, t.performance_target, ROUND(COALESCE(SUM(d.new_deal_amount), 0) / NULLIF(t.performance_target, 0) * 100, 2) AS rate FROM meeting_region_transaction_targets t LEFT JOIN meeting_transaction_details d ON t.region = d.region AND d.deal_type = '新成交' GROUP BY t.region, t.performance_target ORDER BY t.region",
    },
    {
        "question": "每个大区有多少千万客户？",
        "sql": "SELECT region, COUNT(*) AS cnt FROM meeting_customer_analysis WHERE customer_level = '千万客户' GROUP BY region ORDER BY cnt DESC",
    },
    {
        "question": "签到率是多少？",
        "sql": "SELECT ROUND(SUM(CASE WHEN sign_in_status = '已签到' THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) AS checkin_rate FROM meeting_registration",
    },
    {
        "question": "哪个大区成交金额最高？",
        "sql": "SELECT region, SUM(new_deal_amount) AS total_amount FROM meeting_transaction_details WHERE deal_type = '新成交' GROUP BY region ORDER BY total_amount DESC LIMIT 1",
    },
    {
        "question": "今天签到了多少人？",
        "sql": "SELECT COUNT(*) AS total FROM meeting_registration WHERE sign_in_status = '已签到' AND sign_in_date_1 = CURDATE()",
    },
    {
        "question": "各场景参与人数是多少？",
        "sql": "SELECT scene, SUM(people_count) AS total_people FROM meeting_schedule_stats GROUP BY scene ORDER BY total_people DESC",
    },
    {
        "question": "收款金额是多少？",
        "sql": "SELECT SUM(received_amount) AS total FROM meeting_transaction_details",
    },
    {
        "question": "消耗预算是多少？",
        "sql": "SELECT SUM(consumed_amount) AS total FROM meeting_transaction_details",
    },
    {
        "question": "成交明细有哪些？",
        "sql": "SELECT region, customer_name, deal_type, deal_content, new_deal_amount, received_amount, consumed_amount FROM meeting_transaction_details ORDER BY new_deal_amount DESC",
    },
    {
        "question": "客户金额等级分布是什么？",
        "sql": "SELECT customer_level_name, COUNT(*) AS cnt FROM meeting_registration WHERE customer_level_name IS NOT NULL GROUP BY customer_level_name ORDER BY cnt DESC",
    },
]
