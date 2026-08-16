---
name: s25_drift_detection
version: v1.1.0
owner_agent: a6_quality_steward
tag: stable
category: quality
---

# S25 Drift Detection — Skill 偏差与规则漂移检测

## 作用

对比 Skill v1.0 行为基线,识别当前输出的偏差与漂移(> 15% 触发回滚)。

## 输入

- `skill_name`
- `current_output`
- `baseline`(v1.0 行为基线,存储在 Nacos Registry)

## 输出

```json
{
  "drift_detection": {
    "skill": "s09_alert_fusion",
    "drift_detected": true,
    "drift_type": "behavior_drift",
    "drift_score": 0.18,
    "drift_threshold": 0.15,
    "deviated_dimensions": ["alert_fusion_logic"],
    "recommendation": "rollback_to_v1.0_or_update_baseline"
  }
}
```

## 漂移类型

- **behavior_drift**:Skill 输出与 v1.0 行为不一致
- **input_drift**:输入分布变化(数据漂移)
- **concept_drift**:概念漂移(标注标准变化)

## 检测方法

- 输出嵌入向量 cosine 相似度
- 关键字段(severity/decision/action)分布对比
- 规则触发频率对比

## AgentLoop 迭代痕迹

- v1.0(2026-08-06):基础行为漂移检测
- v1.1(2026-08-15):增加 input/concept drift + 嵌入向量相似度

## 真实产品参考

- Arize AI Drift Detection
- WhyLabs 数据漂移监控
- Fiddler AI
- Evidently AI
