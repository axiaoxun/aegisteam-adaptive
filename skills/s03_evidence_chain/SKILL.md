---
name: s03_evidence_chain
version: v1.1.0
owner_agent: a0_leader
tag: stable
category: orchestration
---

# S03 Evidence Chain — 证据链拼接

## 作用

跨 Worker 拼接证据,生成可追溯证据链(每条带 source_worker / evidence_ref / verified),输出事故报告的"证据链"字段。

## 输入

- `worker_outputs`:所有业务 Worker 的输出
- `incident_id`

## 输出

```json
{
  "evidence_chain": [
    {"ref": "asset:web-app-prod-01", "source_worker": "a1-asset-manager", "type": "asset_profile", "verified": true, "verified_by": "a6-quality-steward", "timestamp": "2026-08-16T09:05:23+08:00"}
  ],
  "broken_links": [],
  "integrity_score": 0.97
}
```

## 完整性校验

- 每个 evidence_ref 必须能被对应工具二次查询到
- 跨 Worker 引用必须形成有向无环图(DAG)
- A6 校验完整性(0-100),< 90 触发 A0 重跑缺失环节

## AgentLoop 迭代痕迹

- v1.0(2026-07-14):基础拼接
- v1.1(2026-08-03):增加完整性校验 + 二次查询
- v1.1.1(2026-08-15):修复偶发环引用(改为 DAG 校验)

## 真实产品参考

- OpenTelemetry Trace 父子 span
- W3C PROV 数据溯源模型
- 区块链存证(司法证据链)
