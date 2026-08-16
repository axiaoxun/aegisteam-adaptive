---
name: s06_sbom_query
version: v1.1.0
owner_agent: a1_asset_manager
tag: stable
category: asset
---

# S06 SBOM Query — 软件物料清单查询

## 作用

拉取资产的 SBOM 组件列表(CycloneDX 1.5 风格),含组件名、版本、purl、许可证、供应商。

## 输入

- `asset_id`

## 输出

```json
{
  "components": [{"bom-ref": "pkg:generic/openssh@7.4p1", "type": "library", "name": "OpenSSH", "version": "7.4p1", "purl": "pkg:generic/openssh@7.4p1", "licenses": [{"license": {"id": "BSD-2-Clause"}}], "supplier": {"name": "OpenBSD"}}],
  "total_components": 2,
  "evidence_ref": "sbom:web-app-prod-01"
}
```

## 工具契约

- `mock_sbom.get_components`:POST /tools/{scenario_id}/mock_sbom.get_components body {"asset_id": "..."}

## 数据格式

- CycloneDX 1.5 字段:`bom-ref / type / name / version / purl / licenses / supplier / vulnerabilities`

## AgentLoop 迭代痕迹

- v1.0(2026-07-17):基础拉取
- v1.1(2026-08-02):增加供应商与许可证字段
- v1.1.1(2026-08-15):修复偶发 purl 字段缺失

## 真实产品参考

- Anchore Enterprise
- FOSSA
- Snyk Open Source
- OWASP Dependency-Check
