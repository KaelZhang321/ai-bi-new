# 接口卡：运营趋势

一句话摘要：`GET /v1/operations/trend` 返回按日期、时间段、场景聚合的人数趋势数据，用于折线图。

## 基本信息
- 路径：`/v1/operations/trend`
- 方法：`GET`
- 服务对象：时间维度趋势分析
- 可信度：已代码验证

## 返回字段
- `schedule_date`
- `day_time_period`
- `scene_label`
- `people_count`

## 当前场景标签
- 参会
- 抵达
- 离开
- 用餐
- 到院

## 后端实现
- 服务：`backend/app/services/operations_service.py#get_trend_data`

## 当前限制
- 不支持日期参数过滤
- 标签归类依赖 `time_period` 文本规则
