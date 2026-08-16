---
name: s26_rag_health
version: v1.0.0
owner_agent: a6_quality_steward
tag: stable
category: quality
---

# S26 RAG Health — RAG 知识库健康监控

## 作用

监控 RAG 知识库健康(召回率/准确率/时效性),< 80 触发知识补全。

## 输入

- `rag_query_log`(查询日志,最近 7 天)
- `rag_evaluation_set`(评测集,定期更新)

## 输出

```json
{
  "rag_health": {
    "score": 0.86,
    "recall_at_5": 0.91,
    "precision_at_5": 0.83,
    "freshness_score": 0.84,
    "failed_retrievals": 23,
    "kb_breakdown": {
      "KB-Compliance": 0.91,
      "KB-Vuln": 0.88,
      "KB-Runbook": 0.82,
      "KB-Postmortem": 0.79,
      "KB-SupplyChain": 0.85
    },
    "needs_kb_update": ["KB-Postmortem"]
  }
}
```

## 健康维度

| 维度 | 目标值 | 告警阈值 |
|---|---|---|
| Recall@5 | ≥ 0.85 | < 0.75 触发 |
| Precision@5 | ≥ 0.80 | < 0.70 触发 |
| Freshness | 知识更新 < 7 天 | > 30 天未更新 |
| Failed retrievals | < 5% | > 10% 触发 |

## AgentLoop 迭代痕迹

- v1.0(2026-08-07):基础 recall/precision 监控
- v1.0.1(2026-08-15):增加 freshness 与 per-KB 细分

## 真实产品参考

- Arize AI RAG 评估
- LangSmith RAG 监控
- RAGAS(RAG 评估框架)
- TruLens
