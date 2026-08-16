# L0.5 人机协同层 × 8 Agent 交互协议 与 可观测性设计

> 本文件回答两个问题:
> 1. **8 个 Agent 如何与人机协同层(L0.5)交互?**
> 2. **这种交互如何满足"可观测"要求,如何差异化于 baseline?**
>
> 适用对象:评审答辩 / 复赛接入 / Web demo 10 区大屏实现。

---

## 0. 一句话总览

> **AegIsLoop 把"人机协同"从"通知邮件"升级为"协议级一等公民",L0.5 通过 3 通道(Event / Decision / Metric)被 8 Agent 主动调用,反过来又通过同一协议把 7 类角色的决策回写给 Agent,形成"可观测、可回放、可审计"的自适应闭环。**

baseline(只有 manager 串行)没有 L0.5 层,只有 Manager 接收创建指令;AegIsLoop 的差异化在于:
- **8 Agent 全部能主动调用 L0.5**(不是单向通知,是双向协议)
- **A6 把可观测作为核心职责**(baseline 没有质量治理 Agent)
- **L0.5 输出 3 类信号:实时 / 历史 / 交互**(baseline 仅 IM 通知)

---

## 1. L0.5 协议层设计:3 通道

L0.5 是 8 Agent 与人类/外部系统的**统一交互门面**,不暴露任何 MCP/内部 Agent 细节。3 通道如下:

### 1.1 通道 A:Event Stream(Pub/Sub,单向)

| 字段 | 说明 |
|---|---|
| 协议 | `l05.event.publish` |
| 方向 | Agent → L0.5(只发) |
| 传输 | WebSocket(Web 实时)/ Webhook(IM 异步) |
| 触发 | 每个 Agent 在 step 完成 / metric 变化 / 决策点出现时主动 publish |
| 用途 | 驱动 10 区大屏 + 3 并行事件流 + 审批工作流面板 |

事件类型(7 种):
- `task_received` / `task_completed` — A0
- `step_started` / `step_completed` / `step_failed` — A1-A5 业务 Worker
- `metric_published` / `metric_breach` — A6
- `decision_required` / `decision_received` — A0(转 L0.5)
- `postmortem_ready` / `rag_rewind` — A7
- `adaptive_feedback_triggered` — A6

### 1.2 通道 B:Decision Request(Request/Response,双向)

| 字段 | 说明 |
|---|---|
| 协议 | `l05.decision.request` / `l05.decision.response` |
| 方向 | Agent → L0.5 → 人类角色 → L0.5 → Agent |
| 传输 | WebSocket + 卡片(Web)/ 钉钉回调按钮(IM) |
| 触发 | A0 编排流遇到 L1-L3 风险动作时 |
| 用途 | 7 角色按风险等级路由审批 |

请求 schema(精简):
```yaml
request_id: req-uuid
incident_id: INC-2001
action: "block_ip | upgrade_openssh | ..."
risk_level: "L1 | L2 | L3"
approval_required: ["H1", "H2"]   # L3 加 "L3_business_owner"
deadline: "ISO 8601"
context: {...}
evidence_refs: ["ev-uuid-1", ...]
status: "pending | approved | rejected | expired"
decision_at: "ISO 8601"
decided_by: "user_id@role"
signature: "..."
```

### 1.3 通道 C:Metric Publish(Pub/Sub,单向)

| 字段 | 说明 |
|---|---|
| 协议 | `l05.metric.publish` |
| 方向 | A6 → L0.5(其他 Agent 也可发) |
| 传输 | WebSocket |
| 触发 | A6 实时监控 16 指标时 |
| 用途 | 驱动 16 指标仪表盘 + A6 专项 4 指标 + 漂移告警 |

metric schema:
```yaml
metric_id: m-uuid
incident_id: INC-2001
metric_name: "agent_output_quality_score"
value: 87
threshold: 70
status: "ok | warn | breach"
tags: { agent: "a2", skill: "s11_alert_fusion" }
timestamp: "ISO 8601"
```

---

## 2. 8 Agent × L0.5 交互矩阵

每个 Agent 在 3 通道上的具体职责:

| Agent | 通道 A(Event) | 通道 B(Decision) | 通道 C(Metric) | L0.5 路由 |
|---|---|---|---|---|
| **A0** TeamLeader | `task_received` / `task_completed` / `flow_selected` | `decision.required`(L1/L2/L3) | — | 派发到对应角色 |
| **A1** AssetManager | `step_completed(asset_profile)` | — | — | Web 资产面板 |
| **A2** ThreatDetector | `step_completed(incident_candidate)` | `decision.required(L1_block_ip)` | — | L1 自动(事后告知) |
| **A3** VulnVerifier | `step_completed(vuln_verification)` | — | — | Web 漏洞面板 |
| **A4** ComplianceGuard | `step_completed(compliance_report)` | `decision.required(L3_pia_signoff)` | — | 合规官 + DBA(角色) |
| **A5** IncidentResponder | `step_completed(remediation_plan)` | `decision.required(L2/L3_actions)` | — | 业务负责人 + 安全工程师 |
| **A6** QualitySteward | `metric_published` / `metric_breach` | `decision.required(human_review_adaptive)` | **全部 16 指标 + 4 专项** | 质量治理 dashboard 专区 |
| **A7** KnowledgeWeaver | `postmortem_ready` / `rag_rewind` | — | — | 复盘库 + 知识可视化 |

**关键观察**:
- **A0 主导通道 B**(L0.5 路由决策入口)
- **A6 主导通道 C**(可观测核心)
- **A1-A5 业务 Worker 主导通道 A**(step 进度事件)
- **A7 专攻通道 A 的后置事件**(postmortem + RAG rewind)

---

## 3. 可观测输出:3 类信号 × 5 个交付物

L0.5 通过统一协议把 8 Agent 的行为转化为**评审可看、运维可查、管理者可决策**的 3 类信号:

### 3.1 实时信号(Real-time)

| 交付物 | 通道来源 | 评审价值 |
|---|---|---|
| 10 区大屏 | A+C | 全局态势,3 并行事件流 + 8×6 Skill 矩阵 |
| 16 指标仪表盘 | C(A6 主导) | 4 类:流量/性能/成本/可靠性/协同/告警/A6 专项 |
| 审批工作流 | B | 7 角色按风险路由,卡死可重派 |
| Agent 节点健康度 | A(C6 publish) | 8 节点绿/黄/红,隔离故障 |
| 工具调用链 | A(E2E trace) | 跨 Worker 完整证据链 |

### 3.2 历史信号(Historical)

| 交付物 | 通道来源 | 评审价值 |
|---|---|---|
| 事故报告(完整证据链) | A+B | 评审可直接看 INC-2001/2002/2003 三份 |
| 复盘条目 | A(A7 publish) | KB-Postmortem 增量可视化 |
| 审计日志 | A+B | actor / action / timestamp / evidence_ref / signature(可签名验证) |
| 改进项跟踪 | A(A7 publish) | 责任角色 + 截止日期 + 完成度 |
| 自适应反馈历史 | C | A6 触发 → 反馈动作 → 影响 3 列表 |

### 3.3 交互信号(Interactive)

| 交付物 | 通道来源 | 评审价值 |
|---|---|---|
| 角色仪表盘(7 角色按需) | A+B | 合规官 / DBA / 业务负责人 视角不同 |
| 审批回放 | B | 一键重放 L2/L3 审批全过程,审计需要 |
| A6 自适应反馈时间线 | C | 每次触发的原因 / 动作 / 结果,展示"自适应"非空话 |
| RAG KB 健康历史曲线 | C(A6) | 5 KB recall/precision/freshness 趋势 |
| 团队效能分析 | A | 8 Agent 的 token 成本 / 重跑率 / 成功率 |

---

## 4. 端到端示例:Flow 1 INC-2001(告警流 · 22 步)

> 完整 22 步时间线,标出 L0.5 协议触发点。

| t | Agent | 动作 | L0.5 协议触发 |
|---|---|---|---|
| T+0s | A0 | 解析事故,选 Flow 1 | `event.task_received` + `event.flow_selected` |
| T+2s | A0 | 调度 A1 | — |
| T+3s | A1 | mock_cmdb.get_asset | — |
| T+4s | A1 | 资产画像完成 | `event.step_completed(asset_profile)` |
| T+5s | A0 | 调度 A2 | — |
| T+6s | A2 | mock_siem.search_events | — |
| T+7s | A2 | mock_threat_intel.query_ioc | — |
| T+8s | A2 | IOC 富化 1 个 Tor 出口 | `event.step_completed(incident_candidate)` |
| T+9s | A0 | 调度 A3 | — |
| T+11s | A3 | mock_vuln_scanner.scan_target | — |
| T+12s | A3 | CVE-2023-38408 验证 | `event.step_completed(vuln_verification)` |
| T+13s | A0 | 调度 A5 | — |
| T+14s | A5 | 生成响应计划 | — |
| T+15s | A5 | 阻断 5 IP(L1) | `decision.required(L1_block_ip, risk=L1)` → A0 串行确认 → 自动 |
| T+16s | A5 | 升级 OpenSSH(L2) | `decision.required(L2_upgrade_openssh)` → H1 卡片 + H2 卡片 |
| T+17s | A5 | 强制密码重置(L2) | `decision.required(L2_password_reset)` → H1 卡片 + H2 卡片 |
| T+18s | (人类) | H1 安全工程师 Approve | `decision.response(approved, H1)` |
| T+19s | (人类) | H2 业务负责人 Approve | `decision.response(approved, H2)` |
| T+20s | A5 | mock_notify.send_message 群发 | — |
| T+21s | A0 | 调度 A6 | — |
| T+22s | A6 | 16 指标计算 | `metric.publish × 16` |
| T+23s | A6 | 自适应反馈触发 1 次 | `event.adaptive_feedback_triggered(action=rerun, reason=score_low)` |
| T+24s | A0 | 调度 A7 | — |
| T+25s | A7 | 复盘报告 | `event.postmortem_ready(INC-2001)` |
| T+26s | A7 | RAG 知识回写 | `event.rag_rewind(KB-Postmortem, entry=...)` |
| T+27s | A0 | 汇总事故报告 | `event.task_completed` |
| T+28s | A0 | 报告推送 L0.5 | Web 报告卡 + 钉钉群同步 |

**L0.5 在 30 秒内累计接收**:
- ~15 个事件(A 通道)
- 3 个决策请求(B 通道,2 等待 + 1 自动)
- 16 个指标(C 通道)
- 1 个复盘事件(A 通道)

Web 大屏实时刷新,钉钉群收到报告卡,**3 个通道协同把"自动化"升级为"自适应 + 可观测"**。

---

## 5. 差异化对比 baseline

| 维度 | baseline(opsPilot) | AegIsLoop Adaptive |
|---|---|---|
| 人机协同 | 邮件通知 + 审批任务 | **协议级 3 通道**(Event/Decision/Metric) |
| 角色 | 单一 owner | **7 角色**(合规官/DBA/业务负责人/法务/安全工程师/SRE/资产管理员) |
| 可观测 | 无 dashboard,仅事故报告 | **10 区大屏 + 16 指标 + 3 事件流 + 审批回放** |
| 自适应 | 无 | **A6 QualitySteward 4 类反馈动作**(重跑/回滚/升级/重设) |
| 审计 | 工具调用日志 | **actor/action/timestamp/evidence/signature 5 元组** |
| 角色化路由 | 无 | **L1 告知 / L2 双签 / L3 三审** |
| 证据链 | Worker 内 context_bus | **每决策有 evidence_id,可跨 Worker 追溯** |
| 回滚 | 无 | **A6 drift > 20% 自动回滚到上一个 stable 版本** |

---

## 6. PPT/答辩引用建议

### 6.1 在 PPT 第 9 页(多 Agent 协同)增加

> "A0-A7 8 个 Agent 通过 L0.5 协议层(3 通道)与人机协同层交互,所有事件 / 决策 / 指标可观测、可回放、可审计"

### 6.2 在 PPT 第 13 页(工程落地)增加

> "L0.5 输出 3 类可观测信号:实时(10 区大屏+16 指标)/ 历史(事故报告+审计日志)/ 交互(角色仪表盘+审批回放)"

### 6.3 在 PPT 第 17 页(落地计划)增加

> "v1.1 重点:补全 L0.5 协议 schema + A6 dashboard 专项区;v1.2 复赛接入 Nacos Registry 后,L0.5 同时支持 Skill 灰度可视化"

### 6.4 答辩 Q&A 准备

| 问题 | 答案要点 |
|---|---|
| Q:为什么不直接用 IM webhook 推送? | 那是单向通知;我们用 3 通道双向协议,人类决策可结构化回写 |
| Q:L0.5 通道 B 死了怎么办? | 兜底走 IM 卡片按钮,callback 仍走协议;若 IM 也失败,A0 自动降级为 L0(只读) |
| Q:通道 A 事件太多会爆吗? | A6 自适应限流 + 摘要(每 5s 推一次,内部 detail 按需订阅) |
| Q:怎么证明"自适应"不是空话? | A6 时间线 + 4 类反馈动作 + 3 个场景都触发,见 demo 大屏 Zone 9 |

---

## 7. 后续工作

- [ ] 在 `at/agentteams.env.example` 增加 L0.5 endpoint
- [ ] 在 `web/` 增加 L0.5 Zone 9(A6 自适应健康度)+ Zone 10(8×8 覆盖矩阵)的代码
- [ ] 在 `at/create_agents_messages.md` Step 1-7 增加 L0.5 协议调用示例
- [ ] 在 mock 工具网关中增加 `mock_l05` MCP(供 Agent 调 L0.5 协议)

---

**关联文档**:
- [docs/01-agents-and-skills.md](01-agents-and-skills.md) — 8 Agent × 32 Skill 设计
- [docs/02-orchestration.md](02-orchestration.md) — 3 编排流 22+26+14 步
- [docs/04-infrastructure.md](04-infrastructure.md) — 5 RAG + 6 MCP + 16 指标
- [at/AGENTTEAMS_RUNBOOK.md](../at/AGENTTEAMS_RUNBOOK.md) — 端到端跑通手册
- [ppt/AegIsLoop-Adaptive-19pages.md](../ppt/AegIsLoop-Adaptive-19pages.md) — 19 页答辩 PPT
