---
name: s24_output_quality
version: v1.1.0
owner_agent: a6_quality_steward
tag: stable
category: quality
---

# S24 Output Quality — Worker 输出质量评估

## 作用

评估业务 Worker 输出质量(完整性/准确性/可追溯性),0-100 分,< 70 触发 A0 Leader 重跑。

## 输入

- `worker_output`(任意 Worker 的输出)
- `worker_name`
- `expected_output_contract`(预期契约)

## 输出

```json
{
  "quality_assessment": {
    "worker": "a2-threat-detector",
    "output_quality_score": 87,
    "completeness": 0.92,
    "accuracy": 0.85,
    "traceability": 0.84,
    "issues": [
      {"type": "missing_field", "field": "ioc_enrichment", "severity": "low"},
      {"type": "weak_evidence", "evidence_ref": "alert:ALERT-2001", "severity": "low"}
    ],
    "verdict": "pass"
  }
}
```

## 评分维度

| 维度 | 权重 | 评分规则 |
|---|---|---|
| 完整性 | 0.4 | 必填字段是否齐全(0-1) |
| 准确性 | 0.4 | 与 ground truth 或 mock 工具二次查询一致性(0-1) |
| 可追溯性 | 0.2 | evidence_ref 是否可被对应工具查到(0-1) |

总分 = 完整性 * 0.4 + 准确性 * 0.4 + 可追溯性 * 0.2

## 阈值

- >= 90:excellent
- 70-89:pass
- 50-69:warning(触发重跑)
- < 50:fail(触发升级人工)

## AgentLoop 迭代痕迹

- v1.0(2026-08-05):3 维评分
- v1.1(2026-08-13):增加 issues 列表与 verdict

## 真实产品参考

- Datadog APM 质量监控
- Arize AI / WhyLabs
- LangSmith / LangFuse
