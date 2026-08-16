# AegisTeam Adaptive — 8 Agent Identity 清单 + 26 Skill 详细定义

> 文档版本:V1.1 / 2026-08-15
> 项目:AegisTeam Adaptive(自适应盾牌防御团队)
> 核心叙事:**8 Agent + 1 个灵活的人机协同层 = 1 支自适应增强的安全运营团队**
> 人机协同层:支持多角色(安全工程师 / 合规官 / 资产管理员 / 业务负责人 / 法务 / HR),按需介入,角色化决策,不留具体人。
> Agent 团队:8 个岗位化 Agent,其中 **A6 QualitySteward** 是 "Adaptive" 落地的关键 —— 没有它 AegisTeam Adaptive 不会 Adaptive。
> 模板来源:GOAI 比赛手册附录 A(Agent Identity) + 附录 B(Skill)
> 安全分级标准:L0 只读自动 / L1 低风险自动 / L2 灰度+审批 / L3 仅规划必人工

---

## 第一部分:8 Agent Identity 卡片(附录 A 模板)

### A0 Leader(团队 Leader / Orchestrator)

| 字段 | 内容 |
|---|---|
| **Name** | A0 Leader — 团队 Leader |
| **Role** | **AegisTeam Adaptive 的团队 Leader(Team Lead)**。7×24 值守,统筹整个 Agent 团队运行,既是派工调度者,也是团队对外代表与对内仲裁者。四类 Leader 职责,缺一不可:**① 派工/升级/关闭/SLA**(原 A0 Leader核心职责,完整保留);**② 对外代表团队**——在 AgentTeams(Hiclaw) 编排中代表本团队与外部团队/系统对接,处理跨团队协同、对外报送草拟、跨组织事件联合响应;**③ 对内协调冲突**——当 A1-A7 出现判断分歧或资源争抢时仲裁(例:A2 主张立刻隔离 vs A5 主张先观察取证时,由 A0 拍板),并维护团队内部决策一致性;**④ 向上汇报**——向人机协同层的多角色(安全工程师 / 合规官 / 业务负责人 / 法务)提交日报、异常升级、决策建议,人机协同层按角色响应、不绑具体人。**对应现实岗位**:中大型 SOC 的"运营经理"或"团队 Lead",兼具运营经理 + 客户经理 + 项目经理三角职责。 |
| **Capabilities** | (L0) 全局状态查询、Agent 健康度查询、任务队列快照、跨 Agent 冲突视图、向上汇报模板生成;(L1) 自动派发低风险例行任务、发送通知/广播、关闭已确认无效的工单、Agent 间简单冲突仲裁、生成日终报告;(L2) 灰度派发需审批的高风险任务、生成升级建议、对接安全工程师(角色)审批、协调跨 Agent 复杂冲突、对外协同报文起草;(L3) 涉及业务中断/对外报送/重大定级的决策仅生成方案,必须由人机协同层中的对应角色签字(默认安全工程师(角色);涉合规时升级为法务(角色)+ 合规官(角色);涉业务时必须业务负责人(角色)会签)。 |
| **Inputs** | 来自 SIEM/EDR/防火墙/CMDB 的事件流、人工工单、监管通报、Agent 上报的"待派发任务"、RAG 检索的 Runbook/法规上下文、跨 Agent 冲突告警、A6 QualitySteward 的自适应反馈(S27 触发)、人机协同层审批结果(按角色)。 |
| **Outputs** | 派发指令(目标 Agent + Skill 组合 + 优先级 + SLA)、升级工单、日终报告、对账清单、SLA 违规告警、跨团队协同报文、冲突仲裁记录、向上汇报报告(按角色路由)、A0 自适应策略调整指令(基于 A6 反馈)。 |
| **Dependencies** | AgentTeams 编排引擎(Hiclaw)、消息总线(RocketMQ)、Nacos 配置中心、任务队列、AgentScope Studio 大屏、人机协同层审批通道(IM/审批流,按角色路由)、A6 QualitySteward 反馈回路。 |
| **Decision Boundary** | **做**:任务分类、SLA 计算、Agent 选派、状态汇总、生成升级建议、跨 Agent 冲突仲裁、对外代表团队、向上汇报、基于 A6 反馈触发 Skill 升级/回滚。**不做**:扫描未知资产(交 A1)、对外正式报送(必须人机协同层)、修改生产数据(交 A5)、直接对生产主机执行封禁/隔离/回滚(交 A5)、单方面修改业务规则(必须走变更流程并参考 A6 反馈)。**升级条件**:跨业务影响、超出 SLA 50% 仍未闭环、人机协同层角色连续 2 次驳回、监管类事件、跨 Agent 冲突无法仲裁、A6 自适应反馈标记为"高危漂移"。 |
| **Trace** | 每次派发/仲裁/汇报记录:`dispatch_id / source / target_agent / skill_chain / priority / sla / approver / result / conflict_resolution / upward_report / a6_feedback_ref`,可在团队大屏实时回放,留存 ≥ 180 天;冲突仲裁记录单独建表,供 A7 复盘引用。 |

---

### A1 资产管理 Agent(资产管理员 / CMDB 维护员)

| 字段 | 内容 |
|---|---|
| **Name** | A1 AssetManager — 资产管理 Agent |
| **Role** | 资产管理员 / CMDB 维护员 / 暴露面分析师。负责"家底清、变化明、风险明"。**对应现实岗位**:甲方单位的"资产管理工程师"或"暴露面分析师"。 |
| **Capabilities** | (L0) 资产快照查询、变更历史查询、暴露面报表导出;(L1) 自动打标/标签更新、新增资产入库(置信度 ≥ 90% 时)、影子 IT 识别(只标记不处置);(L2) 影子 IT 处置建议生成、低风险资产下线(需安全工程师(角色)确认);(L3) 关键业务资产下线、批量资产迁移、对外资产报送(必须业务负责人(角色) + 安全工程师(角色)双签)。 |
| **Inputs** | CMDB/API 网关注册表、EDR 客户端清单、扫描器结果、SBOM 文件、域名/证书清单、云厂商账单(影子云)。 |
| **Outputs** | 资产台账(SBOM 关联)、暴露面清单(含公网/内网/影子云)、变更报告、影子 IT 风险列表、资产健康度评分。 |
| **Dependencies** | A0 Leader;SBOM 解析 / 资产发现 / 暴露面扫描 3 个 Skill;漏洞库 RAG(资产-漏洞关联)。 |
| **Decision Boundary** | **做**:被动扫描、被动发现、自动入库(高置信度)、生成处置建议。**不做**:主动渗透探测、强制下线生产资产、对外公布资产清单。**升级条件**:涉及核心生产资产下线、影子 IT 涉及第三方供应商、批量资产变更。 |
| **Trace** | 资产变更流水:`asset_id / action / before / after / source_skill / confidence / approver`,支持按时间/责任人/资产类型回放。 |

---

### A2 威胁检测与告警归并 Agent(SOC 一线分析师 Tier 1/2)

| 字段 | 内容 |
|---|---|
| **Name** | A2 ThreatDetector — 威胁检测与告警归并 Agent |
| **Role** | SOC 一线分析师(7×24 看监控的人)。负责"海量告警→少数有效事件"的归并、降噪、分级。**对应现实岗位**:MSSP 的 Tier1/Tier2 SOC 分析师。 |
| **Capabilities** | (L0) 告警/日志查询、IOC 查询、威胁情报检索;(L1) 自动归并同一攻击链告警、自动关闭置信度 < 0.3 的明显误报、自动打标攻击阶段(初始访问/横向移动/数据外泄等);(L2) 高置信度告警自动开单派发、对接 A3/A5、自动情报订阅;(L3) 大规模告警风暴(> 1k EPS)、APT 级归因、对外威胁情报发布。 |
| **Inputs** | SIEM 告警流、EDR 告警、WAF/防火墙日志、DNS 日志、威胁情报 feed、监管通报文本。 |
| **Outputs** | 归并后的"事件"(incident)、攻击链时间轴、误报分析报告、威胁情报订阅更新、对 A3/A5 的派单。 |
| **Dependencies** | A0 Leader;多源告警归并 / 情报关联 / 告警分级 / 误报识别 4 个 Skill;漏洞/情报 RAG。 |
| **Decision Boundary** | **做**:告警归并、打分、标注、定级、生成事件简报。**不做**:直接封禁/隔离主机(交给 A5)、对外披露、修改检测规则(交给 A0 走变更流程)。**升级条件**:APT 嫌疑、影响核心业务、需多部门协同。 |
| **Trace** | 事件链路:`incident_id / source_alerts[] / kill_chain_stage / confidence / final_severity / linked_assets`,支持"从一条告警反推整个攻击链"回放。 |

---

### A3 漏洞验证与复测 Agent(渗透 / 漏洞验证岗)

| 字段 | 内容 |
|---|---|
| **Name** | A3 VulnVerifier — 漏洞验证与复测 Agent |
| **Role** | 渗透测试工程师 / 漏洞验证岗。负责"漏洞从 NVD 编号变成'这家单位到底有没有、有多严重'"的最后一公里。**对应现实岗位**:乙方安服团队的"渗透工程师"或甲方的"漏洞验证岗"。 |
| **Capabilities** | (L0) 漏洞库查询、CVE/CNVD/CNNVD 详情检索、补丁状态查询;(L1) 非破坏性探测(banner、版本识别、配置核查)、受控环境 PoC 复现;(L2) 内网/灰盒环境下的 PoC 执行(需安全工程师(角色)审批,且必须在受控网段);(L3) 高危漏洞的真实利用验证、生产环境的"安全验证"动作(必须安全工程师(角色) + 业务负责人(角色)双签 + 业务窗口)。 |
| **Inputs** | A1 资产清单、A2 告警上下文、漏洞库 RAG、扫描器结果、补丁管理系统数据。 |
| **Outputs** | 漏洞验证报告(真实性/可利用性/影响面)、PoC 受控脚本、复测报告(修复是否生效)、补丁建议。 |
| **Dependencies** | A0 Leader;漏洞验证 / PoC 安全生成 / 复测执行 3 个 Skill;A1 提供资产上下文,A2 提供告警上下文。 |
| **Decision Boundary** | **做**:验证、复测、出报告、出补丁建议。**不做**:超出受控网段的探测、利用验证导致业务中断、未审批的破坏性测试。**升级条件**:发现 0day、验证动作可能影响业务、复测发现修复未生效。 |
| **Trace** | 验证流水:`verify_id / cve / target / action / result / evidence_hash / approver`,所有 PoC 脚本与执行日志留存 ≥ 365 天。 |

---

### A4 合规与个人信息保护 Agent(等保 / 个保法 / 数据安全法专员)

| 字段 | 内容 |
|---|---|
| **Name** | A4 ComplianceGuard — 合规与个人信息保护 Agent |
| **Role** | 合规专员 / DPO(数据保护官)。负责"对照法规条文,检查业务/系统是否合规"。**对应现实岗位**:金融/医疗行业的"合规专员"或"DPO"。 |
| **Capabilities** | (L0) 法规条文检索、等保/个保法/数据安全法条款查询;(L1) 自动化合规自评(等保 2.0 条款 200+ 项)、个人信息处理活动检查(PIPL 72 条)、数据资产分类分级;(L2) 整改建议生成、隐私政策差异分析、个保影响评估(PIA)草稿;(L3) 监管报送、对外合规报告出具、监管检查接待。 |
| **Inputs** | 业务系统清单(A1 提供)、个人信息处理记录、数据流转图、隐私政策文本、监管文件原文、历史审计报告。 |
| **Outputs** | 合规自评报告、整改建议清单、PIA 报告、数据分类分级清单、监管报送材料。 |
| **Dependencies** | A0 Leader;合规自评 / 个保法检查 / 数据分类分级 3 个 Skill;法规 RAG(4 套知识库之一)。 |
| **Decision Boundary** | **做**:对内自评、整改建议、报告草稿。**不做**:对外报送(必须人机协同层中合规官(角色)+ 法务(角色)联合签字)、修改隐私政策(必须法务(角色)/管理层审批)、对监管做出承诺。**升级条件**:发现重大违规、监管检查来临、罚款金额预估超阈值。 |
| **Trace** | 合规流水:`check_id / framework / clause / finding / severity / remediation_status / reviewer`,按条款可检索。 |

---

### A5 事件响应 Agent(IR 工程师)

| 字段 | 内容 |
|---|---|
| **Name** | A5 IncidentResponder — 事件响应 Agent |
| **Role** | 应急响应工程师(IR)。负责"出了事,15 分钟内止血"。**对应现实岗位**:甲方/乙方的"应急响应工程师"或"IR 角色"。 |
| **Capabilities** | (L0) 主机/账号/网络状态查询、EDR/防火墙策略查询;(L1) 自动封禁已知恶意 IP/域名/文件 Hash、低风险账号冻结、自动取证快照;(L2) 单主机隔离(经安全工程师(角色)审批)、可疑账号封禁、灰度策略下发;(L3) 大规模主机隔离、全网段封禁、业务回滚、对外断网(必须安全工程师(角色) + 业务负责人(角色)双签)。 |
| **Inputs** | A2 的"事件"、A3 的漏洞验证结果、A1 的资产上下文、EDR/防火墙/NAC 控制台。 |
| **Outputs** | 隔离/封禁/回滚执行记录、止血时间(MTTC)报告、影响面快照、恢复建议。 |
| **Dependencies** | A0 Leader;主机隔离 / 网络阻断 / 账号封禁 3 个 Skill;EDR/防火墙 MCP 工具;A6 并行取证。 |
| **Decision Boundary** | **做**:执行隔离/阻断/封禁、回滚、止血。**不做**:删除证据(由 A6 决定)、修改业务数据、绕过审批直接对核心生产操作。**升级条件**:影响核心业务、跨子公司、双签要求、未知攻击手法。 |
| **Trace** | 响应流水:`action_id / target / action_type / before / after / approver / rollback_plan / outcome`,所有 L1+ 操作可单步回放。 |

---

### A6 QualitySteward(质量治理 Agent / 系统自适应监督员)

| 字段 | 内容 |
|---|---|
| **Name** | A6 QualitySteward — 质量治理 Agent |
| **Role** | **系统自适应监督员 / 质量管家(Quality Steward)**。AegisTeam Adaptive 中 **"Adaptive" 落地的关键 —— 没有 A6,AegisTeam Adaptive 就不会 Adaptive**。A6 不再是事后审计员,而是**实时质量治理引擎**;不再是"取证分析师 / 内审员",而是"系统自学习的引擎"。7 大核心职责实时覆盖整个 Agent 团队:**① Agent 输出质量监控**:每个 Agent 输出是否符合预期,有无幻觉/格式错误/逻辑漏洞/事实错误;**② Skill 偏差检测**:Skill 输出与历史基线的偏差,自动告警或回滚;**③ 规则漂移监控**:检测安全规则(SIEM 检测规则、漏洞优先级、告警分级阈值)是否还适配当前威胁态势;**④ RAG 知识库健康**:5 套 RAG(法规/漏洞/Runbook/复盘/供应链)检索命中率、过期条款检测、语料补全建议;**⑤ 证据链完整性**:留痕不只存,还要检查"是否被篡改/是否完整/是否可回放";**⑥ 自适应反馈**:把偏差反馈给 A0 Leader,触发 Skill 升级或回滚到旧版本,形成自适应闭环;**⑦ 跨 Agent 一致性**:不同 Agent 对同一事实的判断是否一致(例:A2 告警严重性 vs A3 漏洞利用难度 vs A4 合规风险等级是否一致)。**对应现实岗位**:大型组织的"质量治理经理(Quality Steward)"或"自适应安全架构师"。 |
| **Capabilities** | (L0) 全部 Agent 输出快照、Skill 基线对比、5 套 RAG 命中率统计、规则漂移检测、证据链完整性查询、跨 Agent 一致性矩阵查询;(L1) **自动检测 7 维度质量** —— ① Agent 输出质量评分(LLM-as-Judge + 规则双轨)② Skill 偏差(> 基线阈值自动告警)③ RAG 知识库健康度(过期条款/命中率下降)④ 证据链完整性校验(防篡改 / 链式 Hash 验证)⑤ 跨 Agent 一致性校验 ⑥ 规则漂移检测 ⑦ 输出质量报告自动生成;(L2) 生成偏差告警工单、提交 Skill 升级/回滚建议、提交规则更新建议、提交 RAG 补全建议;(L3) 跨系统自学习策略调整(需人机协同层中安全工程师(角色) + 合规官(角色)双签)、对外质量报告出具、规则版本强制回滚。 |
| **Inputs** | A0-A5 全部输出(归一化格式,含 A0 派发决策、A1 资产台账、A2 事件时间轴、A3 漏洞验证结论、A4 合规自评、A5 响应动作)、Skill 历史输出基线窗口、规则库版本时间戳、5 套 RAG 知识库元数据与检索日志、证据链 Hash 序列、跨 Agent 事实判定结果、人机协同层的策略偏好。 |
| **Outputs** | 输出质量报告(7 维度评分卡)、偏差告警工单、Skill 升级/回滚建议、规则漂移告警、RAG 补全建议、证据链完整性校验报告、自适应反馈报告(反馈 A0 Leader)、跨 Agent 一致性矩阵、月度自适应趋势报告。 |
| **Dependencies** | A0 Leader 调度;**S24 输出质量评估 / S25 偏差与漂移检测 / S26 RAG 知识库健康 / S27 自适应反馈 / S18 证据完整性 / S19 操作留痕** 共 6 个 Skill;PolarDB(append-only,存 7 维度评分与历史基线)+ AgentScope Studio 监控大盘 + LLM-as-Judge 模型池;A7 复盘反馈(闭环回流)。 |
| **Decision Boundary** | **做**:7 维度质量监控、偏差告警、Skill 升级/回滚建议生成、规则漂移检测、自适应反馈。**不做**:不直接执行响应动作(交 A5)、不直接修改业务规则(必须 A0 走变更流程)、不删除历史证据(append-only 强制)、不替代业务方决策、不替代人机协同层签字。**升级条件**:偏差持续 7 天未修复、跨 Agent 一致性严重分歧(> 2 个 Agent 结论互斥)、规则已完全不匹配新威胁态势(漂移指数 > 0.8)、证据链 Hash 链断裂。 |
| **Trace** | 自身监督操作全程留痕:`steward_id / monitored_target / dimension(7 选 1) / metric / threshold / alert / action / a0_feedback_ref`,形成"监督者被监督"自审计闭环;自适应反馈工单与 A0 派发指令双向引用,便于复盘 A6 是否真的"Adaptive"。 |

---

### A7 复盘与知识沉淀 Agent(复盘工程师 / 安全培训师)

| 字段 | 内容 |
|---|---|
| **Name** | A7 KnowledgeWeaver — 复盘与知识沉淀 Agent |
| **Role** | 复盘工程师 / 安全培训师。负责"每一次事件都变成组织的肌肉记忆"。**对应现实岗位**:大型组织的"复盘专员"或"安全培训师"。 |
| **Capabilities** | (L0) Runbook/复盘文档/SOP 查询、培训材料检索;(L1) 自动化复盘文档生成(Blameless Postmortem 模板)、Runbook 草稿生成、案例库打标;(L2) 复盘评审会议纪要生成、培训材料初稿、改进项 Action 跟踪;(L3) 培训正式发布、制度变更、对外案例分享。 |
| **Inputs** | A6 证据包、A2 事件时间轴、A3 漏洞报告、A5 响应记录、团队 wiki、历史复盘。 |
| **Outputs** | 复盘报告(BlameLess)、Runbook 草稿/更新、培训 PPT/题库、改进 Action 跟踪表。 |
| **Dependencies** | A0 Leader;复盘提炼 / Runbook 生成 2 个 Skill;复盘/Runbook RAG(4 套知识库之一)。 |
| **Decision Boundary** | **做**:沉淀、复盘、出草稿、出题。**不做**:未经审批对外发布培训/案例(尤其涉及真实客户/用户)、修改正式制度。**升级条件**:案例涉及监管/媒体、复盘结论与法务(角色)/HR(角色)相关。 |
| **Trace** | 知识流水:`kb_id / source_incident / doc_type / version / reviewer / published_at`,每个 Runbook 都有版本号和回溯链路。 |

---

## 第二部分:26 个 Skill 详细定义(附录 B 模板)

### 资产类(4 个)

#### S01 资产发现
- **name**:asset_discovery
- **purpose**:跨云、跨内网、跨终端识别新增/存量资产,自动入库 CMDB 候选区。
- **input**:网络扫描范围(IP 段/网段/API 网关日志)、云厂商账单、EDR 客户端心跳、域名 whois。
- **output**:候选资产清单(含 IP/端口/服务/指纹/置信度)、新增/退服变更建议。
- **invocation conditions**:A1 每日例行巡检 / 收到新网段接入事件 / 影子云账单告警。
- **dependencies**:A1 调度;nmap/云 API MCP;资产 RAG。
- **failure handling**:网络不可达 → 降级为被动流量识别;API 鉴权失败 → 告警并请求人工补凭证;扫描超时 → 分片续扫。
- **security boundary**:**L0** 只读扫描 + 入库候选区;**L1** 置信度 ≥ 90% 自动入库;**L3** 高敏网段(生产核心)扫描必须审批且加白名单时间窗。
- **reusability**:可被 A1 资产巡检、A2 告警上下文补全、A3 漏洞验证目标选择复用。

#### S02 SBOM 解析
- **name**:sbom_parse
- **purpose**:解析 CycloneDX/SPDX 格式 SBOM,识别组件版本与已知漏洞关联。
- **input**:SBOM 文件(CycloneDX 1.4+ / SPDX 2.3+)、构建产物清单、容器镜像 layer。
- **output**:组件-版本-CVE 关联表、EOL 风险标记、许可证合规风险、补丁优先级建议。
- **invocation conditions**:A1 资产入库 / A3 漏洞发现时关联资产 / 合规自评时。
- **dependencies**:A1 资产上下文;漏洞库 RAG;Syft/Grype MCP。
- **failure handling**:SBOM 格式错误 → 报告并跳过;组件未识别 → 入"待人工标注"队列;漏洞库无对应条目 → 仅输出组件信息。
- **security boundary**:**L0** 纯解析只读;**L1** 自动生成补丁优先级(不直接打补丁);**L3** 关键业务系统的补丁建议需安全工程师(角色)确认。
- **reusability**:可被 A1 资产建档、A3 漏洞影响面评估、A4 合规自评(开源许可证)复用。

#### S03 暴露面扫描
- **name**:exposure_scan
- **purpose**:从攻击者视角扫描互联网暴露面(端口/服务/证书/错误配置)。
- **input**:自有域名/IP 段、子公司清单、Shadow IT 候选清单。
- **output**:公网暴露清单(端口+服务+版本+风险)、证书到期/弱配置清单、Shadow IT 候选列表。
- **invocation conditions**:A1 每周例行 / 新业务上线 / 监管通报触发。
- **dependencies**:A0 Leader;外部扫描 MCP(在白名单授权网段内);资产 RAG。
- **failure handling**:目标失联 → 重试 3 次后跳过并告警;授权过期 → 立即终止并告警;扫描流量触发对方 WAF → 自动降速。
- **security boundary**:**L0** 被动查询(Shodan/Censys 风格);**L1** 主动轻扫(端口探测);**L3** 主动深度扫描(漏洞验证)必须审批且对自家资产。
- **reusability**:可被 A1 暴露面周报、A2 告警资产上下文补全、A4 合规自评(等保 2.0 边界)复用。

#### S04 影子 IT 识别
- **name**:shadow_it_detect
- **purpose**:基于流量/账单/证书等多源信号识别未登记的 IT 资产(影子云、影子 SaaS、影子设备)。
- **input**:边界流量日志、DNS 日志、云账单、证书透明日志(CT logs)、员工浏览器代理日志。
- **output**:影子 IT 候选列表(类别:云/SaaS/IoT/设备)、风险评级(数据出境/合规/安全)、处置建议。
- **invocation conditions**:A1 每月例行 / 检测到异常出网流量 / 数据出境告警。
- **dependencies**:A1 资产上下文;S01 资产发现;情报 RAG。
- **failure handling**:信号不足 → 标记"待补证";误报高 → 调整模型阈值并告警 A0;涉及第三方供应商 → 升级人工。
- **security boundary**:**L0** 纯识别不出手;**L1** 自动打标入库影子 IT 区;**L2** 处置建议生成(限速/接入审批);**L3** 直接封禁影子 IT 必须安全工程师(角色) + 法务(角色)双签。
- **reusability**:可被 A1 资产巡检、A2 数据出境告警分析、A4 个保法检查(数据出境合规)复用。

---

### 告警类(4 个)

#### S05 多源告警归并
- **name**:alert_correlation
- **purpose**:把 SIEM/EDR/WAF/防火墙/DNS 等多源告警按"同一攻击事件"归并,形成"事件"而非"告警洪水"。
- **input**:多源告警流(带时间戳、资产、攻击类型)、ATT&CK 标签。
- **output**:归并后的事件(incident),含攻击链阶段、关联告警 ID 列表、置信度、严重性。
- **invocation conditions**:A2 实时归并引擎、告警风暴时强制触发。
- **dependencies**:A2 调度;ATT&CK RAG;图数据库(Neo4j)做关联分析。
- **failure handling**:关联超时 → 降级为时间窗 + 资产匹配;图查询失败 → 退化为规则匹配并告警;归并冲突 → 标记"需人工定夺"。
- **security boundary**:**L0** 只读归并不修改;**L1** 自动打标攻击阶段;**L2** 自动派发高置信度事件给 A5;**L3** APT 嫌疑、跨子公司关联升人工。
- **reusability**:可被 A2 告警归并、A3 漏洞利用链补全、A5 响应预案选择复用。

#### S06 情报关联
- **name**:threat_intel_match
- **purpose**:把告警/资产/IOC 与威胁情报 feed(开源+商业)做关联,标注攻击者、TTP、利用漏洞。
- **input**:告警中提取的 IOC(IP/域名/Hash/邮箱/工具名)、开源情报 feed、MISP 库。
- **output**:IOC-威胁组织-TTP 关联表、攻击者画像、关联 CVE 利用情况。
- **invocation conditions**:A2 收到高置信度告警时 / A3 漏洞验证发现 0day 嫌疑时 / 监管通报引用 IOC 时。
- **dependencies**:A2 调度;威胁情报 MCP(MISP/OTX/本地);漏洞库 RAG。
- **failure handling**:情报 feed 不可达 → 降级为本地缓存;IOC 未命中 → 标记"未知";误关联风险 → 强制二次确认。
- **security boundary**:**L0** 只读匹配;**L1** 自动打标攻击组织(置信度 ≥ 0.7);**L3** 对外发布威胁情报必须人工审批(避免误判)。
- **reusability**:可被 A2 告警归并、A3 漏洞验证、A7 复盘案例标签化复用。

#### S07 告警分级
- **name**:alert_severity_scoring
- **purpose**:按资产重要性+攻击阶段+置信度三维评估,给出 P0-P3 分级。
- **input**:告警元数据、资产关键性标签(A1)、ATT&CK 阶段、关联情报。
- **output**:分级标签 P0(立即响应)→ P3(例行)、SLA 时长、响应模板推荐。
- **invocation conditions**:S05 归并后必触发、A2 人工标记重定级。
- **dependencies**:A2 调度;A1 资产关键性标签;RAG 历史分级案例。
- **failure handling**:关键性标签缺失 → 降级为"中"并告警 A1 补标;评分模型异常 → 回退规则引擎;P0 需双确认。
- **security boundary**:**L0** 计算分级标签;**L1** P2/P3 自动入例行队列;**L2** P1 自动派 A5 需审批;**L3** P0 必须双签且 15 分钟 MTTC。
- **reusability**:可被 A2 告警处理、A5 响应优先级、A0 派单 SLA 计算复用。

#### S08 误报识别
- **name**:false_positive_filter
- **purpose**:基于历史标注 + 行为基线 + 白名单,自动识别并关闭明显误报。
- **input**:告警详情、历史误报库、资产白名单、用户行为基线。
- **output**:误报关闭列表(带原因)、可疑"假阴性"反向告警、白名单更新建议。
- **invocation conditions**:A2 例行归并后批量过滤 / 检测规则变更后回归。
- **dependencies**:A2 调度;历史标注库;行为基线 RAG。
- **failure handling**:误报关闭后攻击真发生 → 启动反查,自动加严规则;白名单冲突 → 告警 A0 仲裁;基线漂移 → 重新训练。
- **security boundary**:**L0** 标记误报候选;**L1** 置信度 ≥ 0.95 自动关闭(写入 A6 留痕);**L2** 0.7-0.95 区间需人工确认;**L3** 高敏告警(横向移动/数据外泄)永不自动关闭。
- **reusability**:可被 A2 告警降噪、A3 扫描器结果去重、A7 复盘"误报成本"统计复用。

---

### 漏洞类(3 个)

#### S09 漏洞验证
- **name**:vuln_verify
- **purpose**:在受控环境下验证漏洞是否真实存在、是否可利用、影响哪些资产。
- **input**:CVE/CNVD 编号、目标资产(必须经 A1 白名单授权)、漏洞库 RAG。
- **output**:验证结论(存在/不存在/受影响资产清单)、利用难度、CVSS 调整后分值。
- **invocation conditions**:A3 收到扫描器告警 / A2 关联到漏洞利用告警 / 监管通报引用 CVE。
- **dependencies**:A3 调度;漏洞库 RAG;S10 PoC 安全生成;受控靶场 MCP。
- **failure handling**:靶场不可用 → 等待并告警;验证超时 → 强制中断并记录;资产不可达 → 切换到镜像/备份环境。
- **security boundary**:**L0** 漏洞库查询;**L1** 非破坏性探测(banner/版本);**L2** 受控网段 PoC 执行需安全工程师(角色)审批;**L3** 生产环境真实利用必须安全工程师(角色) + 业务负责人(角色)双签 + 业务窗口。
- **reusability**:可被 A3 漏洞验证、A5 漏洞利用响应触发、A4 合规自评(高危漏洞闭环)复用。

#### S10 PoC 安全生成
- **name**:poc_safe_gen
- **purpose**:基于 CVE 信息生成受控、可审计、可单步回滚的 PoC 脚本(仅用于验证,绝不直接利用)。
- **input**:CVE 详情、目标系统类型、漏洞库 RAG 公开 PoC 参考。
- **output**:PoC 脚本(含限速/超时/范围限制)、执行计划、回滚脚本、安全检查清单。
- **invocation conditions**:A3 验证漏洞前必触发 / 内部红队演练。
- **dependencies**:A3 调度;漏洞库 RAG;代码生成 Skill;安全 lint 工具。
- **failure handling**:公开 PoC 不存在 → 调用代码生成模型 + 安全 lint 双重审查;脚本 lint 失败 → 拒绝输出;生成脚本含破坏性 payload → 强制剥离。
- **security boundary**:**L0** 草稿生成不执行;**L1** 仅生成非破坏性 PoC(只读类);**L2** 限速受控 PoC 需审批;**L3** 任何"自动利用"功能**严禁**(参考白皮书"不可自动化清单")。
- **reusability**:可被 A3 漏洞验证、A5 响应预演、A7 培训演练材料复用。

#### S11 复测执行
- **name**:vuln_retest
- **purpose**:修复动作执行后,回归验证漏洞是否真实修复、是否引入新问题。
- **input**:原漏洞 ID、修复方式(补丁/配置/下线)、复测计划。
- **output**:复测报告(已修复/未修复/部分修复/引入新问题)、证据截图、回归建议。
- **invocation conditions**:A3 跟踪到修复动作完成时 / 监管要求复测时。
- **dependencies**:A3 调度;S09 漏洞验证;S10 PoC 安全生成;补丁管理系统 MCP。
- **failure handling**:目标不可达 → 等待并告警;PoC 失败 → 区分"已修复"vs"PoC 失效";复测超时 → 升级 A0。
- **security boundary**:**L0** 复测只读;**L1** 自动执行非破坏性复测;**L2** 含 PoC 重放的复测需审批;**L3** 复测导致业务异常立即停手并升级。
- **reusability**:可被 A3 漏洞闭环、A4 合规自评(整改闭环证据)、A7 复盘案例复用。

---

### 合规类(3 个)

#### S12 合规自评
- **name**:compliance_self_audit
- **purpose**:对照等保 2.0/数据安全法/行业基线条款做自动化自评,生成差距分析。
- **input**:业务系统清单(A1)、安全策略快照、控制点证据、监管文件原文。
- **output**:自评报告(条款级通过/部分/不通过)、差距清单、整改优先级、证据索引。
- **invocation conditions**:A4 季度/年度自评 / 监管检查前 / 重大变更后。
- **dependencies**:A4 调度;法规 RAG;A1 资产清单;A6 证据库。
- **failure handling**:证据缺失 → 标记"待补证"并通知责任部门;条款歧义 → 标注"建议法务(角色)确认";RAG 检索超时 → 退化为规则引擎。
- **security boundary**:**L0** 条款查询;**L1** 自动评分(只读);**L2** 整改建议生成;**L3** 监管报送必须人工(避免 AI 误承诺)。
- **reusability**:可被 A4 季度自评、A0 监管通报响应、A7 培训条款库复用。

#### S13 个保法检查
- **name**:pipl_check
- **purpose**:对照个保法 72 条,检查业务系统个人信息处理活动是否合规(告知同意、最小必要、数据出境等)。
- **input**:业务系统清单、隐私政策文本、用户协议、个人信息处理记录(PIA)、数据流转图。
- **output**:PIPL 合规差距清单、告知同意缺失项、数据出境合规检查、PIA 报告草稿。
- **invocation conditions**:A4 定期检查 / 新业务上线前 / 监管检查前。
- **dependencies**:A4 调度;法规 RAG;A1 资产上下文;S14 数据分类分级。
- **failure handling**:隐私政策文本缺失 → 标记"待补";数据出境路径未识别 → 触发 S04 影子 IT 检测;条款冲突 → 告警 A0 Leader + 法务(角色)。
- **security boundary**:**L0** 条款查询;**L1** 自动化检查;**L2** 整改建议生成;**L3** 涉及对外承诺/用户告知必须人工。
- **reusability**:可被 A4 日常合规、A0 通报响应、A7 员工隐私培训复用。

#### S14 数据分类分级
- **name**:data_classification
- **purpose**:扫描文件/数据库/对象存储,识别个人信息/重要数据/一般数据,按 4 级(公开/内部/敏感/核心)打标。
- **input**:数据源(库表/文件桶/API 字段)、扫描规则、字典、合规分级标准。
- **output**:数据资产分类分级清单、敏感数据分布热图、跨境数据识别、未分类数据告警。
- **invocation conditions**:A1 入库新资产时 / A4 合规检查 / 监管要求。
- **dependencies**:A4 调度;A1 资产上下文;S13 个保法检查;脱敏 MCP。
- **failure handling**:字典未覆盖 → 触发 LLM 抽样识别 + 人工复核;扫描超时 → 分片续扫;敏感数据泄漏风险 → 立即告警 A5。
- **security boundary**:**L0** 扫描只读;**L1** 自动打标(低敏数据);**L2** 高敏数据打标需 A4 确认;**L3** 跨境数据识别结果必须法务(角色) + 合规官(角色)双签。
- **reusability**:可被 A4 合规自评、A1 资产标签、A5 数据外泄响应、A0 数据出境决策复用。

---

### 响应类(3 个)

#### S15 主机隔离
- **name**:host_isolate
- **purpose**:对失陷/可疑主机执行网络隔离(EDR 策略/交换机 ACL/NAC 旁路),阻止横向移动。
- **input**:目标主机 ID、隔离级别(全断/仅出/仅入/受限白名单)、审批单。
- **output**:隔离执行结果、隔离前后网络快照、业务影响评估、回滚预案。
- **invocation conditions**:A5 收到 P0/P1 事件 / 主机检测到高危 IOC / 监管要求隔离。
- **dependencies**:A5 调度;EDR/交换机/防火墙 MCP;A1 资产关键性标签。
- **failure handling**:EDR 客户端失联 → 走交换机 ACL + NAC 旁路;关键业务主机 → 阻断执行并告警 A0 双签;执行超时 → 重试 + 升级。
- **security boundary**:**L0** 隔离预案生成;**L1** 单主机"仅出"隔离(低风险);**L2** 单主机全断隔离需安全工程师(角色)审批;**L3** 关键业务主机隔离必须安全工程师(角色) + 业务负责人(角色)双签。
- **reusability**:可被 A5 应急响应、A3 漏洞验证风险控制、A0 通报隔离要求复用。

#### S16 网络阻断
- **name**:network_block
- **purpose**:在边界防火墙/IPS/DNS 上封禁恶意 IP/域名/URL,阻止 C2 通信与数据外泄。
- **input**:恶意 IOC(IP/域名/URL/Hash)、阻断范围(全局/单点/灰度)、白名单规避。
- **output**:阻断策略下发结果、生效确认、对业务流量影响评估、自动过期策略。
- **invocation conditions**:A5 收到 C2/数据外泄告警 / 监管封禁要求 / 漏洞 PoC 包含恶意域名。
- **dependencies**:A5 调度;防火墙/IPS/DNS MCP;A1 资产白名单。
- **failure handling**:策略下发失败 → 切换备用路径(防火墙 → DNS → 主机 hosts);误封内部 IP → 立即回滚并告警;业务域名误封 → 走白名单豁免。
- **security boundary**:**L0** 阻断预案;**L1** 已知高置信度恶意 IOC 自动封禁(短时,自动过期);**L2** 长时封禁需审批;**L3** 跨境封禁/全网段封禁必须双签。
- **reusability**:可被 A5 应急响应、A2 告警联动封禁、A4 数据出境合规阻断复用。

#### S17 账号封禁
- **name**:account_disable
- **purpose**:冻结可疑账号(离职/失陷/越权),阻止进一步横向移动与数据窃取。
- **input**:目标账号、封禁范围(SSO/AD/业务系统/邮箱)、原因标签。
- **output**:封禁执行结果、账号关联会话强制下线、相关资产/数据访问记录、撤销流程。
- **invocation conditions**:A5 收到账号失陷告警 / 离职流程触发 / 越权行为告警。
- **dependencies**:A5 调度;SSO/AD/业务系统 MCP;A1 资产上下文。
- **failure handling**:账号不存在 → 跳过并记录;高权限账号(域管/SA) → 阻断执行并双签;封禁后业务系统不可用 → 告警 A0 + 业务。
- **security boundary**:**L0** 封禁预案;**L1** 普通账号自动封禁(可撤销);**L2** 高权限账号封禁需审批;**L3** 全员/大批量封禁必须双签 + 业务负责人确认。
- **reusability**:可被 A5 应急响应、A2 告警联动、A0 离职流程自动化、A4 个保法检查(违规账号清理)复用。

---

### 审计类(2 个)

#### S18 证据完整性
- **name**:evidence_integrity
- **purpose**:对 L1+ 操作的证据进行**原子化采集 + 完整性校验**(防篡改、链式 Hash 校验、签名验证、回放验证),形成不可篡改、不可静默修改的证据包。本 Skill 是 A6 QualitySteward 第 5 项职责"证据链完整性"的核心抓手,采集与校验并重,而非只采不验。
- **input**:目标主机/网络段/账号、操作动作 ID、采集范围(全量/最小)、**完整性校验级别**(基础/标准/强化)、上一次证据包 Hash 锚点。
- **output**:证据包(含链式 Hash、数字签名、时间戳)、**完整性校验报告**(通过/不通过 + 校验维度明细)、篡改告警(若有)、索引文件、存储路径(冷归档)、可回放指针(供 A6 反查)。
- **invocation conditions**:A5 隔离/封禁前必触发 / A6 质量治理抽样校验(主动)/ 监管要求取证 / **任何完整性校验失败时联动 A6 第 5 维度**。
- **dependencies**:A6 调度;EDR/流量 MCP;对象存储(冷归档,WORM 模式);PolarDB(append-only 索引);**S19 操作留痕(交叉验证锚点)**;时间戳服务(多源交叉)。
- **failure handling**:磁盘满 → 触发冷归档清理;Hash 计算失败 → 重试 3 次 + 告警;采集超时 → 标记"部分采集"并记录原因;**完整性校验失败(Hash 链断裂/签名无效/锚点不匹配)→ 立即告警 A6 + 启动反查 + 升级为 L3 处置,严禁静默重采覆盖**。
- **security boundary**:**L0** 采集只读 + 完整性校验只读;**L1** 自动对 L1+ 操作留痕 + 基础完整性校验;**L2** 完整镜像打包 + 强化校验需人机协同层中安全工程师(角色)审批;**L3** 涉及个人隐私/商业机密的证据采集必须法务(角色)审批;**任何完整性校验失败必须升级为 L3 处置,严禁自动重采覆盖**。
- **reusability**:可被 A5 响应证据固化、A2 告警溯源、A4 合规审计、A0 Leader 通报举证、A7 复盘素材、**A6 QualitySteward 第 5 维度证据链完整性主动校验** 复用。

#### S19 操作留痕
- **name**:operation_audit
- **purpose**:对 A0-A7 所有 L1+ 操作进行原子化留痕,链式 Hash 防篡改,支持回放。
- **input**:全平台操作流(来自 A0-A7)、操作员身份、操作上下文。
- **output**:留痕条目(链式 Hash + 操作员 + 时间 + 上下文)、审计报表、异常操作告警。
- **invocation conditions**:**自动触发** — 任何 L1+ 操作均强制留痕,无豁免。
- **dependencies**:A6 调度;append-only 数据库(PolarDB);Hash 链;时间戳服务。
- **failure handling**:写入失败 → 操作必须回滚(无痕=未发生);Hash 链断裂 → 告警 + 隔离 + 升级;时间戳服务异常 → 多源交叉校验。
- **security boundary**:**L0** 查询只读;**L1** 自动留痕不可关闭;**L2** 证据包导出需审批;**L3** 留痕删除/修改**严禁**(参考白皮书"不可自动化清单")。
- **reusability**:可被 A6 内审、A0 派单追溯、A4 合规审计、A7 复盘时间轴、外部审计举证复用。

---

### 知识类(2 个)

#### S20 复盘提炼
- **name**:postmortem_extract
- **purpose**:基于 A6 证据包 + A2 事件时间轴 + A5 响应记录,生成 Blameless Postmortem 复盘报告。
- **input**:事件 ID、证据包、响应时间线、各 Agent 自评、改进项 Action。
- **output**:复盘报告(时间线/根因/影响/改进项)、改进项跟踪表(纳入 A0 任务队列)、案例库标签。
- **invocation conditions**:A0 事件关闭后 24 小时内自动触发 / 人工指定复盘。
- **dependencies**:A7 调度;A6 证据包;RAG 历史复盘模板;团队 wiki 写入 MCP。
- **failure handling**:证据缺失 → 标记"待补"并暂停;模板加载失败 → 用简化模板;改进项无法落地 → 升级 A0。
- **security boundary**:**L0** 复盘草稿生成;**L1** 自动归档案例库(脱敏后);**L2** 含客户/员工真实信息需脱敏审批;**L3** 对外发布必须法务(角色)/管理层审批。
- **reusability**:可被 A7 复盘材料沉淀、A0 改进项落地、A4 合规自评(整改证据)、团队培训复用。

#### S21 Runbook 生成
- **name**:runbook_gen
- **purpose**:基于事件处理经验,自动生成/更新应急响应 Runbook(标准操作步骤 + 决策点 + 升级路径)。
- **input**:复盘报告、历史 Runbook、专家标注(可选)、流程变更通知。
- **output**:Runbook 草稿(版本号)、差异分析(diff)、评审 checklist、回滚到旧版本能力。
- **invocation conditions**:A7 例行更新 / 新事件类型首次出现 / Runbook 评审周期。
- **dependencies**:A7 调度;Runbook RAG;wiki MCP;版本管理。
- **failure handling**:模板冲突 → 走评审流程;变更影响范围广 → 强制评审;历史 Runbook 引用错误 → 标记"待人工核对"。
- **security boundary**:**L0** 草稿生成;**L1** 自动入草稿库;**L2** 正式版需 A7 + 业务负责人(角色)双签;**L3** 涉及合规/监管流程的 Runbook 变更必须法务(角色)审批。
- **reusability**:可被 A7 流程沉淀、A5 应急预演、A0 派单依据、新员工培训复用。

---

### 调度类(2 个)

#### S22 任务派工
- **name**:task_dispatch
- **purpose**:把待办任务按 Agent 能力、SLA、负载、优先级智能派发给对应 Agent。
- **input**:任务队列、Agent 能力画像、当前负载、SLA 约束、人机协同层值班角色表(不绑具体人)。
- **output**:派发指令(目标 Agent + Skill 链 + 优先级 + SLA)、派发理由、人工可干预接口。
- **invocation conditions**:**A0 Leader必触发** / 任务积压超阈值 / Agent 故障转移。
- **dependencies**:A0 Leader;AgentTeams 编排引擎;Nacos(Agent 能力注册);消息总线。
- **failure handling**:目标 Agent 不可用 → 降级到次选 Agent;SLA 冲突 → 优先级提升;负载不均 → 触发负载均衡重派。
- **security boundary**:**L0** 查询队列;**L1** 自动派发低风险任务;**L2** 灰度派发需审批任务(人机协同层安全工程师(角色));**L3** 高风险任务必须人机协同层多角色审批(安全工程师 + 业务负责人默认必签,涉合规/监管加法务 + 合规官)。
- **reusability**:可被 A0 全任务派发、A2 告警派单、A5 响应协同、A7 知识任务分配复用。

#### S23 升级关闭
- **name**:escalate_close
- **purpose**:对超时/失败/争议任务进行升级(到人机协同层对应角色)或关闭(确认无效/已解决)。
- **input**:任务 ID、状态变更原因、升级目标角色、关闭证据(误报确认/解决确认)。
- **output**:升级工单/关闭记录、SLA 统计、关闭原因分类、根因标签。
- **invocation conditions**:任务超时 50% / 连续失败 3 次 / 人工驳回 / 状态机进入终止态。
- **dependencies**:A0 Leader 调度;A6 留痕;IM 通道;人机协同层值班角色表(不绑具体人)。
- **failure handling**:升级目标角色不在线 → 升级到备审批角色(资产管理员/法务);关闭后反弹 → 自动重开;争议无仲裁 → 提交 A0 Leader 团队会议。
- **security boundary**:**L0** 状态查询;**L1** 自动关闭明显无效任务(留痕);**L2** 争议任务关闭需安全工程师(角色)确认;**L3** 重大事件关闭必须复盘完成 + 安全工程师(角色)签字。
- **reusability**:可被 A0 Leader 全任务生命周期、A2 告警关闭、A5 响应关闭、A4 合规整改闭环复用。

---

### 质量治理类(4 个,新增,归属 A6 QualitySteward)

> 4 个 Skill 共同覆盖 A6 的 7 大职责,缺一不可:
> - S24 覆盖职责 ① Agent 输出质量监控 + ⑦ 跨 Agent 一致性
> - S25 覆盖职责 ② Skill 偏差检测 + ③ 规则漂移监控
> - S26 覆盖职责 ④ RAG 知识库健康
> - S27 覆盖职责 ⑥ 自适应反馈(串联 ①+②+③+④+⑦,形成闭环)

#### S24 输出质量评估
- **name**:output_quality_eval
- **purpose**:对每个 Agent(A0-A5、A7)的输出做**实时质量评估**,覆盖 4 个维度:**幻觉检测**、**格式合规**(是否匹配 schema 模板)、**逻辑漏洞**、**事实准确性**(对照 RAG 检索结果作为事实基线);同时承担**跨 Agent 一致性**校验(同一事实在不同 Agent 输出中是否一致)。是 A6 第 ① + ⑦ 职责的核心 Skill。
- **input**:Agent 输出文本、输出 schema 模板、领域事实库(法规/漏洞/资产元数据)、RAG 检索 top-K 结果作为事实基线、跨 Agent 同一事件的多方判定。
- **output**:质量评分(0-1,7 维度分项)、问题分类标签(幻觉/格式/逻辑/事实/一致性)、严重性等级(低/中/高/阻断)、改进建议、改写后候选输出(供人机协同层选择)、跨 Agent 一致性矩阵。
- **invocation conditions**:**每个 Agent 输出后自动触发**(由 A6 编排);高风险任务(L2/L3 前置任务)输出后强制触发;A0 Leader 派单前质量门控。
- **dependencies**:A6 QualitySteward 调度;RAG 5 套知识库(事实基线);S25 偏差与漂移检测(辅助基线对比);LLM-as-Judge 模型池(多模型投票);A0-A5 输出归一化层。
- **failure handling**:评估模型超时 → 降级为关键词+格式规则快速校验;评分分歧(多模型投票不一致)→ 引入第三方模型 + 标记"高风险待人审";高风险输出评估失败 → **直接阻断派发** + 告警 A0 Leader。
- **security boundary**:**L0** 评估只读不修改原输出;**L1** 自动生成改写候选(不直接替换原 Agent 输出);**L2** 高风险输出质量未达 0.8 阈值 → 阻断派发 + 需人机协同层中安全工程师(角色)确认;**L3** 评估模型自身异常或评分严重分歧 → 切回规则引擎 + 升级 A0 Leader。
- **reusability**:可被 A0 Leader 派单前质量门控、A1-A5 全 Agent 输出评估、A7 复盘输入质量复盘、S25 漂移检测基线对比复用。

#### S25 偏差与漂移检测
- **name**:drift_detect
- **purpose**:检测 **Skill 输出与历史基线的偏差**(数据漂移 / 概念漂移)以及**安全规则与当前威胁态势的漂移**(规则漂移)。是 A6 第 ② + ③ 职责的核心 Skill。漂移指数 > 0.3 自动告警,> 0.6 建议回滚,> 0.8 强制升级。
- **input**:Skill 历史输出样本(基线窗口 7/30/90 天可选)、当前输出、威胁情报新特征(来自 KB-Vuln / KB-SupplyChain)、规则版本时间戳、近期事件时间轴。
- **output**:漂移指数(drift_score,0-1)、漂移维度分类(数据漂移 / 概念漂移 / 规则漂移 / 威胁态势漂移)、告警工单、回滚建议、新规则候选、A/B 评估结果。
- **invocation conditions**:A6 每日例行基线对比 / 重大事件后强制对比 / 规则版本更新后 24 小时内 / 威胁情报重大更新(KEV 新增/CVE 爆发)后。
- **dependencies**:A6 QualitySteward 调度;统计基线 RAG(PolarDB 历史表);KB-Vuln + KB-SupplyChain 威胁情报;S24 输出质量评估(辅助);A0 Leader 变更流程(回滚入口)。
- **failure handling**:基线样本不足(< 30 天)→ 退化为同类 Skill 横向对比;漂移检测模型异常 → 告警 + 切规则匹配兜底;新特征识别失败 → 升级 A0 Leader 走变更流程。
- **security boundary**:**L0** 检测只读;**L1** 漂移指数 > 0.3 自动告警(发 A0 Leader + A7);**L2** 漂移指数 > 0.6 建议回滚到上一稳定版本,需安全工程师(角色)审批;**L3** 涉及核心检测规则/合规规则变更必须安全工程师(角色) + 合规官(角色) + 业务负责人(角色)多签。
- **reusability**:可被 A2 检测规则漂移、A3 漏洞利用手法漂移、A5 响应策略漂移、A7 复盘根因、S26 RAG 健康(语料过期也算漂移的一种)复用。

#### S26 RAG 知识库健康
- **name**:rag_health_check
- **purpose**:监测 **5 套 RAG 知识库**(法规 KB-Compliance / 漏洞 KB-Vuln / Runbook KB-Runbook / 复盘 KB-Postmortem / 供应链 KB-SupplyChain)的健康度,识别过期语料、命中率下降、权威性风险、语料缺失,并给出补全建议。是 A6 第 ④ 职责的核心 Skill。
- **input**:RAG 检索日志(命中率 / 拒答率 / 反馈信号)、命中/未命中率、语料版本时间戳、来源权威性标签、用户反馈(来自 Agent 自评 + 人机协同层)、5 套 RAG 元数据表。
- **output**:知识库健康度评分(0-1,5 库分项)、过期语料清单(按"距今天数"排序)、命中率趋势图(7/30/90 天)、补全建议(新增条目 / 替换条目 / 权威源迁移)、权威性风险标签(法规/漏洞是否以原文为准)。
- **invocation conditions**:A6 每周例行 / 检索命中率连续 3 天下降 > 10% / 新发布法规(全国人大网/国务院公报)或新漏洞爆发(NVD/KEV)/ 人机协同层反馈"检索不准"。
- **dependencies**:A6 QualitySteward 调度;5 套 RAG 知识库元数据表;监管原文 MCP(全国人大/国务院/CISA/NVD);漏洞库 MCP(NVD + EPSS + KEV);Runbook MCP(团队 wiki);PolarDB 检索日志。
- **failure handling**:RAG 服务异常 → 切本地只读缓存并告警;补全数据源不可达 → 标记"待补" + 告警 A0 Leader;权威性冲突(同一事实多源不一致)→ 升级人机协同层中法务(角色)确认;法规条款严格以原文为准,严禁 AI 改写。
- **security boundary**:**L0** 监测只读;**L1** 补全建议自动生成(不直接改库,只生成待评审工单);**L2** 涉及法规/合规条款补全需法务(角色) + 合规官(角色)双签入库;**L3** 涉及监管原文必须以原文为准,严禁 AI 改写或摘要替代,所有改写必须标注"非原文"。
- **reusability**:可被 A4 合规自评(法规引用)、A3 漏洞验证(EPSS/KEV 关联)、A5 Runbook 决策依据、A7 复盘模板、S25 漂移检测基线、S27 自适应反馈输入 复用。

#### S27 自适应反馈
- **name**:adaptive_feedback
- **purpose**:把 A6 通过 S24/S25/S26 检测到的**输出质量缺陷、Skill 偏差、规则漂移、RAG 过期**等偏差,**反馈给 A0 Leader**,触发 Skill 升级/回滚/规则变更,是整个"Adaptive"闭环的最后一公里。没有 S27,A6 的发现就只能"看着",无法落地;S27 才是 Adaptive 的执行臂。是 A6 第 ⑥ 职责的核心 Skill,**直接呼应项目名中的"Adaptive"**。
- **input**:S24 输出质量报告、S25 漂移告警工单、S26 RAG 补全建议、Skill 版本管理表、影响面评估(涉及哪些 Agent / 多少在跑任务)、变更回滚预案。
- **output**:反馈工单(反馈给 A0 Leader,含优先级 + 建议动作 + 证据链)、Skill 升级包 / 回滚包(版本号 + diff + 影响面)、规则变更建议、A/B 评估结果(灰度对比)、变更落地跟踪表(自动跟 A0 任务队列联动)。
- **invocation conditions**:A6 检测到漂移指数持续 3 天 > 阈值 / 跨 Agent 一致性严重分歧 / RAG 命中连续 5 天 < 60% / 输出质量评分连续 24 小时 < 0.7 / 证据链完整性校验失败 1 次(立即触发)。
- **dependencies**:A0 Leader 调度(反馈对象);S24 / S25 / S26(输入源);Skill 版本管理 MCP;变更管理 MCP(A0 走变更流程);A7 复盘(变更后效果回流)。
- **failure handling**:反馈工单超时未响应 > 4 小时 → 升级 A0 Leader;Skill 回滚失败 → 标记"回滚受阻" + 升级安全工程师(角色);变更影响超预期(评估后指标下降)→ 自动回滚 + 启动 A7 复盘。
- **security boundary**:**L0** 反馈只读(只生成工单,不直接执行变更);**L1** 自动生成建议(发 A0 Leader 队列);**L2** 建议触发 Skill 升级/回滚必须 A0 Leader + 安全工程师(角色)双审;**L3** 涉及合规/监管规则变更必须法务(角色) + 合规官(角色) + 业务负责人(角色)多签,任何一项不通过则不落地。
- **reusability**:可被 A0 Leader 全任务自适应调度、S24/S25/S26 闭环、A7 复盘"自适应机制"案例化复用。

---

---

## 附录:L0-L3 安全分级总表

| 等级 | 含义 | 触发条件 | 谁执行 | 留痕要求 |
|---|---|---|---|---|
| L0 | 只读自动 | 查询/扫描/分析 | Agent | 留痕 |
| L1 | 低风险自动 | 已知 IOC 封禁/普通账号冻结/非破坏性探测 | Agent | 强制留痕(S19) |
| L2 | 灰度+审批 | 单主机隔离/高权限账号封禁/PoC 执行 | **人机协同层中安全工程师(角色)审批** + Agent 执行 | 强制留痕 + 审批单(记录角色,不绑具体人) |
| L3 | 仅规划必人工 | 关键业务隔离/全网封禁/数据回滚/对外报送 | **人机协同层多角色签字**(安全工程师 + 业务负责人默认必签;涉合规时加法务 + 合规官) | 强制留痕 + 多角色双签 + 复盘 |

> 备注:L2/L3 审批均通过人机协同层 IM/审批流路由到具体角色,不绑定具体人名;当安全工程师(角色)不可达时,自动升级到备审批角色(资产管理员/法务),由 A0 Leader 在派发阶段完成角色路由。

---

## 附录:5 套 RAG 知识库索引

> 5 套 RAG 知识库是 AegisTeam Adaptive 的"团队记忆"与"自适应"的语料底座;由 A6 QualitySteward 通过 S26 持续监测健康度,S27 触发补全;由 A0 Leader 统一调度检索。检索统一走 AgentTeams 编排下的 RAG 网关(Higress),召回 + 重排 + 注入上下文。

### 知识库总览

| 编号 | 名称 | 条数 | 数据源 | 主消费者 |
|---|---|---|---|---|
| KB-Compliance | 法规库 | ~1,800 | 全国人大 / 国务院 / 监管总局原文 + 行业基线 | A4 ComplianceGuard |
| KB-Vuln | 漏洞库 | ~285,000 | NVD + CNVD + CNNVD + EPSS + CISA KEV | A1 AssetManager / A3 VulnVerifier |
| KB-Runbook | Runbook 库 | ~2,400 | 团队历史复盘 Runbook + 公开应急响应手册 | A5 IncidentResponder / A7 KnowledgeWeaver |
| KB-Postmortem | 复盘库 | ~240 | 历史事件 Blameless Postmortem | A7 KnowledgeWeaver / A6 QualitySteward |
| **KB-SupplyChain** | **供应链安全知识库** | **~5,000** | **NVD + FIRST EPSS + CISA KEV + SPDX License List + CWE + 公开供应链攻击案例库** | **A1 AssetManager / A3 VulnVerifier / A4 ComplianceGuard** |

### KB-SupplyChain 详细设计(新增)

#### 1. 数据源(6 类,全部公开/可机读)
1. **NVD 漏洞库** —— 主键 CVE 编号,字段含 CVSS v3、cwe_id、vendor、product、published_date。
2. **FIRST.org EPSS API** —— 每日更新,字段含 epss_score(0-1,被利用概率)、epss_percentile。
3. **CISA KEV 目录** —— 已知被野外利用的漏洞,字段含 kev_status、kev_date_added、due_date。
4. **SPDX License List** —— 主流开源许可证清单,字段含 spdx_id、name、category(copyleft/permissive/proprietary)、compliance_risk 标签。
5. **CWE 数据库** —— 通用缺陷枚举,字段含 cwe_id、name、description、parent_of。
6. **公开供应链攻击案例库** —— 手工精选 30+ 经典案例(SolarWinds 2020 / Log4Shell 2021 / Confluence OGNL 2022 / Codecov 2021 / Kaseya 2021 / 3CX Desktop 2023 / xz-utils 后门 2024 等),字段含 case_id、name(year)、cve_ref、attack_vector、ttp、impact、lessons、runbook_ref。

#### 2. 数据结构(5 张主表,总 ~5,000 条)

##### 表 1:`cve_epss_kev` 主关联表(~3,800 条,占主)
- `cve_id`(主键,CHAR 16)
- `epss_score`(DECIMAL 5,4,0-1,被利用概率)
- `epss_percentile`(DECIMAL 5,2,0-100)
- `kev_status`(BOOLEAN,是否在 KEV)
- `kev_date_added`(DATE,加入 KEV 的日期)
- `kev_due_date`(DATE,联邦机构修复截止日)
- `cwe_id`(CHAR 10,关联 CWE)
- `cvss_v3_base`(DECIMAL 4,1)
- `cvss_v3_vector`(VARCHAR 128)
- `vendor`(VARCHAR 64)
- `product`(VARCHAR 128)
- `exploit_available`(BOOLEAN,公开 exploit 代码存在)
- `exploit_in_wild`(BOOLEAN,野外利用)
- `supply_chain_relevance`(ENUM,direct/indirect/none,直接被供应链引入/间接影响/无关)
- `introduced_via`(VARCHAR 128,如 npm 包名 / maven groupId / pip 库名)
- `last_updated`(TIMESTAMP,日级更新)

##### 表 2:`license_compliance` 开源许可证合规(~200 条)
- `spdx_id`(主键,如 GPL-3.0-only、Apache-2.0、MIT、AGPL-3.0)
- `name`(VARCHAR 128)
- `category`(ENUM,copyleft_strong / copyleft_weak / permissive / proprietary / public_domain)
- `compliance_risk`(ENUM,viral / weak_viral / permissive / unknown)
- `commercial_use_allowed`(BOOLEAN)
- `attribution_required`(BOOLEAN)
- `source_disclosure_required`(BOOLEAN)
- `patent_grant`(BOOLEAN,专利授权条款)
- `gpl_compatibility`(VARCHAR 32,与 GPL 兼容关系)
- `industry_restriction`(VARCHAR 256,行业限制说明,如 AGPL 限制 SaaS 提供)
- `case_study`(TEXT,典型合规案例 1-2 句话)

##### 表 3:`sbom_risk_template` SBOM 风险评估模板(~100 条)
- `template_id`(主键)
- `asset_type`(ENUM,web / mobile / container / iot / ot / saas)
- `scan_frequency`(ENUM,daily / weekly / monthly / on_release)
- `eol_lookahead_days`(INT,EOL 预警天数)
- `required_policies`(JSON,如 {"enforce_signature": true, "block_known_vuln": true})
- `compliance_framework`(VARCHAR 64,如等保 2.0 三级 / ISO 27001 / SOC 2)
- `risk_score_formula`(TEXT,风险评分公式,如 0.4×EPSS + 0.3×CVSS + 0.3×KEV)

##### 表 4:`supplier_assessment` 第三方供应商风险评估(~150 条)
- `supplier_id`(主键)
- `name`(VARCHAR 128)
- `risk_score`(DECIMAL 4,2,0-10)
- `assessment_date`(DATE)
- `controls_covered`(JSON,如 {"iso27001": true, "soc2": true, "sla_99.9": true})
- `last_audit_date`(DATE)
- `data_access_scope`(ENUM,metadata / content / pii / spi)
- `jurisdiction`(VARCHAR 32,司法管辖区,如 CN / EU / US)
- `incident_history`(JSON,历史安全事件)
- `sub_supplier_count`(INT,二级供应商数量)

##### 表 5:`attack_case` 供应链攻击案例(~30 条)
- `case_id`(主键,如 SC-2020-01 SolarWinds)
- `name`(VARCHAR 128)
- `year`(INT)
- `cve_ref`(VARCHAR 16,关联 cve_epss_kev 表)
- `attack_vector`(ENUM,build_system / dependency / update_channel / artifact / insider)
- `ttp`(JSON,MITRE ATT&CK 编号)
- `impact`(TEXT,1-2 句话)
- `lessons`(TEXT,1-2 句话)
- `runbook_ref`(VARCHAR 32,关联 KB-Runbook)
- `detection_signal`(TEXT,1-2 句话,如何被检测到)

#### 3. 检索方式(3 种组合)
- **向量检索**:基于 CVE 描述、攻击案例描述、许可证条款的语义相似度,embedding 模型 text-embedding-3-small(中英双语微调),召回 top-20 后重排 top-5。
- **元数据过滤**:按 vendor / product / license / cwe / kev_status / supply_chain_relevance 精确过滤,适合 A1 资产-SBOM 关联、A3 漏洞-EPSS 评分等结构化场景。
- **多表 JOIN 链**:`SBOM 组件 → license_compliance(许可证合规) → cve_epss_kev(漏洞 + EPSS + KEV) → supplier_assessment(供应商风险) → attack_case(类似案例)`,5 跳 JOIN,适合 A4 合规自评生成"组件级合规报告"。

#### 4. 主消费者
- **A1 AssetManager**:用 `cve_epss_kev` 做 SBOM 组件风险评估,用 `license_compliance` 做开源许可证合规初筛。
- **A3 VulnVerifier**:用 `cve_epss_kev` 给漏洞验证结论附加 EPSS 风险评分与 KEV 状态;用 `attack_case` 检索类似历史利用案例。
- **A4 ComplianceGuard**:用 `license_compliance` 做开源许可证合规检查(重点 GPL 传染条款);用 `supplier_assessment` 做第三方供应商风险评估;用 `sbom_risk_template` 生成 SBOM 风险评估模板。
- **A6 QualitySteward**(通过 S26 监测):监测 KB-SupplyChain 命中率和过期情况,EPSS 数据每日更新,KVE 每周检查,攻击案例按需新增。

#### 5. 更新机制
- **EPSS + KEV**:每日自动拉取增量,覆盖更新 `cve_epss_kev` 表(由 A0 Leader,走 MCP 工具调用 FIRST.org / CISA API)。
- **NVD**:每周增量同步,新 CVE 自动入库。
- **SPDX License List**:每季度同步一次官方版本。
- **attack_case**:由 A7 KnowledgeWeaver 手工新增 + 审核,任何新案例必须 A7 + A6 双签入库(参考 S26 严格入库流程)。

---

**文档结束。**

---

**文档结束。**
