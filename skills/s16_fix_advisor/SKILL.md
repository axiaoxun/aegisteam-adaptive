---
name: s16_fix_advisor
version: v1.0.0
owner_agent: a3_vuln_verifier
tag: stable
category: vulnerability
---

# S16 Fix Advisor — 修复建议

## 作用

基于 CVE 详情 + 资产画像 + 业务约束,推荐修复方案(补丁/升级/回滚/补偿控制)。

## 输入

- `cve_info`(来自 s14)
- `asset_profile`(来自 a1)
- `business_constraints`(运维窗口/可用性要求)

## 输出

```json
{
  "fix_recommendation": {
    "primary": {"type": "upgrade", "target_version": "OpenSSH 9.0p1", "estimated_downtime_min": 30, "risk": "L2"},
    "alternative": [{"type": "compensating_control", "detail": "在 WAF 阻断 22 端口外网访问", "risk": "L1"}],
    "rollback_plan": {"type": "config_rollback", "action": "回滚到 7.4p1 + 临时禁公网 22", "trigger": "升级失败 5xx > 0.5%"}
  }
}
```

## 工具契约

- 不直接调用工具,基于已有 CVE 数据生成建议

## AgentLoop 迭代痕迹

- v1.0(2026-07-28):基础推荐(升级/补丁/补偿控制)

## 真实产品参考

- Tenable.sc 修复优先级
- Qualys VMDR TruFix
- 微软 Security Update Guide
