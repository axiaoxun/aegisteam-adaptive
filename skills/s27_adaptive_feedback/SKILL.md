---
name: s27_adaptive_feedback
version: v1.2.0
owner_agent: a6_quality_steward
tag: stable
category: quality
---

# S27 Adaptive Feedback — 自适应反馈

## 作用

触发自适应反馈动作(重跑 / 灰度回滚 / 升级人工专家 / 重设编排流),是 AegisTeam "Adaptive" 的核心机制。

## 输入

- `quality_assessment`(来自 s24)
- `drift_detection`(来自 s25)
- `rag_health`(来自 s26)
- `evidence_chain_integrity`(来自 a0/s03)

## 输出

```json
{
  "adaptive_feedback": {
    "triggered": true,
    "action": "rollback",
    "target": "s09_alert_fusion",
    "from_version": "v1.2.0",
    "to_version": "v1.0.0",
    "reason": "drift_score 0.18 > 0.15, 行为漂移告警",
    "executed_at": "2026-08-16T09:15:00+08:00",
    "expected_impact": "恢复 v1.0 行为基线,减少误报"
  }
}
```

## 4 类反馈动作

| 动作 | 触发条件 | 实施 |
|---|---|---|
| `rerun` | output_quality_score < 70 | A0 Leader 重跑该 Worker |
| `rollback` | drift_score > 0.15 或 rule_drift > 0.20 | 回滚 Skill 到上一个 stable 版本 |
| `escalate` | 连续 3 次 rerun 仍 fail | 通知人工专家接管 |
| `reset` | evidence_chain_integrity < 70 | 重设编排流(回到起点) |

## 反馈记录

- 所有 feedback 写入 `adaptive_feedback_triggered_total` 指标
- 反馈历史用于 A7 KnowledgeWeaver 复盘 + 改进项

## AgentLoop 迭代痕迹

- v1.0(2026-08-08):rerun + rollback
- v1.1(2026-08-12):+ escalate + reset
- v1.2(2026-08-15):与 A7 联动,反馈转改进项

## 真实产品参考

- Argo Rollouts 自动回滚
- Spinnaker 灰度发布
- LaunchDarkly Feature Flag 回滚
- AWS CodeDeploy 自动回滚
