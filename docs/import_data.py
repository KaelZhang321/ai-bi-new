import pandas as pd
import numpy as np
from sqlalchemy import create_engine, text
import os
import urllib.parse

# Database connection string
# Change username and password as appropriate depending on local DB setup
db_host = "rm-2ze1r48g54eg09z53.mysql.rds.aliyuncs.com"
# 测试数据库
db_name = "test_stat_data"
db_user = "stat_dev_251029"
db_password = "8uI%K&$oybe@nCHB"  # Replace with actual password

# 生产数据库
#db_name = "stat_data"
#db_user = "stat"
#db_password = "ksn%!kN5%iJ%v2Lz"  # Replace with actual password

import urllib.parse
engine = create_engine(f'mysql+pymysql://{urllib.parse.quote_plus(db_user)}:{urllib.parse.quote_plus(db_password)}@{db_host}/{db_name}?charset=utf8mb4')

def clean_data(df):
    """Clean the dataframe by replacing NaN with None and converting common datetime to string/date where appropriate"""
    return df.replace({np.nan: None})

def mysql_upsert(df, table_name, engine):
    """
    Perform an "upsert" (INSERT ... ON DUPLICATE KEY UPDATE) into a MySQL table.
    """
    if df.empty:
        return
    
    # Get columns
    cols = df.columns.tolist()
    
    # Prepare the INSERT statement
    col_names = ", ".join([f"`{c}`" for c in cols])
    # Use named parameters for SQLAlchemy/text
    placeholders = ", ".join([f":{c}" for c in cols])
    
    # Prepare the UPDATE part 
    update_stmt = ", ".join([f"`{c}`=VALUES(`{c}`)" for c in cols if c != 'created_at'])
    
    sql = f"INSERT INTO `{table_name}` ({col_names}) VALUES ({placeholders}) ON DUPLICATE KEY UPDATE {update_stmt}"
    
    # Convert DataFrame to list of dictionaries for SQLAlchemy named parameters
    data = df.to_dict(orient='records')
    
    with engine.begin() as conn:
        conn.execute(text(sql), data)

print("Starting import process...")

# 1. hainan_registration - 318盛典信息复核0311.xlsx
file_1 = "318盛典信息复核0311.xlsx"
if os.path.exists(file_1):
    print(f"Importing {file_1}...")
    df_1 = pd.read_excel(file_1)
    
    # Map column names
    col_map_1 = {
        '审核状态': 'audit_status',
        '签到状态': 'sign_in_status',
        '参会人姓名': 'customer_name',
        '参会人性别': 'gender',
        '顾客类别': 'customer_category',
        '参会人角色': 'attendee_role',
        '企业名称': 'store_name',
        '企业总裁姓名': 'president_name',
        '市场服务归属': 'market_service_attribution',
        '门票': 'ticket',
        '客户等级': 'customer_level',
        '客户等级名称': 'customer_level_name',
        '参会人身份证号唯一码': 'customer_unique_id',
        '可居住权益天数': 'res_rights_days',
        '退房日期': 'check_out_date',
        '签到日期': 'record_date',
        '门票2 ': 'ticket_2',
        '签到码': 'sign_in_code',
        '航班信息': 'flight_info',
        '分配': 'allocation',
        '预分房': 'pre_room_allocation',
        '签到日期.1': 'sign_in_date_1',
        '退房日期.1': 'check_out_date_1',
        '备注': 'remark',
        '家庭编号': 'family_id',
        '2018年8月-2026年3月家庭累计消费': 'family_total_consumption',
        '排名': 'ranking',
        '基地标大or亚论标大': 'base_or_forum'
    }
    # Clean column names in df to ensure match
    df_1.columns = [col.strip() if type(col) == str else col for col in df_1.columns]
    
    # Update dict keys by stripping just in case
    col_map_1 = {k.strip(): v for k, v in col_map_1.items()}
    
    df_1 = df_1.rename(columns=col_map_1)
    
    # Keep only mapped columns in case there are extras
    cols_to_keep = [v for v in col_map_1.values() if v in df_1.columns]
    df_1 = df_1[cols_to_keep]
    df_1 = clean_data(df_1)
    
    try:
        mysql_upsert(df_1, 'meeting_registration', engine)
        print(f"Successfully processed {len(df_1)} records into meeting_registration (Upsert).")
    except Exception as e:
        print(f"Error importing {file_1}: {e}")
else:
    print(f"File {file_1} not found.")

# 2. customer_analysis_318 - 318盛典客户分析表-汇总.xlsx
file_2 = "318盛典客户分析表-汇总.xlsx"
if os.path.exists(file_2):
    print(f"Importing {file_2}...")
    # Skip the first combined header row (row 0), use the second row as header (row 1)
    df_2 = pd.read_excel(file_2, header=1)
    
    col_map_2 = {
        '大区': 'region',
        '分公司': 'branch',
        '市场': 'market_teacher',
        '客户姓名': 'customer_name',
        '新老客户': 'new_or_old_customer',
        '客户等级': 'customer_level',
        '客户类型': 'customer_type',
        '邀约时间': 'invite_time',
        '邀约方式/场景': 'invite_method_scene',
        '是否确认参会': 'is_confirmed_attend',
        '铺垫场景': 'prep_scene',
        '铺垫/邀约人': 'prep_inviter',
        '沟通内容': 'comm_content',
        '客户反馈': 'customer_feedback',
        '客户主诉': 'chief_complaint',
        '现金流': 'cash_flow',
        '家族病史': 'family_history',
        '大健康消费习惯': 'health_habits',
        '成交方案': 'deal_plan',
        '成交低限': 'min_deal',
        '成交高限': 'max_deal',
        '消耗目标': 'consumption_target',
        '铺垫成熟度': 'prep_maturity',
        '成交路径/提案': 'deal_path_proposal',
        '客户主负责人': 'main_responsible_person',
        '预热手': 'warm_up_person',
        '主攻手': 'main_attacker',
        '复活手': 'revival_person'
    }
    
    df_2.columns = [col.strip() if type(col) == str else col for col in df_2.columns]
    col_map_2 = {k.strip(): v for k, v in col_map_2.items()}
    df_2 = df_2.rename(columns=col_map_2)
    
    cols_to_keep = [v for v in col_map_2.values() if v in df_2.columns]
    df_2 = df_2[cols_to_keep]
    
    # Scale deal amounts from "ten thousand" units to full amount
    # for col in ['min_deal', 'max_deal', 'consumption_target']:
    #     if col in df_2.columns:
    #         df_2[col] = pd.to_numeric(df_2[col], errors='coerce') * 10000
            
    df_2 = clean_data(df_2)
    
    try:
        mysql_upsert(df_2, 'meeting_customer_analysis', engine)
        print(f"Successfully processed {len(df_2)} records into meeting_customer_analysis (Upsert).")
    except Exception as e:
        print(f"Error importing {file_2} (customer_analysis): {e}")

    # 5 & 6. Region level targets from '大区-汇总' sheet
    print(f"Importing {file_2} [大区-汇总]...")
    try:
        # Load Table 5: Region Transaction Targets
        df_5 = pd.read_excel(file_2, sheet_name='大区-汇总', nrows=11)
        # Clean '大区' to exclude '合计' and empty rows
        df_5 = df_5[df_5['大区'].notna() & (df_5['大区'] != '合计')]
        
        col_map_5 = {
            '大区': 'region',
            '人数目标': 'attendance_target',
            '保底人数目标': 'min_attendance_target',
            '系统报名情况': 'system_registration_count',
            '铺垫提交数': 'prep_submission_count',
            '铺垫提交率': 'prep_submission_rate',
            '业绩目标': 'performance_target',
            '成交低限': 'min_deal',
            '成交高限': 'max_deal',
            '消耗目标': 'consumption_target',
            '消耗目标.1': 'actual_consumption_target',
            '高': 'high_level_target',
            '低': 'low_level_target',
            '尾款': 'balance_payment'
        }
        df_5.rename(columns=lambda x: str(x).strip(), inplace=True)
        df_5.rename(columns=col_map_5, inplace=True)
        cols_to_keep_5 = [v for v in col_map_5.values() if v in df_5.columns]
        df_5 = df_5[cols_to_keep_5]
        df_5 = clean_data(df_5)
        
        mysql_upsert(df_5, 'meeting_region_transaction_targets', engine)
        print(f"Successfully processed {len(df_5)} records into meeting_region_transaction_targets (Upsert).")

        # Load Table 6: Region Proposal Targets (Range D19:P30)
        # skiprows=18 for Row 19 as header, usecols="D:P", nrows=11 for 10 regions + 1 total row
        df_6_raw = pd.read_excel(file_2, sheet_name='大区-汇总', skiprows=18, nrows=11, usecols="D:P")
        
        # Clean data: drop rows where '大区' is missing or is '合计'
        df_6_raw = df_6_raw[df_6_raw['大区'].notna() & (df_6_raw['大区'] != '合计')]
        
        # Unpivot the proposal types
        id_vars_6 = ['大区']
        # Proposal columns are those between '大区' and '合计' (excluding '合计' itself)
        proposal_cols = [c for c in df_6_raw.columns if c not in ['大区', '合计'] and not str(c).startswith('Unnamed')]
        
        df_6_melted = df_6_raw.melt(id_vars=id_vars_6, value_vars=proposal_cols,
                                    var_name='proposal_type', value_name='target_count')
        
        df_6_melted.rename(columns={'大区': 'region'}, inplace=True)
        df_6_melted['target_count'] = pd.to_numeric(df_6_melted['target_count'], errors='coerce').fillna(0).astype(int)
        df_6_melted = clean_data(df_6_melted)
        
        mysql_upsert(df_6_melted, 'meeting_region_proposal_targets', engine)
        print(f"Successfully processed {len(df_6_melted)} records into meeting_region_proposal_targets (Upsert).")

    except Exception as e:
        print(f"Error importing {file_2} targets: {e}")
else:
    print(f"File {file_2} not found.")

# 3. schedule_stats - 表3.xlsx
file_3 = "表3.xlsx"
if os.path.exists(file_3):
    print(f"Importing {file_3}...")
    df_3 = pd.read_excel(file_3)
    
    df_3.columns = [col.strip() if type(col) == str else col for col in df_3.columns]
    
    # Forward-fill the '场景' column to populate the empty spaces left by Excel's merged cells
    if '场景' in df_3.columns:
        df_3['场景'] = df_3['场景'].ffill()
    
    # Filter out calculation rows (占比, 比例, 就餐率)
    if '日期' in df_3.columns:
        exclude_keywords = ['占比', '比例', '就餐率']
        mask = df_3['日期'].astype(str).apply(lambda x: not any(kw in x for kw in exclude_keywords))
        df_3 = df_3[mask]
        
    id_vars = ['场景', '日期']
    value_vars = [c for c in df_3.columns if c not in id_vars]
    
    # Unpivot DataFrame
    df_3_melted = df_3.melt(id_vars=id_vars, value_vars=value_vars, 
                            var_name='day_str', value_name='people_count')
    # Use specified schema column names
    df_3_melted = df_3_melted.rename(columns={
        '场景': 'scene',
        '日期': 'time_period'
    })
    
    # Basic date padding for visual format like "2024-12-14"
    def parse_date(day_str):
        try:
            day_num = int(str(day_str).replace('日', '').strip())
            return f"2024-12-{day_num:02d}"
        except:
            return None
    
    df_3_melted['schedule_date'] = df_3_melted['day_str'].apply(parse_date)
    df_3_melted = df_3_melted.drop(columns=['day_str'])
    
    # Clean records, ensuring people_count is numeric
    df_3_melted['people_count'] = pd.to_numeric(df_3_melted['people_count'], errors='coerce')
    df_3_melted = df_3_melted.dropna(subset=['people_count'])
    df_3_melted = clean_data(df_3_melted)
    
    try:
        mysql_upsert(df_3_melted, 'meeting_schedule_stats', engine)
        print(f"Successfully processed {len(df_3_melted)} records into meeting_schedule_stats (Upsert).")
    except Exception as e:
        print(f"Error importing {file_3}: {e}")
else:
    print(f"File {file_3} not found.")

# 4. transaction_details - 成交明细示例.xlsx
file_4 = "成交明细示例.xlsx"
if os.path.exists(file_4):
    print(f"Importing {file_4}...")
    df_4 = pd.read_excel(file_4)
    
    col_map_4 = {
        '客户身份唯一码': 'customer_unique_id',
        '日期': 'record_date',
        '大区': 'region',
        '分总': 'branch',
        '老师': 'market_teacher',
        '店铺名称': 'store_name',
        '总裁姓名': 'president_name',
        '身份': 'identity_role',
        '顾客类别': 'customer_category',
        '签到类型': 'sign_in_type',
        '终端姓名': 'customer_name',
        '成交类型': 'deal_type',
        '成交内容': 'deal_content',
        '新成交金额\n（期间补款计0）': 'new_deal_amount',
        '收款金额': 'received_amount',
        '消耗金额': 'consumed_amount',
        '新成交类型': 'new_deal_type',
        '方案类型': 'plan_type',
        '方案类型细分': 'plan_type_sub',
        '方案数量': 'plan_quantity',
        '特殊备注': 'special_remarks'
    }
    
    # Careful with newline in column name
    df_4.rename(columns=lambda x: str(x).strip().replace('\n', ''), inplace=True)
    col_map_4 = {k.strip().replace('\n', ''): v for k, v in col_map_4.items()}
    df_4 = df_4.rename(columns=col_map_4)
    
    cols_to_keep = [v for v in col_map_4.values() if v in df_4.columns]
    df_4 = df_4[cols_to_keep]
    df_4 = clean_data(df_4)
    
    try:
            mysql_upsert(df_4, 'meeting_transaction_details', engine)
            print(f"Successfully processed {len(df_4)} records into meeting_transaction_details (Upsert).")
    except Exception as e:
            print(f"Error importing {file_4} (details): {e}")

    # 7. transaction_summary - 成交汇总 sheet in 成交明细示例.xlsx
    print(f"Importing {file_4} [成交汇总]...")
    try:
        df_summary = pd.read_excel(file_4, sheet_name='成交汇总')
        
        col_map_summary = {
            '名称': 'proposal_type',
            '大区': 'region',
            '目标数量': 'target_count',
            '方案金额': 'proposal_amount',
            '合计金额': 'total_amount',
            '成交方案数量': 'deal_proposal_count',
            '成交金额': 'deal_amount',
            '完款情况': 'payment_status'
        }
        
        df_summary.rename(columns=lambda x: str(x).strip(), inplace=True)
        df_summary = df_summary.rename(columns=col_map_summary)
        
        cols_to_keep_sum = [v for v in col_map_summary.values() if v in df_summary.columns]
        df_summary = df_summary[cols_to_keep_sum]
        
        # Filter out rows where both region and proposal_type are null or they are '合计'
        df_summary = df_summary.dropna(subset=['region', 'proposal_type'], how='all')
        df_summary = df_summary[~df_summary['region'].astype(str).str.contains('合计|总计', na=False)]
        
        df_summary = clean_data(df_summary)
        
        if not df_summary.empty:
            mysql_upsert(df_summary, 'meeting_transaction_summary', engine)
            print(f"Successfully processed {len(df_summary)} records into meeting_transaction_summary (Upsert).")
        else:
            print(f"No valid data found in {file_4} [成交汇总].")
            
    except Exception as e:
        print(f"Error importing {file_4} (summary): {e}")
else:
    print(f"File {file_4} not found.")

print("Import process completed.")
