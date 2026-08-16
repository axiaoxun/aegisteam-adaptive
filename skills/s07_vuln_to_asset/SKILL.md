---
name: s07_vuln_to_asset
version: v1.3.0
owner_agent: a1_asset_manager
tag: stable
category: asset
---

# S07 Vuln to Asset — 漏洞-资产关联

## 作用

关联组件漏洞到具体资产,基于 SBOM + 漏洞扫描器输出,按 EPSS / KEV 加权排序。

## 输入

- `asset_id`
- `sbom_components`(可选)
- `vuln_list`(可选)

## 输出

```json
{
  "affected_assets": [{"asset_id": "web-app-prod-01", "component": "OpenSSH 7.4p1", "cve_id": "CVE-2023-38408", "cvss_v3": 8.1, "epss_score": 0.42, "kev_listed": false, "risk_score": 7.8, "rank": 1}],
  "ranking_basis": "EPSS * 0.6 + CVSS * 0.3 + KEV * 0.1"
}
```

## 排序算法

```
risk_score = EPSS * 0.6 + CVSS_normalized * 0.3 + (KEV ? 1.0 : 0.0) * 0.1
```

## 工具契约

- `mock_sbom.scan_vulnerabilities`:POST /tools/{scenario_id}/mock_sbom.scan_vulnerabilities body {"asset_id": "..."}
- `mock_vuln_scanner.scan_target`:POST /tools/{scenario_id}/mock_vuln_scanner.scan_target body {"target": "...", "scan_type": "full"}

## AgentLoop 迭代痕迹

- v1.0(2026-07-18):基础关联
- v1.1(2026-07-30):EPSS 加权
- v1.2(2026-08-08):KEV 加权 + 排序算法
- v1.3(2026-08-13):EPSS 权重 0.4→0.6,排序更准

## 真实产品参考

- Tenable.sc VPR(Vulnerability Priority Rating)
- Qualys VMDR TruRisk
- Kenna Security(现 Cisco)
