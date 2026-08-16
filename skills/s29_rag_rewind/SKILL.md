---
name: s29_rag_rewind
version: v1.0.0
owner_agent: a7_knowledge_weaver
tag: stable
category: knowledge
---

# S29 RAG Rewind — 知识回写

## 作用

把复盘条目回写到 KB-Postmortem / KB-Runbook,让本次事件沉淀为组织记忆,供下次同类事件直接复用。

## 输入

- `postmortem_entry`:已归档的复盘条目(s28 输出)
- `target_kb`:回写目标(`KB-Postmortem` / `KB-Runbook`)
- `runbook_diff`:若涉及流程变更,附 Runbook 更新内容(关联 s32)

## 输出

```json
{
  "written": [
    {"kb": "KB-Postmortem", "entry_id": "PM-INC-2001", "status": "committed"},
    {"kb": "KB-Runbook", "runbook_id": "RB-2026-0042", "status": "draft"}
  ],
  "vectorized": true,
  "rag_health_recheck": "pending"
}
```

## 工具契约

- `mock_notify.send_message`:知识回写完成通知 A6(触发 RAG 健康重评)

## 安全约束

- L0 草稿回写;L1 自动入草稿库;L2 正式版需 A7 + 业务负责人(角色)双签;L3 涉合规流程变更必须法务(角色)审批
- 回写后必须触发 A6 的 `s26_rag_health` 重评

## AgentLoop 迭代痕迹

- v1.0(2026-08-16):初版,与 A6 RAG 健康度联动

## 真实产品参考

- Elasticsearch ingest pipeline
- Notion/Confluence 知识库自动归档
- 阿里云百炼知识库写入 API
