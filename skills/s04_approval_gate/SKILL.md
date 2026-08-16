---
name: s04_approval_gate
version: v1.0.0
owner_agent: a0_leader
tag: stable
category: orchestration
---

# S04 Approval Gate — 审批门控

## 作用

维护 H1(事实确认)+ H2(执行审批)双审批关口,根据风险分级(L0-L3)路由到人机协同层 Web/IM 通道,触达角色化人员。

## 输入

- `action`:待执行动作
- `risk_level`:L0 / L1 / L2 / L3
- `action_metadata`:动作元数据

## 输出

```json
{
  "approval_required": true,
  "gates": [
    {"gate": "H1", "purpose": "事实确认", "approver_role": "安全工程师(角色)", "channel": "web|im"},
    {"gate": "H2", "purpose": "执行审批", "approver_role": "业务负责人(角色)", "channel": "web|im"}
  ],
  "deadline": "2026-08-17T18:00:00+08:00",
  "audit_trail_ref": "approval:H2-INC-2001-001"
}
```

## 风险分级与审批矩阵

| 风险等级 | 自动执行 | 审批门控 | 角色化人员 |
|---|---|---|---|
| L0 | ✅ | 无 | 无 |
| L1 | ✅(经 A0 串行确认) | H1 事后告知 | 安全工程师(角色) |
| L2 | ❌ | H1 + H2 | 安全工程师(角色) + 业务负责人(角色) |
| L3 | ❌ | H1 + H2 + 三审 | + 合规官(角色) + DBA(角色) |

## 双模式路由

- **Web 平台模式**:AegisConsole 多角色协同
- **IM 通道模式**:钉钉/企微/飞书卡片推送,角色化路由

## AgentLoop 迭代痕迹

- v1.0(2026-07-15):基础 H1/H2 门控
- v1.0.1(2026-08-10):增加 L3 三审
- v1.0.2(2026-08-15):增加 Web/IM 双模式路由

## 真实产品参考

- ServiceNow GRC 审批流
- Jira Service Management 审批
- 钉钉/企微审批流模板
