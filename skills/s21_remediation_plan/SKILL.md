---
name: s21_remediation_plan
version: v1.3.0
owner_agent: a5_incident_responder
tag: stable
category: response
---

# S21 Remediation Plan — 修复计划

## 作用

生成修复步骤、验证步骤、回滚点。

## 输入

- `root_cause`(来自 a2/a3/a4)
- `fix_recommendation`(来自 s16)
- `runbook_match`(来自 KB-Runbook)

## 输出

```json
{
  "remediation_plan": {
    "steps": [
      {"step": 1, "action": "阻断 5 个攻击 IP", "tool": "nacos.config", "risk": "L1", "auto_executable": true, "estimated_minutes": 2},
      {"step": 2, "action": "升级 OpenSSH 到 9.0p1", "tool": "ansible", "risk": "L2", "auto_executable": false, "estimated_minutes": 30, "approval_required": true},
      {"step": 3, "action": "强制密码重置 + MFA", "tool": "nacos.config", "risk": "L2", "auto_executable": false, "estimated_minutes": 60, "approval_required": true}
    ],
    "validation": [{"step": 4, "action": "验证 sshd 登录失败次数", "metric": "sshd_failed_logins_5min", "expected_decrease": 0.9}],
    "rollback_point": {"step": "after_step_2", "action": "如 5xx 升高 > 0.5%,回滚到 OpenSSH 7.4p1 + 临时禁公网 22"}
  }
}
```

## 工具契约

- `mock_notify.send_message`:通知审批角色

## AgentLoop 迭代痕迹

- v1.0(2026-08-02):基础修复步骤
- v1.1(2026-08-08):增加验证步骤
- v1.2(2026-08-12):增加回滚点
- v1.3(2026-08-15):增加 auto_executable 标记 + L1/L2 分类

## 真实产品参考

- NIST SP 800-61 修复流程
- SANS PICERL 模型
- AWS Systems Manager Change Manager
