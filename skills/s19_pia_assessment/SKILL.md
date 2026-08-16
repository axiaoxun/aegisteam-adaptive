---
name: s19_pia_assessment
version: v1.0.0
owner_agent: a4_compliance_guard
tag: stable
category: compliance
---

# S19 PIA Assessment — 个人信息保护影响评估

## 作用

生成个人信息保护影响评估(PIA)模板,覆盖 GB/T 39335-2020 标准。

## 输入

- `asset_id`
- `data_inventory`(处理的个人信息类型)
- `processing_purposes`(处理目的)

## 输出

```json
{
  "pia_template": {
    "title": "AI 智能问诊助手 PIA 评估",
    "sections": [
      {"name": "评估基本信息", "fields": ["处理者名称", "联系方式", "评估日期"]},
      {"name": "个人信息处理描述", "fields": ["处理目的", "处理方式", "个人信息类型", "敏感度", "数量", "保存期限"]},
      {"name": "合法性基础", "fields": ["同意/合同/法定职责/正当利益"]},
      {"name": "风险评估", "fields": ["对个人权益的影响", "安全措施", "风险等级"]},
      {"name": "应对措施", "fields": ["技术措施", "管理措施", "应急预案"]}
    ],
    "estimated_completion_hours": 8
  }
}
```

## 评估依据

- GB/T 39335-2020《信息安全技术 个人信息安全规范》
- 个保法第 55 条
- 信安标委 PIA 编制指南

## AgentLoop 迭代痕迹

- v1.0(2026-07-31):PIA 模板生成,覆盖 5 大章节

## 真实产品参考

- CNIL(法国 CNIL)PIA 工具
- ICO(英国 ICO)PIA 模板
- 全国信安标委 PIA 编制指南
