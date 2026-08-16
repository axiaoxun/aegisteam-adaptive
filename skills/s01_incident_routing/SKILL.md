---
name: s01_incident_routing
version: v1.1.0
owner_agent: a0_leader
tag: stable
category: orchestration
---

# S01 Incident Routing — 事故路由

## 作用

识别事故类型,选择编排流(告警 / 监管通报 / 新法规响应),返回编排流 ID 与初始上下文。

## 输入

- `incident_id`:事故 ID
- `scenario_id`:场景 ID,直接映射到编排流
- `user_complaint_text`:用户原始描述
- `business_impact_hint`:业务影响提示(可选)

## 输出

```json
{
  "flow_type": "alert | regulator_notice | new_regulation",
  "priority": "P0/P1/P2/P3",
  "initial_context": {"scenario_id": "", "asset_hints": [], "time_window": ""},
  "estimated_steps": 22 | 26 | 14,
  "agents_to_invoke": ["a1", "a2", "a3", "a4", "a5", "a6", "a7"]
}
```

## 路由规则

| 关键词/特征 | 编排流 |
|---|---|
| 含"告警""SIEM""扫描""IP""攻击" | `alert` |
| 含"通报""整改""网安""公安""限期" | `regulator_notice` |
| 含"新法规""实施""办法""备案""PIA" | `new_regulation` |
| scenario_id 直接匹配 | 直接采用 scenario 对应编排流 |

## AgentLoop 迭代痕迹

- v1.0(2026-07-12):初始实现,基于 scenario_id 字符串匹配
- v1.1(2026-08-01):增加关键词识别
- v1.1.1(2026-08-15):修复关键词偶发冲突(通报>告警>法规优先级)

## 真实产品参考

- PagerDuty 事件路由规则
- OpsGenie 事故分类器
- NIST SP 800-61 事故分类
