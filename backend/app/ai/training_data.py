# 需要训练的表名列表，DDL 会从数据库自动获取
TABLES = [
    "meeting_registration",
    "meeting_customer_analysis",
    "meeting_schedule_stats",
    "meeting_transaction_details",
    "meeting_region_transaction_targets",
    "meeting_region_proposal_targets",
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
        "sql": "SELECT COALESCE(customer_level_name, '未分类') AS level_name, COUNT(*) AS customer_count, ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM meeting_customer_analysis), 2) AS percentage FROM meeting_customer_analysis GROUP BY customer_level_name ORDER BY customer_count DESC",
    },
]
