---
name: s15_evidence_integrity
version: v1.0.0
owner_agent: a3_vuln_verifier
tag: stable
category: vulnerability
---

# S15 Evidence Integrity — 证据链完整性

## 作用

校验漏洞-资产-版本-POC 四元组完整性,确保每个漏洞都有完整证据链。

## 输入

- `vuln_verification`(来自 s14)
- `sbom_components`(来自 s06)
- `scan_result`(来自 s13)

## 输出

```json
{
  "completeness_check": {
    "asset_present": true,
    "version_matched": true,
    "poc_available": true,
    "fix_advisory_present": true
  },
  "missing_evidence": [],
  "integrity_score": 0.95,
  "verdict": "complete"
}
```

## 完整性规则

- 必须有受影响资产
- 必须匹配 SBOM 中的版本
- 必须有 POC 链接或 exploit_available 标记
- 必须有修复版本

不完整时,输出 missing_evidence 列表与 verdict="incomplete"。

## AgentLoop 迭代痕迹

- v1.0(2026-07-27):基础四元组校验

## 真实产品参考

- OWASP Vulnerability Management Guide
- NIST SP 800-40 Rev 4
- CIS Critical Security Controls #7
