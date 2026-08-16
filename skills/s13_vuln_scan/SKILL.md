---
name: s13_vuln_scan
version: v1.1.0
owner_agent: a3_vuln_verifier
tag: stable
category: vulnerability
---

# S13 Vuln Scan — 漏洞扫描

## 作用

调用漏洞扫描器,获取目标资产的漏洞清单(CVE / 风险等级 / 端口 / 利用代码可用性)。

## 输入

- `target`:资产 ID 或 IP
- `scan_type`:`full` / `quick` / `compliance`

## 输出

```json
{
  "target": "web-app-prod-01",
  "scan_type": "full",
  "scan_time": "2026-08-16T08:30:00+08:00",
  "vulnerabilities": [
    {"cve_id": "CVE-2023-38408", "component": "openssh 7.4p1", "severity": "HIGH", "cvss_v3": 8.1, "port": 22, "exploit_available": true}
  ],
  "open_ports": [{"port": 22, "service": "ssh", "exposed_to": "internet", "risk": "high"}]
}
```

## 工具契约

- `mock_vuln_scanner.scan_target`:POST /tools/{scenario_id}/mock_vuln_scanner.scan_target body {"target": "...", "scan_type": "full"}

## AgentLoop 迭代痕迹

- v1.0(2026-07-25):基础扫描
- v1.1(2026-08-08):增加 open_ports 与暴露面分析

## 真实产品参考

- Nessus / Tenable.sc
- Qualys VMDR
- 绿盟 RSAS
- 启明星辰天镜
