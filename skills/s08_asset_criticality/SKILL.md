---
name: s08_asset_criticality
version: v1.0.0
owner_agent: a1_asset_manager
tag: stable
category: asset
---

# S08 Asset Criticality — 资产关键度评估

## 作用

评估资产关键度(P0/P1/P2/P3)与合规范围,综合数据敏感度、业务影响、暴露面。

## 输入

- `asset`:资产详情(从 s05 获取)

## 输出

```json
{
  "asset_id": "web-app-prod-01",
  "criticality": "P1",
  "criticality_basis": "公开+内部数据 + 业务核心 + 公网暴露",
  "compliance_scope": ["等保2.0-三级"],
  "data_classification": "公开+内部",
  "business_owner": "Zhang San"
}
```

## 评估规则

| 维度 | 权重 | 评分 |
|---|---|---|
| 数据敏感度 | 0.4 | 公开=1 / 内部=2 / 敏感=3 / 核心=4 |
| 业务影响 | 0.3 | 支持=1 / 重要=2 / 核心=3 / 命脉=4 |
| 暴露面 | 0.2 | 内网=1 / DMZ=2 / 公网=3 / 公网+高交互=4 |
| 合规要求 | 0.1 | 无=1 / 等保三级=2 / 数据出境/医疗=3 / 关基=4 |

总分 >= 3.5 → P0,2.5-3.5 → P1,1.5-2.5 → P2,< 1.5 → P3。

## AgentLoop 迭代痕迹

- v1.0(2026-07-19):4 维加权评估
- v1.0.1(2026-08-15):修复 P0 误判(数据敏感度权重 0.5→0.4)

## 真实产品参考

- NIST CSF 资产分级(FIPS 199)
- ISO 27001 A.8 资产管理
- 阿里云资源标签 + 等级保护
