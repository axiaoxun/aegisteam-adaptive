---
name: s09_alert_fusion
version: v1.2.0
owner_agent: a2_threat_detector
tag: stable
category: detection
---

# S09 Alert Fusion — 告警融合

## 作用

按服务/时间窗口/症状聚合告警,生成事故候选。5 分钟滑动窗口,合并同一攻击源的多次告警。

## 输入

- `time_window`:默认最近 5 分钟
- `service_filter`(可选):按服务过滤
- `severity_threshold`(可选):最低严重程度

## 输出

```json
{
  "incident_candidates": [
    {
      "candidate_id": "INC-2001-fusion-1",
      "severity": "CRITICAL",
      "symptom_summary": "5 个独立 IP 217 次 SSH 失败登录",
      "source_ips": ["185.220.101.45", "185.220.102.7", "45.142.214.89", "..."],
      "time_window": {"start": "2026-08-16T09:00:00+08:00", "end": "2026-08-16T09:05:00+08:00"},
      "evidence_refs": ["alert:SSH_BRUTE_FORCE_5MIN", "event:EVT-20260816-0901-001"]
    }
  ],
  "merged_count": 217,
  "original_alert_count": 47
}
```

## 聚合规则

- 同源 IP 5 分钟内 ≥ 10 次失败 → 聚合为 1 个候选
- 同服务 ≥ 3 个不同告警 → 聚合为 1 个候选
- 同症状(如 SSH 暴力破解)→ 合并

## 工具契约

- `mock_siem.search_events`:POST /tools/{scenario_id}/mock_siem.search_events body {"query": null, "time_range": {...}}

## AgentLoop 迭代痕迹

- v1.0(2026-07-20):单告警解析
- v1.1(2026-07-30):时间窗口聚合
- v1.2(2026-08-08):同源 IP 合并规则

## 真实产品参考

- Splunk ES 事件关联规则
- IBM QRadar 事件关联引擎
- Elastic Security 检测规则
