---
name: s31_improvement_tracking
version: v1.0.0
owner_agent: a7_knowledge_weaver
tag: stable
category: knowledge
---

# S31 Improvement Tracking — 改进项跟踪

## 作用

跟踪复盘产出的改进项(责任角色 + 截止日期 + 完成度),与 A6 自适应反馈联动,形成"事故 → 改进 → 验证"闭环。

## 输入

- `improvement_items`:复盘报告中的改进项(s28 输出)
- `adaptive_feedback`:A6 自适应反馈工单(s27 输出)
- `assignment_queue`:A0 任务队列

## 输出

```json
{
  "improvements": [
    {"id": "IMP-2001-01", "action": "升级 OpenSSH", "owner_role": "安全工程师(角色)", "deadline": "2026-08-23", "status": "in_progress", "blocked_by": []},
    {"id": "IMP-2001-02", "action": "收紧 WAF 22 端口策略", "owner_role": "业务负责人(角色)", "deadline": "2026-08-20", "status": "pending", "blocked_by": ["IMP-2001-01"]}
  ],
  "completion_rate": 0.5,
  "a6_feedback_linked": true
}
```

## 工具契约

- `mock_notify.send_message`:改进项逾期升级通知 A0 / 对应角色

## 安全约束

- L0 状态查询;L1 自动关闭明显无效任务(留痕);L2 争议任务关闭需安全工程师(角色)确认;L3 重大事件关闭必须复盘完成 + 签字
- 每项改进必须落到具体角色 + 截止日期,禁止"无主"改进项

## AgentLoop 迭代痕迹

- v1.0(2026-08-16):初版,与 A6 自适应反馈工单双向引用

## 真实产品参考

- Jira / Linear 改进项跟踪
- PagerDuty Incident Actions
- OKR 复盘闭环
