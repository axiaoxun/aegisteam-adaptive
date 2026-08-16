---
name: s10_impact_mapping
version: v1.1.0
owner_agent: a2_threat_detector
tag: stable
category: detection
---

# S10 Impact Mapping — 影响面映射

## 作用

推断受影响服务、接口、用户动作、业务影响,关联到具体资产。

## 输入

- `incident_candidate`(来自 s09)
- `asset_profile`(来自 a1)

## 输出

```json
{
  "affected_services": ["sshd", "order-service"],
  "affected_apis": ["/api/order/create"],
  "affected_user_actions": ["登录", "下单"],
  "business_impact": "P1,5 分钟内 217 次登录失败,潜在账户接管风险",
  "blast_radius": {"users_affected": 0, "services_affected": 2, "data_at_risk": "credentials"}
}
```

## 推断规则

- 资产 profile.criticality → 业务影响
- 暴露面(internet/DMZ/internal)→ 攻击可达性
- 数据分类(PII/敏感/核心)→ 数据风险

## 工具契约

- `mock_cmdb.get_asset`:POST /tools/{scenario_id}/mock_cmdb.get_asset body {"asset_id": "..."}

## AgentLoop 迭代痕迹

- v1.0(2026-07-21):服务/API 推断
- v1.1(2026-08-04):增加用户动作与 blast_radius

## 真实产品参考

- Datadog Service Catalog 影响分析
- Honeycomb Service Map
- PagerDuty 业务影响分析
