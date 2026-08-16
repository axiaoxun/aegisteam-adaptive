---
name: s28_postmortem_gen
version: v1.0.0
owner_agent: a7_knowledge_weaver
tag: stable
category: knowledge
---

# S28 Postmortem Gen — 复盘报告生成

## 作用

基于 A6 证据包 + A2 事件时间轴 + A5 响应记录,生成 Blameless Postmortem 复盘报告,并把案例打标归档。

## 输入

- `evidence_package`:A6 固化的证据包(证据链 + Hash)
- `event_timeline`:A2 事件时间轴
- `response_records`:A5 响应执行记录
- `historical_postmortems`:历史复盘(可选,对齐模板)

## 输出

```json
{
  "postmortem": {
    "incident_id": "INC-2001",
    "timeline": "09:00 告警 → 09:15 定级 → 10:20 审批 → 11:00 复测通过",
    "root_cause": "Higress WAF 错误放行 22 端口 + OpenSSH 7.4p1 存在 CVE-2023-38408",
    "impact": "1 台生产资产暴露,5 个外部 IP 尝试暴力破解",
    "improvement_items": ["升级 OpenSSH", "收紧 WAF 22 端口策略"]
  },
  "case_tags": ["brute_force", "ssh", "tor"],
  "archived": true
}
```

## 工具契约

- `mock_notify.send_message`:复盘报告送达安全工程师(角色)

## 安全约束

- L0 草稿生成;L1 自动归档案例库(脱敏后);L2 含客户/员工真实信息需脱敏审批;L3 对外发布必须法务(角色)/管理层审批
- 严禁未经脱敏对外发布复盘案例

## AgentLoop 迭代痕迹

- v1.0(2026-08-16):初版,基于 Blameless Postmortem 模板

## 真实产品参考

- Google SRE Blameless Postmortem
- PagerDuty Postmortem 模板
- NIST SP 800-61 事故复盘
