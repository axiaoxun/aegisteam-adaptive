# AegisTeam Adaptive — 18 页 PPT 草稿

> 基于 `docs/03-presentation-materials.md` 大纲落到 18 页。Markdown 草稿,后续可贴入 Keynote / PPT 排版。
> 每页右上角标注对应评审维度。

---

## 第 1 页:封面

**标题**:AegisTeam Adaptive — 自适应盾牌防御团队

**副标题**:8 个岗位化 Agent + 1 个灵活的人机协同层 = 1 支自适应增强的安全运营团队

**参赛赛道**:GOAI 2026 赛道一:新智基座 | Agent Infra — Cybersecurity + AI

**团队**:AegisTeam Adaptive(3 人小团队,10 年安全运营 + 2 年大模型经验)

**日期**:2026-08-16

**评审维度**:🌟 开场

---

## 第 2 页:痛点 — 中小单位安全运营的 4 大困境

**评审维度**:场景价值(25%)

| 维度 | 现状 | 期望 |
|---|---|---|
| 预算 | 80% 中小单位年安全预算 < 50 万 | 50 人 SOC(年 1500 万+) |
| 人员 | 专职安全 < 3 人 | 50 人 SOC |
| 误报率 | 告警误报率 > 95% | < 30% |
| 响应时间 | 人工响应 4 小时 | 监管要求 30 分钟 |
| 合规要求 | 等保 2.0 / 数据安全法 / 个保法 / 生成式 AI 办法 | 全覆盖 |

**结论**:中小单位雇不起 50 人 SOC,但又要应对日益复杂的合规与攻击 → 需要**虚拟 SOC 团队**。

---

## 第 3 页:方案总览 — 8+1 公式

**评审维度**:场景价值(25%)+ 多 Agent 协同(25%)

**核心公式**:

```
8 个岗位化 Agent(对应 SOC 八大岗)
+ 1 个灵活的人机协同层(Web 平台 / IM 通道)
= 1 支自适应增强的安全运营团队
```

**8 岗位**:Leader / 资产 / 告警 / 漏洞 / 合规 / 响应 / 质量治理 / 复盘

**1 人机协同层**:
- Web 平台模式:AegisConsole 多角色协同
- IM 通道模式:钉钉/企微/飞书/SMTP 推送(无平台时兜底)

**1 自适应增强**:A6 QualitySteward 实时质量治理,让系统**自适应**

---

## 第 4 页:5 大评审维度自检表

**评审维度**:全维度自检

| 维度 | 权重 | 关键指标 | 自检 |
|---|---|---|---|
| 场景价值 | 25% | 8+1 公式 / 痛点量化 / 监管对齐 | ✅ |
| 多 Agent 协同 | 25% | 3 编排流 / 6-7 Agent / AgentLoop / H1+H2 | ✅ |
| Skill 工程 | 25% | 27 个 Skill / 9 大类 / Skill.md 模板 / 迭代痕迹 | ✅ |
| 工程落地 | 20% | 5 RAG(294,440) / 6 MCP / 16 指标 / 10 区大屏 | ✅ |
| 开源 | 5% | Apache 2.0 / Mock 剧本 / 部署文档 | ✅ |

**总评**:5 维度全覆盖,核心创新在 A6 QualitySteward 让"Adaptive"名副其实。

---

## 第 5 页:5 层架构图

**评审维度**:多 Agent 协同(25%)+ 工程落地(20%)

```
┌────────────────────────────────────────────┐
│ L1  Team 编排层(AgentTeams / hiclaw)      │
│   TeamLeader aegisteam-leader (A0)         │
└────────────────────┬───────────────────────┘
                     ▼
┌────────────────────────────────────────────┐
│ L2  Agent 层(8 岗位化)                    │
│   A0 A1 A2 A3 A4 A5 A6 A7                  │
└────────────────────┬───────────────────────┘
                     ▼
┌────────────────────────────────────────────┐
│ L3  Skill 层(27 Skill, 9 大类)            │
└────────────────────┬───────────────────────┘
                     ▼
┌────────────────────────────────────────────┐
│ L4  工具层(6 MCP + 5 RAG = 294,440 条)     │
└────────────────────┬───────────────────────┘
                     ▼
┌────────────────────────────────────────────┐
│ L0.5 人机协同层(Web/IM 双模式)             │
└────────────────────┬───────────────────────┘
                     ▼
┌────────────────────────────────────────────┐
│ L5  可观测层(16 指标 + 10 区大屏)          │
└────────────────────────────────────────────┘
```

---

## 第 6 页:8 Agent 拓扑

**评审维度**:多 Agent 协同(25%)+ Skill 工程(25%)

```
                ┌──────────────────┐
                │  A0 Leader       │
                │  aegisteam-leader│
                │  (TeamLeader)    │
                └────┬─┬─┬─┬─┬─┬─┬─┘
                     │ │ │ │ │ │ │
        ┌────────────┘ │ │ │ │ │ └────────────┐
        ▼              ▼ ▼ ▼ ▼ ▼              ▼
      A1 资产       A2 A3 A4 A5 A6 A7
                  告警 漏洞 合规 响应 质量 复盘
                  
A6 QualitySteward = Adaptive 引擎(7 大职责)
A7 KnowledgeWeaver = 复盘 + 知识回写
```

**8 Agent × 27 Skill 矩阵**(摘要):
- A0: S01-S04(4)
- A1: S05-S08(4)
- A2: S09-S12(4)
- A3: S13-S16(4)
- A4: S17-S20(4)
- A5: S21-S23(3)
- A6: S24-S27(4,独占)
- A7: 与 A6 联动

---

## 第 7 页:27 Skill 矩阵(精选 12 个)

**评审维度**:Skill 工程(25%)

| Agent | Skill | 关键能力 | 真实产品参考 |
|---|---|---|---|
| A0 | S01 incident_routing | 事故路由(告警/通报/法规) | PagerDuty / OpsGenie |
| A0 | S04 approval_gate | H1+H2 双审批关口 | ServiceNow GRC |
| A1 | S07 vuln_to_asset | 漏洞-资产关联(EPSS+KEV) | Tenable VPR |
| A2 | S09 alert_fusion | 5 分钟滑动窗口聚合 | Splunk ES |
| A2 | S11 ioc_enrichment | 威胁情报富化 | 微步/奇安信 TI |
| A3 | S14 cve_lookup | CVE 5.0 + EPSS + KEV | NVD/EPSS/CISA |
| A4 | S17 compliance_lookup | 法规 RAG 检索(Hybrid) | 阿里云合规 |
| A4 | S19 pia_assessment | PIA 模板生成 | CNIL PIA |
| A5 | S21 remediation_plan | 修复+验证+回滚 | NIST 800-61 |
| A5 | S22 risk_guard | L0-L3 风险分级 | ISO 27005 |
| **A6** | **S24 output_quality** | **0-100 分质量门** | **Arize / LangSmith** |
| **A6** | **S27 adaptive_feedback** | **重跑/回滚/升级/重设** | **Argo Rollouts** |

每个 Skill 都有 AgentLoop 迭代痕迹(v1.0 → v1.3+)

---

## 第 8 页:Nacos AI Registry 全链路 — Part 1

**评审维度**:工程落地(20%)+ 多 Agent 协同(25%)

**初赛(内联) → 复赛(Registry)的演进**:

```
┌──── 初赛(内联)────┐    ┌──── 复赛(Nacos Registry)────┐
│ at/create_agents_ │    │                              │
│   messages.md     │    │  Nacos AI Registry          │
│   内联 Prompt/    │──→ │  ┌────────────────────┐    │
│   Skill/AgentSpec │    │  │ Skill Registry    │    │
└───────────────────┘    │  │  - s01..s27        │    │
                        │  │  - version v1.0..v1.3 │
                        │  │  - tag: stable/rc  │    │
                        │  └─────────┬──────────┘    │
                        │            │                │
                        │            ▼                │
                        │   Prompt Registry            │
                        │   - 业务 Worker Prompt       │
                        │   - A0 Leader Prompt         │
                        │   - 评审模板                 │
                        │   (Phase 2 引入)             │
                        │            │                │
                        │            ▼                │
                        │   AgentSpec Registry         │
                        │   - 8 业务 Agent 规格         │
                        │   - 团队规格                 │
                        │   (Phase 3 引入)             │
                        │            │                │
                        │            ▼                │
                        │   Nacos 配置中心             │
                        │   - LLM API Key             │
                        │   - MCP Endpoint           │
                        │   - 灰度策略               │
                        └─────────────────────────────┘
```

**关键设计**:Worker 不再内联所有内容,改为按需从 Registry 拉取,版本化 + 标签管理。

---

## 第 9 页:Nacos AI Registry 全链路 — Part 2

**评审维度**:工程落地(20%)

**"内联 → 注册 → 灰度 → 加载 → 调用 → 回滚"全链路**:

```
[1] 内联(初赛)
  at/create_agents_messages.md
  ↓ 复赛切换
[2] 注册到 Nacos
  nacos-cli skill push s09_alert_fusion --version v1.2.0 --tag candidate
  ↓ A6 检测到 Skill 新版本
[3] 灰度发布
  1% Worker → 50% Worker → 100% Worker
  监控指标:agent_output_quality_score / skill_deviation_alert
  ↓
[4] 加载(Skill Loader by tag)
  Worker 启动时按 tag 加载 Skill:
  stable: 100% Worker
  candidate: 50% Worker
  snapshot: 1% Worker
  ↓
[5] 调用(Worker → MCP)
  Skill 内含 tool contracts,Worker 调 mock_siem / mock_cmdb / ...
  ↓ A6 持续监控
[6] 回滚(异常时自动触发)
  A6 自适应反馈:drift_score > 0.15 → rollback to v1.0.0
  ↓
回到 [2] 注册新版本 / 修复
```

**回滚触发条件**:
- `agent_output_quality_score < 70` 连续 3 次
- `skill_deviation_alert > 15%`
- `rule_drift_alert > 20%`
- `rag_health_score < 80`

---

## 第 10 页:Flow 1 告警流(22 步)

**评审维度**:多 Agent 协同(25%)

**场景**:`alert_brute_force`(INC-2001)— web-app-prod-01 SSH 暴力破解

**22 步时间线**(精简,详情见 `docs/02-orchestration.md`):

| 阶段 | 步骤 | 涉及 Agent | 关键输出 |
|---|---|---|---|
| 接收 | 1-2 | A0 | 识别 alert_brute_force 流程,触发 Flow 1 |
| 资产画像 | 3-5 | A1 | web-app-prod-01 / OpenSSH 7.4p1 / OpenSSL 1.0.2k |
| 告警聚合 | 6-8 | A2 | 5 个 IP 217 次失败 + 1 个 Tor 出口 |
| 漏洞验证 | 9-12 | A3 | CVE-2023-38408(CVSS 8.1)+ CVE-2020-15778 |
| 应急响应 | 13-18 | A5 | 阻断 5 IP(L1)+ 升级 SSH(L2 审批)+ 强密码(L2 审批) |
| 质量治理 | 19-21 | A6 | 2 次质量门 + 1 次证据锚定 + 1 次自适应反馈 |
| 报告输出 | 22 | A0 | 事故报告(影响/证据/根因/修复/验证) |

**A6 反馈**:至少 1 次 quality gate 触发 + 1 次 evidence 锚定 + 1 次 adaptive_feedback

---

## 第 11 页:Flow 2 监管通报流(26 步)

**评审维度**:多 Agent 协同(25%)

**场景**:`regulator_notice`(INC-2002)— 浙江省网安通报

**关键节点**:

| 阶段 | 涉及 Agent | 关键动作 |
|---|---|---|
| 通报接收 | A0 | 识别 regulator_notice 流程,加载通报上下文 |
| 资产定位 | A1 | 锁定 3 个 PII 敏感数据库 |
| 漏洞/弱口令 | A3 | 验证 admin/admin123 默认口令 + 2 起数据出境 |
| 合规评估 | A4 | 匹配 R-001/R-002/R-003 → 等保/个保法/数据安全法 |
| PIA 评估 | A4 | 生成 PIA 模板,3 个数据库全覆盖 |
| 应急响应 | A5 | 24h 阻断出境(L1) + 7d PIA(L2) + 30d 管理办法(L3) |
| 审批路由 | A0 | H1 事实确认 + H2 执行审批 + L3 业务负责人三审 |
| 质量治理 | A6 | 法规匹配完整性 + RAG 健康度因新法规触发重评 |

**L3 三审**:H1 事实确认(合规官)+ H2 执行审批(业务负责人)+ L3 三审(法务 + DBA)

---

## 第 12 页:Flow 3 新法规响应流(14 步,管理+技术双路)

**评审维度**:多 Agent 协同(25%)

**场景**:`new_regulation`(INC-2003)— 《生成式 AI 服务管理暂行办法》9-1 实施

**双路径设计**(调动 7 Agent):

```
                            ┌─ 管理路径(由 a4 合规主导)─┐
                            │ 1. 草拟管理办法             │
                            │ 2. PIA 评估(3 个 AI 应用)  │
                            │ 3. 算法备案(网信办)        │
                            │ 4. 更新用户协议            │
                            └────────────────────────────┘
                            ┌─ 技术路径(由 a5 响应主导)─┐
INC-2003 触发                │ 5. 内容审核(aliyun.green) │
                            │ 6. 数字水印                │
                            │ 7. 实名认证                │
                            │ 8. 日志归档(SLS 6 个月)    │
                            │ 9. 数据血缘                │
                            └────────────────────────────┘
                            ┌─ 协同(由 a6 + a7)─────────┐
                            │ 10. A6 质量治理             │
                            │ 11. A6 RAG 健康度重评       │
                            │ 12. A7 知识回写 KB-Runbook │
                            │ 13. A7 复盘报告            │
                            │ 14. A0 汇总                │
                            └────────────────────────────┘
```

**核心创新**:管理+技术并行,调动 7 Agent,体现"复杂合规任务的端到端处理能力"

---

## 第 13 页:5 RAG 知识库(共 294,440 条)

**评审维度**:工程落地(20%)

| 知识库 | 条目 | 用途 | 数据源 |
|---|---|---|---|
| KB-Compliance | 1,800 | 法规检索、PIA 模板 | 等保 2.0、个保法、数据安全法、生成式 AI 办法等 |
| KB-Vuln | 285,000 | 漏洞库 | NVD + CNVD + GitHub Advisory + EPSS + CISA KEV |
| KB-Runbook | 2,400 | 应急响应 Runbook | 内部积累 + NIST 800-61 + SANS PICERL |
| KB-Postmortem | 240 | 历史复盘 | 内部复盘案例(脱敏) |
| **KB-SupplyChain** | **5,000** | **供应链安全** | **SBOM 风险组件 + 许可证合规 + 国产化替代清单** |

**检索策略**:Hybrid(BM25 + 向量),top-k=10 + Cross-Encoder 重排序,top-k=5

**A6 健康监控**:5 个 KB 各自 recall/precision/freshness 分数,KB-Postmortem 是高频更新知识库

---

## 第 14 页:6 类 MCP 工具

**评审维度**:工程落地(20%)

| 工具 | 函数 | 真实产品参考 | 复赛替换 |
|---|---|---|---|
| `mock_cmdb` | get_asset, list_assets | 阿里云 CMDB、ServiceNow | cmdb-mcp |
| `mock_sbom` | get_components, scan_vulnerabilities | Anchore、FOSSA、Snyk | sbom-mcp |
| `mock_siem` | search_events, get_alert | Splunk ES、QRadar、奇安信 NDR | siem-mcp |
| `mock_vuln_scanner` | scan_target, get_cve_info | Nessus、Qualys、绿盟、启明星辰 | vuln-mcp |
| `mock_threat_intel` | query_ioc, lookup_malware | 微步在线、奇安信 TI、VirusTotal | ti-mcp |
| `mock_notify` | send_message, list_channels | 钉钉、企微、飞书、SMTP | notify-mcp |

**统一协议**:`POST <BASE>/tools/{scenario_id}/{tool_name}.{function_name}`

**数据格式**:
- SIEM 事件:CEF
- SBOM 组件:CycloneDX 1.5
- 漏洞:CVE 5.0 + EPSS + CISA KEV
- 威胁情报:STIX 2.1

---

## 第 15 页:16 指标 + 10 区大屏

**评审维度**:工程落地(20%)

### 16 核心指标

| 类别 | 指标数 | 关键指标 |
|---|---|---|
| 流量 | 3 | 对话数 / 会话数 / 事故数 |
| 性能 | 2 | 端到端时延 / TTFT |
| 成本 | 1 | Token 消耗(分 Worker) |
| 可靠性 | 3 | Tool 成功率 / 审批通过率 / 重跑率 |
| 协同 | 2 | 跨 Worker 调用 / 证据链完整度 |
| 告警 | 1 | 严重告警数 / 误报率 |
| **A6 专项** | **4** | **质量分/偏差告警/漂移告警/自适应反馈** |

### 10 区大屏

1. 实时告警流
2. 事故处理时间线
3. 资产健康度
4. 漏洞与威胁情报
5. 合规状态
6. 审批工作流
7. 性能与成本
8. 复盘知识沉淀
9. **A6 自适应健康度**(独有)
10. **人机协同接入态**(独有)

---

## 第 16 页:A6 QualitySteward — 7 大职责

**评审维度**:多 Agent 协同(25%)+ 工程落地(20%)

**为什么必须有 A6?** AegisTeam 项目名中"Adaptive"的体现。无 A6,系统只能"自动化"而不能"自适应"。

| # | 职责 | 输出指标 | 自适应反馈 |
|---|---|---|---|
| 1 | Agent 输出质量监控 | `agent_output_quality_score` | < 70 触发重跑 |
| 2 | Skill 偏差检测 | `skill_deviation_alert_total` | 偏差 > 15% 触发回滚 |
| 3 | 规则漂移监控 | `rule_drift_alert_total` | 漂移 > 20% 触发回滚 |
| 4 | RAG 知识库健康 | `rag_health_score` | < 80 触发知识补全 |
| 5 | 证据链完整性 | `evidence_chain_integrity` | 断裂 > 5% 触发重设 |
| 6 | **自适应反馈** | `adaptive_feedback_triggered_total` | 记录所有反馈动作 |
| 7 | 跨 Agent 一致性 | `cross_agent_consistency` | 不一致 > 3 处触发仲裁 |

**4 类反馈动作**:`rerun` / `rollback` / `escalate` / `reset`

**迭代痕迹**:v1.0(2026-07-28)→ v1.3.1(2026-08-15),Roadmap v1.4 增加 Adaptive Engine 自学新攻击模式

---

## 第 17 页:L0.5 人机协同层(双模式)

**评审维度**:场景价值(25%)+ 工程落地(20%)

| 模式 | 适用场景 | 角色化路由 | 技术栈 |
|---|---|---|---|
| **Web 平台模式** | 有 AegisConsole 部署 | 多角色协同 | React + Vite + TailwindCSS |
| **IM 通道模式** | 无平台时 | 钉钉/企微/飞书卡片推送 | mock_notify MCP |

**7 个角色化岗位**:
1. 安全工程师(角色)
2. 合规官(角色)
3. 资产管理员(角色)
4. DBA(角色)
5. 业务负责人(角色)
6. 值班 SRE(角色)
7. 法务(角色)

**按风险等级路由**:
- L0:无审批
- L1:安全工程师(角色)事后告知
- L2:H1 安全工程师 + H2 业务负责人
- L3:H1 + H2 + 业务负责人(角色)三审 + 合规官(角色) + DBA(角色)

**核心价值**:解决中小单位"无平台"困境,IM 推送兜底,角色化触达

---

## 第 18 页:Roadmap + 团队 + 开源

**评审维度**:开源(5%)+ 场景价值(25%)

### Roadmap

| 阶段 | 时间 | 关键能力 |
|---|---|---|
| v1.0 初赛 | 2026-08 | 8 Agent + 27 Skill + 5 RAG + 6 MCP + 3 编排流(本仓库) |
| v1.1 初赛+ | 2026-09 | Web 端 demo 前端 + 演示视频 |
| **v1.2 复赛** | **2026-10** | **Nacos AI Registry + Skill 灰度 + 多模态告警** |
| v1.3 复赛+ | 2026-12 | SIEM/SOAR 真实接入 + 跨团队协同 |
| v2.0 生产 | 2027-H1 | **Adaptive Engine 自学新攻击手法** |

### 团队

3 人小团队,**10 年安全运营 + 2 年大模型** 经验。

### 开源

- **Apache 2.0 协议**全栈开源
- 200+ 文件,含 5 份方案文档 + 8 AgentSpec + 27 SKILL.md + 3 场景 JSON + 6 MCP mock
- 提供完整 Mock 剧本与部署文档
- 一键 `docker-compose up -d` 启动

### 一句话总结

> **8 个岗位化 Agent + 1 个灵活的人机协同层 + A6 自适应引擎 = 中小单位用得起的虚拟 SOC 团队**

---

## 演讲节奏建议(15-20 分钟答辩)

| 章节 | 时间 | 页 |
|---|---|---|
| 开场(痛点+方案) | 2 min | 1-3 |
| 自检表+架构 | 2 min | 4-5 |
| 8 Agent + 27 Skill | 3 min | 6-7 |
| Nacos 全链路 | 2 min | 8-9 |
| 3 编排流 | 3 min | 10-12 |
| 5 RAG + 6 MCP | 2 min | 13-14 |
| 16 指标 + 10 区大屏 | 1 min | 15 |
| A6 + 人机协同层 | 2 min | 16-17 |
| Roadmap + 团队 | 1 min | 18 |
| Q&A 缓冲 | 2 min | — |

---

## 答辩 Q&A 准备(高频问题)

| 问题 | 答案要点 |
|---|---|
| Q:为什么 A0 叫 Leader 不叫 Scheduler? | AgentTeams 框架规范:Team Leader 角色 |
| Q:A6 缺失会怎样? | 系统只能"自动化"不能"自适应",不构成 AegisTeam Adaptive |
| Q:为什么 8 个 Agent 不是 4 个? | 8 个岗位化映射 SOC 真实协作;4 个粒度太粗 |
| Q:如何保证 Skill 不会漂移? | A6 S25 drift_detection 持续监控,v1.0 行为基线对比 |
| Q:监管通报 H1/H2 为什么分开? | 监管要求事实确认(可追溯)+ 执行审批(责任明确)分离 |
| Q:Web 前端和 IM 模式怎么选? | 有平台优先 Web(实时);无平台 IM 兜底(覆盖广) |
| Q:Nacos Registry 复赛如何接入? | 详见 PPT 第 8-9 页全链路,内联→注册→灰度→加载→调用→回滚 |
| Q:Apache 2.0 与 MIT 区别? | Apache 2.0 明确专利授权 + 商标条款,商用更安全 |
