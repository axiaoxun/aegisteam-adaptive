---
name: s11_ioc_enrichment
version: v1.2.0
owner_agent: a2_threat_detector
tag: stable
category: detection
---

# S11 IOC Enrichment — 威胁情报富化

## 作用

对接 mock_threat_intel 校验 IP/Hash/域名是否命中威胁情报,标注 Tor 出口、僵尸网络、APT 等。

## 输入

- `iocs`:`[{"type": "ip", "value": "185.220.101.45"}, ...]`

## 输出

```json
{
  "enriched_iocs": [
    {"type": "ip", "value": "185.220.101.45", "verdict": "malicious", "confidence": 0.95, "source": "MockTI", "tags": ["tor-exit-node", "brute-force", "ssh-attack"], "first_seen": "2024-01-12", "related_actors": ["APT-29-mock"]}
  ],
  "malicious_count": 3,
  "suspicious_count": 1,
  "unknown_count": 0
}
```

## 工具契约

- `mock_threat_intel.query_ioc`:POST /tools/{scenario_id}/mock_threat_intel.query_ioc body {"ioc_type": "ip", "value": "..."}
- `mock_threat_intel.lookup_malware`:POST /tools/{scenario_id}/mock_threat_intel.lookup_malware body {"family": "..."}

## 富化流程

1. 提取 IOCs(IP/Hash/域名/邮箱)
2. 批量查询 mock_threat_intel
3. 标注 verdict(malicious / suspicious / unknown / benign)
4. 关联到威胁行为者(APT/僵尸网络家族)

## AgentLoop 迭代痕迹

- v1.0(2026-07-22):基础 IP 查询
- v1.1(2026-08-02):增加 Hash/域名/邮箱
- v1.2(2026-08-12):增加威胁行为者关联

## 真实产品参考

- 微步在线 ThreatBook
- 奇安信威胁情报中心
- VirusTotal
- AlienVault OTX
- Recorded Future
