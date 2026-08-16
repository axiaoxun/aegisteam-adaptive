---
name: s20_approval_routing
version: v1.0.0
owner_agent: a4_compliance_guard
tag: stable
category: compliance
---

# S20 Approval Routing — 审批路由

## 作用

决定审批路由(角色化人员 + 通道:Web/IM + 截止时间)。

## 输入

- `compliance_action`(合规动作)
- `risk_level`
- `role_availability`(角色人员可用性)

## 输出

```json
{
  "approval_route": [
    {"step": 1, "gate": "H1", "role": "合规官(角色)", "channel": "dingtalk", "deadline": "2026-08-17T18:00:00+08:00"},
    {"step": 2, "gate": "H2", "role": "业务负责人(角色)", "channel": "web", "deadline": "2026-08-19T18:00:00+08:00"}
  ],
  "estimated_completion_hours": 48
}
```

## 路由规则

| 合规动作类型 | 主审角色 | 通道 | 备审 |
|---|---|---|---|
| PIA 评估 | 合规官(角色) | 企微 | 业务负责人(角色) |
| 算法备案 | 合规官(角色)+ 业务负责人(角色) | 钉钉 | 法务 |
| 数据出境 | 合规官(角色)+ DBA(角色) | 飞书 | 业务负责人(角色) |
| 管理办法制定 | 合规官(角色) | 飞书 | 业务负责人(角色) + 法务 |

## AgentLoop 迭代痕迹

- v1.0(2026-08-01):4 类合规动作路由

## 真实产品参考

- ServiceNow GRC 审批路由
- 钉钉/企微审批模板
- 阿里云 GRC 平台
