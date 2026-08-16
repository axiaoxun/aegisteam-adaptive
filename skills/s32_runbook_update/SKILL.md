---
name: s32_runbook_update
version: v1.0.0
owner_agent: a7_knowledge_weaver
tag: stable
category: knowledge
---

# S32 Runbook Update — Runbook 生成/更新

## 作用

基于复盘报告生成或更新 KB-Runbook 中的标准化处置流程,让"这一次的经验"变成"下一次的预案"。

## 输入

- `postmortem`:复盘报告(s28 输出)
- `historical_runbooks`:历史 Runbook(检索 KB-Runbook)
- `expert_annotations`:专家标注(可选)
- `process_change_notice`:流程变更通知(可选)

## 输出

```json
{
  "runbook": {
    "runbook_id": "RB-2026-0042",
    "scenario": "SSH 暴力破解",
    "steps": [
      {"actor": "a2", "action": "识别爆破源 IP", "tool": "mock_siem.search_events"},
      {"actor": "a5", "action": "阻断源 IP(L1)", "tool": "mock_notify.send_message"},
      {"actor": "a5", "action": "升级 OpenSSH(L2 审批)", "tool": "mock_notify.send_message"}
    ],
    "required_approval": "L1/L2",
    "status": "draft"
  },
  "diff_summary": "新增 SSH 爆破处置 Runbook,预计同类事件 MTTR 缩短 15min"
}
```

## 工具契约

- `mock_notify.send_message`:Runbook 变更通知 A5 应急响应 Agent 与 A0 Leader

## 安全约束

- L0 草稿生成;L1 自动入草稿库;L2 正式版需 A7 + 业务负责人(角色)双签;L3 涉及合规/监管流程的 Runbook 变更必须法务(角色)审批
- 每个步骤必须含 actor / action / tool / rollback,禁止模糊步骤

## AgentLoop 迭代痕迹

- v1.0(2026-08-16):初版,承接旧方案 S21 Runbook 生成能力

## 真实产品参考

- NIST SP 800-61 处置流程
- CIS Critical Security Controls
- AWS Systems Manager Automation Runbook
