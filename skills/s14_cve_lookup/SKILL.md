---
name: s14_cve_lookup
version: v1.2.0
owner_agent: a3_vuln_verifier
tag: stable
category: vulnerability
---

# S14 CVE Lookup — CVE 详情查询

## 作用

查询 CVE 详情(CVSS 3.1 / EPSS / CISA KEV / 利用代码可用性 / 修复版本)。

## 输入

- `cve_id`:如 `CVE-2023-38408`

## 输出

```json
{
  "cve_id": "CVE-2023-38408",
  "cvss_v3": 8.1,
  "epss_score": 0.42,
  "kev_listed": false,
  "exploit_available": true,
  "description": "OpenSSH ssh-agent forwarding vulnerability on the server side.",
  "affected_products": ["OpenSSH 7.4p1 - 8.4p1"],
  "fix_versions": ["8.5p1", "9.0p1"],
  "published_at": "2023-07-19",
  "source": ["NVD", "EPSS", "CISA KEV", "Red Hat Security Data"]
}
```

## 工具契约

- `mock_vuln_scanner.get_cve_info`:POST /tools/{scenario_id}/mock_vuln_scanner.get_cve_info body {"cve_id": "..."}

## AgentLoop 迭代痕迹

- v1.0(2026-07-26):基础 CVE 信息
- v1.1(2026-08-02):EPSS + KEV
- v1.2(2026-08-13):exploit_available + 多数据源合并

## 真实产品参考

- NVD(National Vulnerability Database)
- EPSS(EPSS by FIRST.org)
- CISA KEV(known Exploited Vulnerabilities)
- VulnCheck
