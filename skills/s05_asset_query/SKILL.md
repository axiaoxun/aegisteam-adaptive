---
name: s05_asset_query
version: v1.2.0
owner_agent: a1_asset_manager
tag: stable
category: asset
---

# S05 Asset Query — 资产查询

## 作用

按多条件查询资产(ip / 类型 / 合规范围 / 关键度 / 标签),支持 5 分钟缓存。

## 输入

- `filter`:`{"ip": "...", "type": "ecs", "criticality": "P0", "compliance_scope": ["等保2.0-三级"], "tag_env": "prod"}`

## 输出

```json
{
  "assets": [{"id": "web-app-prod-01", "name": "Web 应用生产服务器 #1", "type": "ecs", "ip": "10.0.1.21", "public_ip": "47.98.x.x", "criticality": "P1", "compliance_scope": ["等保2.0-三级"], "tags": {"env": "prod"}}],
  "total": 1,
  "cache_hit": false
}
```

## 工具契约

- `mock_cmdb.get_asset`:POST /tools/{scenario_id}/mock_cmdb.get_asset body {"asset_id": "..."}
- `mock_cmdb.list_assets`:POST /tools/{scenario_id}/mock_cmdb.list_assets body {"filter": {...}}

## 缓存策略

- TTL 300 秒
- 缓存键:`asset:filter:{sha1(json.dumps(filter, sort_keys=True))}`

## AgentLoop 迭代痕迹

- v1.0(2026-07-16):仅 asset_id 查询
- v1.1(2026-07-28):增加多条件 filter
- v1.2(2026-08-05):增加 5 分钟缓存 + 集成 list_assets

## 真实产品参考

- 阿里云 CMDB(企业版)API
- 蓝凌 CMP 资产管理
- ServiceNow CMDB CSDM 模型
