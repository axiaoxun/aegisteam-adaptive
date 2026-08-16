---
name: s30_lesson_extraction
version: v1.0.0
owner_agent: a7_knowledge_weaver
tag: stable
category: knowledge
---

# S30 Lesson Extraction — 教训提取

## 作用

从事故中提取可迁移的教训(What went well / What went wrong / What to change),转化为组织级最佳实践。

## 输入

- `postmortem`:复盘报告(s28 输出)
- `historical_patterns`:历史相似事件教训(检索 KB-Postmortem)
- `skill_feedback`:A6 自适应反馈记录(可选)

## 输出

```json
{
  "lessons": [
    {"type": "control_gap", "lesson": "WAF 未覆盖非标端口,需纳入配置基线", "severity": "high"},
    {"type": "best_practice", "lesson": "SSH 强口令 + 密钥认证 + fail2ban 三层防护", "severity": "medium"}
  ],
  "linked_runbook": "RB-2026-0042",
  "training_tags": ["ssh-hardening", "waf-baseline"]
}
```

## 工具契约

- `mock_notify.send_message`:教训同步 A6(纳入自适应反馈输入)与培训岗

## 安全约束

- L0 提取只读;L1 自动打标;L2 教训形成制度变更需审批;L3 对外分享必须脱敏 + 法务(角色)审批
- 教训必须关联到具体 evidence_ref,不可空泛

## AgentLoop 迭代痕迹

- v1.0(2026-08-16):初版,支持 3 类教训分型

## 真实产品参考

- NASA Lessons Learned 库
- ITIL 持续改进管理
- 事故复盘 5 Whys / Ishikawa 鱼骨图
