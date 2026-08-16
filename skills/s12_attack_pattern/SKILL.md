---
name: s12_attack_pattern
version: v1.3.0
owner_agent: a2_threat_detector
tag: stable
category: detection
---

# S12 Attack Pattern — 攻击模式识别

## 作用

识别 8 类攻击模式(暴力破解 / 数据出境 / AI 越权 / 凭证填充 / 0day / 供应链 / Web 攻击 / 横向移动),输出 MITRE ATT&CK TTP 编号。

## 输入

- `incident_candidate`(来自 s09)
- `enriched_iocs`(来自 s11)
- `events`(来自 mock_siem)

## 输出

```json
{
  "attack_pattern": {
    "primary": "brute_force",
    "mitre_id": "T1110.001",
    "name": "Password Guessing",
    "confidence": 0.92,
    "ttps": ["T1110.001 - Password Guessing", "T1078 - Valid Accounts"]
  },
  "secondary_patterns": ["credential_stuffing"],
  "kill_chain_phase": "Credential Access"
}
```

## 8 类攻击模式

| 模式 | MITRE TTP | 关键特征 |
|---|---|---|
| brute_force | T1110.001 | 同源 IP 多次失败登录 |
| data_exfiltration | T1567 | 大批量敏感数据查询/出境 |
| ai_prompt_injection | T1059.006 | AI 输出异常/越权 |
| credential_stuffing | T1110.004 | 已知账号密码撞库 |
| zero_day | T1190 | 未公开 CVE 触发告警 |
| supply_chain | T1195 | SBOM 新增可疑组件 |
| web_attack | T1190 | SQL 注入/XSS/SSRF |
| lateral_movement | T1021 | 内网横向移动 |

## AgentLoop 迭代痕迹

- v1.0(2026-07-23):支持 3 类(暴力破解/数据出境/Web 攻击)
- v1.1(2026-08-05):支持 5 类(+凭证填充/0day)
- v1.2(2026-08-12):支持 8 类(全)
- v1.3(2026-08-15):增加 MITRE ATT&CK TTP 编号关联

## 真实产品参考

- MITRE ATT&CK Framework
- Splunk ES ATT&CK 映射
- Elastic Security ATT&CK
- Palo Alto Cortex XDR ATT&CK
