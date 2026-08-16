# AegisTeam Adaptive — 自适应盾牌防御团队

> **8 个岗位化 Agent + 1 个灵活的人机协同层 = 1 支自适应增强的安全运营团队**
>
> 面向中小单位的自适应安全运营平台,基于 AgentTeams + Skill + MCP + RAG + 可观测五层架构。

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue)](https://www.python.org/)
[![AgentTeams](https://img.shields.io/badge/AgentTeams-hiclaw-orange)](https://higress.ai/hiclaw)
[![Nacos](https://img.shields.io/badge/Nacos-AI%20Registry-green)](https://nacos.io)

---

## 🎯 项目定位

AegisTeam Adaptive 是面向**中小单位**(年安全预算 < 50 万、专职安全 < 3 人)的安全运营平台。

**痛点**:80% 中小单位雇不起 50 人 SOC;叠加等保 2.0、数据安全法、个保法、生成式 AI 合规,告警误报率超 95%,人工响应 4 小时,远不及监管 30 分钟。

**方案**:把 SOC 八大岗做成 8 个岗位化 Agent(Leader / 资产 / 告警 / 漏洞 / 合规 / 响应 / 质量治理 / 复盘),配合 1 个灵活的人机协同层(Web 平台 / IM 通道),形成可自适应演进的虚拟安全运营团队。

**差异化**:
- ✅ 岗位化映射 SOC 协作模式
- ✅ 4 级风险分级(L0-L3)+ 双审批关口(H1/H2)严守"不可自动化清单"
- ✅ **A6 QualitySteward 自适应引擎**让系统"自适应"(无 A6 则不构成 Adaptive)
- ✅ AgentTeams + Skill + MCP + RAG + 可观测 五层架构可轻松复现

---

## 🧩 5 大评审维度自检

| 维度 | 权重 | 关键指标 | 状态 |
|---|---|---|---|
| **场景价值** | 25% | 80%/50 万/95%/4h 痛点量化;8 岗位 + 1 人机协同层 | ✅ |
| **多 Agent 协同** | 25% | 3 编排流(22+26+14 步);每条调动 6-7 Agent;H1/H2 双审批;AgentLoop 调度 | ✅ |
| **Skill 工程** | 25% | **27 个 Skill** 覆盖 9 大类;严格 Skill.md 模板;版本化 + 迭代痕迹 | ✅ |
| **工程落地** | 20% | 5 RAG(294,440 条) + 6 MCP mock + 16 指标 + 10 区大屏 + L0.5 人机协同层 | ✅ |
| **开源** | 5% | Apache 2.0;提供完整 mock 剧本 + 部署文档 + Roadmap | ✅ |

---

## 🏗 架构总览

```
┌────────────────────────────────────────────────────────────────────┐
│                  AegisTeam Adaptive 5 层架构                        │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ L1  Team 编排层(AgentTeams / hiclaw)                     │    │
│  │   TeamLeader `aegisteam-leader` (A0)                     │    │
│  │   AgentLoop 调度:max_iterations=5, max_parallel=3         │    │
│  └──────────────────────────────────────────────────────────┘    │
│                              │                                     │
│  ┌───────────────────────────▼───────────────────────────────┐    │
│  │ L2  Agent 层(8 个岗位化 Agent)                            │    │
│  │   A0 Leader  A1 资产  A2 告警  A3 漏洞  A4 合规            │    │
│  │   A5 响应    A6 质量治理  A7 复盘                          │    │
│  │   (A6 = Adaptive 引擎)                                    │    │
│  └───────────────────────────────────────────────────────────┘    │
│                              │                                     │
│  ┌───────────────────────────▼───────────────────────────────┐    │
│  │ L3  Skill 层(27 个 Skill,9 大类)                          │    │
│  │   编排 4 + 资产 4 + 检测 4 + 漏洞 4 + 合规 4 + 响应 3     │    │
│  │   质量 4(由 A6 独占)                                     │    │
│  └───────────────────────────────────────────────────────────┘    │
│                              │                                     │
│  ┌───────────────────────────▼───────────────────────────────┐    │
│  │ L4  工具层(6 类 MCP + 5 套 RAG)                           │    │
│  │   MCP: CMDB / SBOM / SIEM / Vuln Scanner / TI / Notify    │    │
│  │   RAG: KB-Compliance 1800 + KB-Vuln 285000 +              │    │
│  │        KB-Runbook 2400 + KB-Postmortem 240 +              │    │
│  │        KB-SupplyChain 5000 = 294,440 条                   │    │
│  └───────────────────────────────────────────────────────────┘    │
│                              │                                     │
│  ┌───────────────────────────▼───────────────────────────────┐    │
│  │ L0.5 人机协同层(双模式)                                   │    │
│  │   Web 平台模式: AegisConsole(角色化协同)                  │    │
│  │   IM 通道模式: 钉钉/企微/飞书/SMTP(无平台时推送)          │    │
│  └───────────────────────────────────────────────────────────┘    │
│                              │                                     │
│  ┌───────────────────────────▼───────────────────────────────┐    │
│  │ L5  可观测层(16 指标 + 10 区大屏)                         │    │
│  │   12 通用 + 4 A6 专项(质量分/偏差告警/漂移告警/自适应反馈)│    │
│  └───────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 快速开始(5 步)

### 1. 准备运行机器

```bash
# 检查依赖
python3 --version    # 需 3.10+
docker --version     # AgentTeams 需要 Docker
```

### 2. 启动 Mock 工具网关

```bash
python3 tools/mock_tool_server.py --host 0.0.0.0 --port 18090
```

### 3. 验证 Mock 工具

```bash
curl http://127.0.0.1:18090/health
curl http://127.0.0.1:18090/scenarios
curl -X POST http://127.0.0.1:18090/tools/alert_brute_force/mock_siem.get_alert \
  -H 'Content-Type: application/json' \
  -d '{"alert_id": "ALERT-2001"}'
```

期望 3 个场景:`alert_brute_force` / `regulator_notice` / `new_regulation`

### 4. 安装 AgentTeams

```bash
bash <(curl -sSL https://higress.ai/hiclaw/install.sh)
```

按安装器引导完成 LLM/API Key/端口/运行时配置。**关键配置**:
- Manager/Worker 运行时:`qwenpow`(copow / QwenPaw)
- 禁用 Matrix E2EE(初赛)
- 启用 Docker API 安全代理

### 5. 创建 Team + 发送事故任务

详细步骤见 [at/AGENTTEAMS_RUNBOOK.md](at/AGENTTEAMS_RUNBOOK.md)

---

## 📁 目录结构

```
aegisteam-adaptive/
├── README.md                          # 本文件
├── LICENSE                            # Apache 2.0
├── docker-compose.yml                 # 一键启动(mock 网关 + element-web + nacos mock)
├── PUSH.md                            # 推送到 GitHub 的指南
├── docs/                              # 5 份方案文档
│   ├── 00-main.md                     # 主入口(V1.2)
│   ├── 01-agents-and-skills.md        # 8 Agent + 27 Skill
│   ├── 02-orchestration.md            # 3 编排流 + Mock 剧本
│   ├── 03-presentation-materials.md   # 18 页 PPT 大纲
│   └── 04-infrastructure.md           # 5 RAG + 6 MCP + 16 指标
├── at/                                # AgentTeams 协议
│   ├── AgentTeam.md                   # 团队拓扑
│   ├── AGENTTEAMS_RUNBOOK.md          # 7 步运行手册
│   ├── create_agents_messages.md      # 7 Worker + 1 Team 创建脚本
│   ├── run_demo_task_message.md       # 3 条事故任务
│   ├── team_spec.json                 # 团队 JSON
│   ├── nacos_registry_mock.json       # Nacos Registry mock(复赛)
│   └── agentteams.env.example         # 环境变量样例
├── agents/                            # 8 AgentSpec
│   ├── a0_leader/Agent.md
│   ├── a1_asset_manager/Agent.md
│   ├── a2_threat_detector/Agent.md
│   ├── a3_vuln_verifier/Agent.md
│   ├── a4_compliance_guard/Agent.md
│   ├── a5_incident_responder/Agent.md
│   ├── a6_quality_steward/Agent.md
│   └── a7_knowledge_weaver/Agent.md
├── skills/                            # 27 SKILL.md
│   ├── s01_incident_routing/SKILL.md
│   ├── ...
│   └── s27_adaptive_feedback/SKILL.md
├── tools/                             # Mock 工具网关
│   ├── mock_tool_server.py            # 主服务器(端口 18090)
│   ├── mock_tools.py                  # 6 类 MCP mock 实现
│   ├── tool_catalog.json              # 工具目录
│   ├── MCP_MAPPING.md                 # MCP 映射说明
│   └── __init__.py
├── scenarios/                         # 3 场景 JSON
│   ├── alert_brute_force.json
│   ├── regulator_notice.json
│   └── new_regulation.json
├── web/                               # Web 端 demo 前端(React + Vite)
│   └── README.md
├── ppt/                               # 18 页 PPT
│   ├── AegisTeam-Adaptive-18pages.md
│   └── AegisTeam-Adaptive-18pages.pdf
└── scripts/                           # 工具脚本
    └── build_submission.sh            # 压缩包打包脚本
```

---

## 🧠 8 个岗位化 Agent

| ID | 角色 | 核心职责 | 关键 Skill | 风险权限 |
|---|---|---|---|---|
| **A0 Leader** | TeamLeader | AgentLoop 调度、编排流选择、证据链、审批路由 | S01-S04 | L0-L3 |
| A1 AssetManager | 资产管理员 | 资产画像、SBOM、组件-漏洞关联 | S05-S08 | L0 |
| A2 ThreatDetector | 告警分析师 | 告警聚合、IOC 富化、攻击模式识别 | S09-S12 | L0-L1 |
| A3 VulnVerifier | 漏洞验证 | CVE 5.0+EPS+KEV 三段式、修复建议 | S13-S16 | L0 |
| A4 ComplianceGuard | 合规管理 | 法规检索、新法规 diff、PIA 评估、审批路由 | S17-S20 | L0-L1 |
| A5 IncidentResponder | 应急响应 | 修复计划、风险分级、L1 自动执行、审批计划 | S21-S23 | L0-L1 |
| **A6 QualitySteward** | 质量治理(Adaptive 引擎) | 输出质量、Skill 偏差、规则漂移、RAG 健康、证据链、**自适应反馈**、跨 Agent 一致性 | S24-S27 | L0 |
| A7 KnowledgeWeaver | 复盘知识织造 | 复盘报告生成、RAG 知识回写、改进项跟踪 | (与 A6 联动) | L0 |

> **注**:A6 是 AegisTeam "Adaptive" 的核心引擎,缺失则不构成 Adaptive。

---

## 🔧 6 类 MCP 工具

| 工具 | 函数 | 真实产品参考 | 复赛替换 |
|---|---|---|---|
| `mock_cmdb` | get_asset, list_assets | 阿里云 CMDB、ServiceNow | cmdb-mcp |
| `mock_sbom` | get_components, scan_vulnerabilities | Anchore、FOSSA、Snyk | sbom-mcp |
| `mock_siem` | search_events, get_alert | Splunk ES、QRadar、奇安信 NDR、阿里云云安全中心 | siem-mcp |
| `mock_vuln_scanner` | scan_target, get_cve_info | Nessus、Qualys、绿盟、启明星辰 | vuln-mcp |
| `mock_threat_intel` | query_ioc, lookup_malware | 微步在线、奇安信 TI、VirusTotal、OTX | ti-mcp |
| `mock_notify` | send_message, list_channels | 钉钉、企微、飞书、SMTP | notify-mcp |

数据格式:
- **SIEM 事件**:CEF(Common Event Format)扩展字段
- **SBOM 组件**:CycloneDX 1.5
- **漏洞**:CVE 5.0 + EPSS + CISA KEV 三段式
- **威胁情报**:STIX 2.1 风格
- **通知消息**:Markdown + 卡片

---

## 🗃 5 套 RAG 知识库(共 294,440 条)

| 知识库 | 条目数 | 用途 | 数据源 |
|---|---|---|---|
| KB-Compliance | 1,800 | 法规检索、PIA 模板 | 等保 2.0、个保法、数据安全法、生成式 AI 办法等 |
| KB-Vuln | 285,000 | 漏洞库 | NVD + CNVD + GitHub Advisory + EPSS + CISA KEV |
| KB-Runbook | 2,400 | 应急响应 Runbook | 内部积累 + NIST 800-61 + SANS PICERL |
| KB-Postmortem | 240 | 历史复盘 | 内部复盘案例(脱敏) |
| **KB-SupplyChain** | **5,000** | **供应链安全** | **SBOM 风险组件 + 许可证合规 + 国产化替代清单** |

---

## 🔀 3 条编排流

| 编排流 | 触发场景 | 涉及 Agent | 步骤数 | 风险分级 |
|---|---|---|---|---|
| **Flow 1 告警流** | `alert_brute_force` | A0 + A1 + A2 + A3 + A5 + A6 | 22 | L2 |
| **Flow 2 监管通报流** | `regulator_notice` | A0 + A1 + A3 + A4 + A5 + A6 | 26 | L3(三审) |
| **Flow 3 新法规响应流** | `new_regulation` | A0 + A1 + A3 + A4 + A5 + A6 + A7 | 14(管理+技术双路) | L3(三审) |

---

## 🛡 L0-L3 风险分级 + 双审批关口

| 等级 | 含义 | 自动执行 | 审批门控 |
|---|---|---|---|
| L0 | 只读取证、查询、检索 | ✅ | 无 |
| L1 | 阻断 IP、关闭告警、禁用默认账户 | ✅(经 A0 串行确认) | H1 事后告知 |
| L2 | 升级组件、调整配置、灰度发布 | ❌ | H1(事实确认)+ H2(执行审批) |
| L3 | 修改管理办法、数据出境、算法备案、强制隔离 | ❌ | H1 + H2 + 业务负责人(角色)三审 |

**不可自动化清单**(A6 强制校验):
- ❌ 任何对生产数据库的 DDL
- ❌ 任何对核心系统的强制隔离/下线
- ❌ 任何对外公开的合规承诺
- ❌ 任何对用户数据的删除/批量脱敏
- ❌ 任何对算法模型的重新训练/下线

---

## 📊 16 核心指标 + 10 区大屏

### 16 核心指标(12 通用 + 4 A6 专项)

| 类别 | 指标 |
|---|---|
| 流量 | 对话数 / 会话数 / 事故数 |
| 性能 | 端到端时延 / TTFT |
| 成本 | Token 消耗(分 Worker) |
| 可靠性 | Tool 成功率 / 审批通过率 / 重跑率 |
| 协同 | 跨 Worker 调用次数 / 证据链完整度 |
| 告警 | 严重告警数 / 误报率 |
| **A6 专项** | **agent_output_quality_score** / **skill_deviation_alert_total** / **rule_drift_alert_total** / **adaptive_feedback_triggered_total** |

### 10 区大屏(基于 AgentScope Studio + AgentLoop)

1. 实时告警流
2. 事故处理时间线
3. 资产健康度
4. 漏洞与威胁情报
5. 合规状态
6. 审批工作流
7. 性能与成本
8. 复盘知识沉淀
9. **A6 自适应健康度**(质量分/偏差/漂移/RAG 健康)
10. **人机协同接入态**(Web/IM 模式、角色化路由)

---

## 🌐 L0.5 人机协同层(双模式)

| 模式 | 适用场景 | 角色化路由 | 技术栈 |
|---|---|---|---|
| **Web 平台模式** | 有 AegisConsole 部署 | 安全工程师/合规官/资产管理员/DBA/业务负责人多角色协同 | React + Vite + TailwindCSS |
| **IM 通道模式** | 无平台时 | 钉钉/企微/飞书/SMTP 卡片推送,按角色路由 | mock_notify MCP |

**L0.5 的关键设计**:
- 7 个角色化岗位(安全工程师/合规官/资产管理员/DBA/业务负责人/值班 SRE/法务)
- 按风险等级路由不同角色(L0 无审批 / L1 H1 事后告知 / L2 H1+H2 / L3 三审)
- 同一角色可在不同模式间切换(Web 优先,IM 兜底)

---

## 📡 初赛 → 复赛:内联 → Nacos Registry

初赛阶段,所有 Prompt/Skill/AgentSpec **内联**在 `at/create_agents_messages.md` 中(Worker 不读宿主机文件)。

复赛阶段,Skill/AgentSpec 注册到 **Nacos AI Registry** + 灰度发布:

```
┌──── 内联(初赛)────┐    ┌──── Nacos Registry(复赛)────┐
│ at/create_agents_ │    │                              │
│   messages.md     │    │  Nacos AI Registry          │
│   内联 Prompt/    │──→ │  ┌────────────────────┐    │
│   Skill/AgentSpec │    │  │ Skill Registry    │    │
└───────────────────┘    │  │  - s01..s27        │    │
                        │  │  - version/tag     │    │
                        │  └─────────┬──────────┘    │
                        │            │ 灰度发布       │
                        │            ▼                │
                        │  ┌────────────────────┐    │
                        │  │  加载(Skill       │    │
                        │  │  Loader by tag)   │    │
                        │  └─────────┬──────────┘    │
                        │            │                │
                        │            ▼                │
                        │  Worker 调用 → MCP 工具     │
                        │            │                │
                        │            ▼                │
                        │  回滚(版本回退 + 重新加载)   │
                        └─────────────────────────────┘
```

**全链路**:内联 → Nacos 注册 → 灰度(1% → 50% → 100%)→ 加载(Skill Loader)→ 调用(MCP)→ 回滚(质量异常时)

PPT 第 8-9 页将明确画出此全链路。

---

## 📚 文档索引

| 文档 | 链接 | 用途 |
|---|---|---|
| 主文档(V1.2) | [docs/00-main.md](docs/00-main.md) | 评审第一入口 |
| 8 Agent + 27 Skill | [docs/01-agents-and-skills.md](docs/01-agents-and-skills.md) | 角色与技能矩阵 |
| 3 编排流 + Mock 剧本 | [docs/02-orchestration.md](docs/02-orchestration.md) | 18 步时间线 |
| 18 页 PPT + GitHub 结构 | [docs/03-presentation-materials.md](docs/03-presentation-materials.md) | 答辩 PPT 大纲 |
| 5 RAG + 6 MCP + 16 指标 | [docs/04-infrastructure.md](docs/04-infrastructure.md) | 工程底座 |
| AgentTeam 拓扑 | [at/AgentTeam.md](at/AgentTeam.md) | 团队结构 |
| 运行手册 | [at/AGENTTEAMS_RUNBOOK.md](at/AGENTTEAMS_RUNBOOK.md) | 7 步运行 |
| 创建脚本 | [at/create_agents_messages.md](at/create_agents_messages.md) | 复制到 Manager |
| 事故任务 | [at/run_demo_task_message.md](at/run_demo_task_message.md) | 3 条事故 |
| MCP 映射 | [tools/MCP_MAPPING.md](tools/MCP_MAPPING.md) | Mock → 真实 MCP |
| 18 页 PPT | [ppt/AegisTeam-Adaptive-18pages.md](ppt/AegisTeam-Adaptive-18pages.md) | Markdown 草稿 |
| Web 端 Demo | [web/](web/) | React + Vite |

---

## 🛣 Roadmap

| 阶段 | 时间 | 关键能力 |
|---|---|---|
| v1.0(初赛) | 2026-08 | 8 Agent + 27 Skill + 5 RAG + 6 MCP + 3 编排流(本仓库) |
| v1.1(初赛+) | 2026-09 | Web 端 demo 前端完整版 + 视频 |
| **v1.2(复赛)** | **2026-10** | **Nacos AI Registry 接入 + Skill 灰度发布 + 多模态告警(图片/音频)** |
| v1.3(复赛+) | 2026-12 | SIEM/SOAR 真实接入 + 跨团队协同(HR/财务/法务) |
| v2.0(生产) | 2027-H1 | Adaptive Engine 自学新攻击手法(基于反馈历史) |

---

## 🌟 创新点总结

1. **岗位化映射**:8 个 Agent 对应 SOC 八大岗,贴真实协作模式
2. **人机协同层**:L0.5 双模式(Web/IM)解决中小单位无平台困境
3. **A6 QualitySteward**:7 大职责让系统真正"自适应"(核心创新)
4. **管理+技术双路**:Flow 3 新法规响应调动 7 Agent,管理+技术并行
5. **角色化审批**:7 个角色岗位映射不同风险等级,严守不可自动化清单
6. **Nacos AI Registry 全链路**:初赛内联 → 复赛注册 → 灰度 → 加载 → 调用 → 回滚
7. **5 RAG 协同**:294,440 条,跨法规/漏洞/Runbook/复盘/供应链

---

## 👥 团队

3 人小团队,**10 年安全运营 + 2 年大模型** 经验。

- 安全运营专家(主导):10 年甲方安全运营,熟悉等保/SOC/合规
- LLM 应用工程师:2 年大模型应用,熟悉 Agent/MCP/RAG 工程化
- 前端工程师:React + 可视化,负责 AegisConsole 与 10 区大屏

---

## 📜 License

本项目采用 **Apache License 2.0** 开源,详见 [LICENSE](LICENSE)。

允许商业使用、修改、分发,但需保留版权声明与许可证副本。

---

## 🙏 致谢

- 阿里云 Higress / hiclaw(AgentTeams 运行时)
- Nacos AI Registry(复赛路径)
- 阿里云 / 奇安信 / 微步在线 / VirusTotal(真实产品参考)
- 基线 demo:`opspilot-zero-demo`(AIOps 场景,我们扩展到安全运营)
- Anthropic / Claude(本仓库的代码编写与文档撰写)
