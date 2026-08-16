---
name: s18_regulation_diff
version: v1.1.0
owner_agent: a4_compliance_guard
tag: stable
category: compliance
---

# S18 Regulation Diff — 新法规条款解析

## 作用

解析新法规要求(条款 → 控制项 → 适用系统),生成差距分析。

## 输入

- `regulation_id`(来自 s17)
- `asset_inventory`(来自 a1)

## 输出

```json
{
  "regulation_parsed": {
    "name": "生成式 AI 服务管理暂行办法(2026 修订版)",
    "effective_date": "2026-09-01",
    "articles": [
      {"article": "第7条", "requirement": "深度合成服务算法备案", "control_id": "CTRL-GENAI-001", "applicable_assets": ["ai-app-consult", "ai-app-medreport"], "compliance_status": "missing", "gap_severity": "HIGH"}
    ]
  },
  "total_articles": 5,
  "compliant": 0,
  "missing": 5,
  "summary": "5 项条款全部缺失,需全面整改"
}
```

## 控制项解析规则

- 条款 → 控制项 ID(`CTRL-{REG}-{NNN}`)
- 适用系统类型识别(算法/数据/内容/认证/日志)
- 现状 vs 法规要求对比

## AgentLoop 迭代痕迹

- v1.0(2026-07-30):基础条款解析
- v1.1(2026-08-08):增加控制项 ID 与适用系统识别

## 真实产品参考

- ISO 27001 控制项映射
- NIST 800-53 控制基线
- SCF(Secure Controls Framework)
