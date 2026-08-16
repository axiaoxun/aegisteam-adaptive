---
name: s22_risk_guard
version: v1.2.0
owner_agent: a5_incident_responder
tag: stable
category: response
---

# S22 Risk Guard — 风险分级与不可自动化清单

## 作用

按风险等级(L0-L3)判断是否允许自动执行,校验不可自动化清单。

## 输入

- `remediation_step`(来自 s21)
- `context`(资产/合规/业务上下文)

## 输出

```json
{
  "risk_assessment": {
    "level": "L2",
    "level_basis": "升级生产组件 + 30 分钟停机窗口",
    "auto_executable": false,
    "approval_required": true,
    "approval_gate": "H1+H2"
  },
  "non_automatable_check": {
    "is_non_automatable": false,
    "matched_rules": []
  }
}
```

## L0-L3 分级规则

| 等级 | 含义 | 自动执行 |
|---|---|---|
| L0 | 只读取证、查询、检索 | ✅ |
| L1 | 阻断 IP、关闭告警、禁用默认账户 | ✅(经 A0 串行确认) |
| L2 | 升级组件、调整配置、灰度发布 | ❌(需 H1+H2) |
| L3 | 修改管理办法、数据出境、算法备案、强制隔离 | ❌(需三审) |

## 不可自动化清单(强制校验)

- ❌ 任何对生产数据库的 DDL
- ❌ 任何对核心系统的强制隔离/下线
- ❌ 任何对外公开的合规承诺(法律效应)
- ❌ 任何对用户数据的删除/批量脱敏
- ❌ 任何对算法模型的重新训练/下线

## AgentLoop 迭代痕迹

- v1.0(2026-08-03):L0-L3 分级
- v1.1(2026-08-10):不可自动化清单
- v1.2(2026-08-15):增加 context 上下文(资产 criticality + 合规范围 + 业务影响)

## 真实产品参考

- NIST SP 800-61 风险评估
- ISO 27005 风险管理
- COBIT 2019 风险治理
