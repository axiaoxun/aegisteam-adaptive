---
name: s02_worker_dispatch
version: v1.2.0
owner_agent: a0_leader
tag: stable
category: orchestration
---

# S02 Worker Dispatch — Worker 调度

## 作用

按编排流顺序调度业务 Worker,维护依赖图,最多 3 个 Worker 并行,串行门控由 A6 QualitySteward 维护。

## 输入

- `flow_type`:编排流 ID
- `incident_id`
- `worker_dependency_graph`:依赖图
- `previous_step_outputs`:上一步输出(JSON)

## 输出

```json
{
  "next_workers": [{"name": "a1-asset-manager", "task": "get_asset", "params": {}}],
  "parallel_group": 1,
  "estimated_remaining_steps": 5
}
```

## 调度策略

- **并行度上限**:3
- **串行门控**:每步输出经 A6 质量门(>= 70)才进入下一步
- **重试策略**:质量门不通过重跑 1 次;仍不通过则升级 A6 自适应反馈(回滚 Skill)
- **依赖图示例**(Flow 1):A1 资产画像 → (A2 告警 ∥ A3 漏洞) → A5 响应 → A6 治理

## AgentLoop 迭代痕迹

- v1.0(2026-07-13):简单串行
- v1.1(2026-07-25):增加并行(最多 3 个)
- v1.2(2026-08-05):增加 A6 串行门控
- v1.2.1(2026-08-15):修复重试死循环(原因为重试计数未跨 Worker 共享)

## 真实产品参考

- AWS Step Functions 状态机
- Apache Airflow DAG
- Temporal 工作流引擎
