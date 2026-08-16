---
name: s17_compliance_lookup
version: v1.2.0
owner_agent: a4_compliance_guard
tag: stable
category: compliance
---

# S17 Compliance Lookup — 法规检索

## 作用

通过 RAG(KB-Compliance 1,800 + KB-SupplyChain 5,000)检索适用法规,匹配通报项/新法规条款到适用资产。

## 输入

- `query`:`"生成式 AI 内容审核"` 或 `"数据出境安全评估"`
- `asset_compliance_scope`(资产已配置的合规范围,如 `["等保2.0-三级", "个保法"]`)

## 输出

```json
{
  "matched_regulations": [
    {
      "regulation_id": "REG-2026-GENAI-001",
      "name": "生成式 AI 服务管理暂行办法(2026 修订版)",
      "article": "第14条",
      "requirement": "内容安全标识/过滤",
      "matched_assets": ["ai-app-consult", "ai-app-medreport", "ai-app-edu"],
      "relevance_score": 0.93
    }
  ],
  "rag_health_at_query": 0.91
}
```

## RAG 检索策略

- Embedding 模型:Qwen-Text-Embedding-v3
- 向量库:Milvus / ChromaDB
- 检索方式:Hybrid(BM25 + 向量),top-k=10
- 重排序:Cross-Encoder,top-k=5

## AgentLoop 迭代痕迹

- v1.0(2026-07-29):基础法规检索
- v1.1(2026-08-05):Hybrid 检索
- v1.2(2026-08-15):增加 RAG 健康度反馈 + 重排序

## 真实产品参考

- 阿里云合规管理平台
- 等保 2.0 测评模板库
- 工信部网络安全法释义
- 全国信息安全标准化技术委员会(TC260)标准库
