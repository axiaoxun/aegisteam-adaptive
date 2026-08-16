# AegIsLoop Adaptive

**自适应 AI 安全运营团队** —— 8 个岗位化安全 Agent +1 个人机协同层= 7×24自适应 AI 安全运营团队。

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-v1.0.0-blue)](https://github.com/axiaoxun/aegisteam-adaptive/releases/tag/v1.0.0)
[![AgentTeams](https://img.shields.io/badge/AgentTeams-hiclaw-orange)](https://higress.ai/hiclaw)
[![Nacos](https://img.shields.io/badge/Nacos-AI%20Registry-green)](https://nacos.io)

***

## 为什么做这个项目

大部分政府事业单位与中小企业,每年安全预算不足 50 万、专职安全人员不足 3 人,却要同时面对两座大山:

- **日益严峻的威胁**:高频攻击、暴力破解、勒索、数据出境……
- **不断叠加的合规**:等保 2.0、数据安全法、个保法、生成式 AI 管理办法……

预算与人员的双重缺口,把它们卡在四个死结上:**守不住**(无法 24 小时值守)、**来不及**(告警来不及快速响应)、**讲不通**(多方协同不便捷)、**落不下**(合规制度难落地)。

市面上的 AI SOC 产品把「告警降噪」做到了极致,但本质只是一个更聪明的告警面板——降噪之后,被监管通报、被要求整改、新法规落地,依然要靠人。**AegIsLoop 想补上的,正是这缺失的一半:合规 + 自进化。**

***

## 界面预览 / 功能演示

以下截图覆盖 **AgentTeam 协作运行 → Dashboard 总览 → Platform 人机协同平台** 三大部分，可直接证明项目可运行、可观测、可人机协同。

### AgentTeam 多 Agent 协作运行

AegIsLoop 基于 [AgentTeams / hiclaw](https://higress.ai/hiclaw) 运行，支持一键创建 Team、自动拉起 7 个业务 Worker，并通过 A0 TeamLeader 组织开展事件处置、完成合规判定与交付。

| 截图                                                           | 说明                                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------------------ |
| ![AgentTeam 创建完成](/docs/screenshots/agentteam%20\(2\).png) | Team 创建成功，7 个业务 Worker 全部 Running，使用 `deepseek-v4-flash` 模型              |
| ![AgentTeam 团队信息](/docs/screenshots/agentteam%20\(3\).png) | 团队拓扑与使用方式：TeamLeader 指定规则、支持独立创建与指定 leader                               |
| ![监管通报 Flow2 执行](/docs/screenshots/agentteam%20\(4\).png)  | 监管通告处理：R-001 认证口令 / R-002 数据出境 / R-003 PIA 评估，触发整改要求                     |
| ![项目状态报告](/docs/screenshots/agentteam%20\(5\).png)         | 整改项目状态跟踪：T01 资产核查 → T02 漏洞验证 → T03 合规分析 → T04 整改方案 → T05 质量把关 → T06 整改合成 |
| ![完成总结](/docs/screenshots/agentteam%20\(1\).png)           | 核心合规判定与交付物：合规差距分析报告、PIA 报告、证据链                                           |

### Platform 人机协同平台

L0.5 人机协同层提供 Web 工作台 + IM 通道双模式，覆盖 **场景编排 → Agent 指挥台 → 审批中心 → 任务中心 → 集成设置** 全流程。

| 截图                                                     | 说明                                                                                                   |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| ![工作台](/docs/screenshots/platform%20(3).png) | 主管工作台：；MTTD 4.2m / MTTR 1.8m / 自动闭环率 73.4% / 误报率 6.2%；下方展示 Agent 团队在线状态、进行中的编排进度、最近动态 |
| ![Agent 指挥台](/docs/screenshots/platform%20(4).png) | Agent 指挥台：列出 A0-A7 各 Agent 角色与状态（在线/静默中/待命）；包括 A0 TeamLeader 对话窗口，可通过群聊与团队沟通，也可以灵活的单独使用各agent能力|
| ![审批中心](/docs/screenshots/platform%20\(5\).png)      | 高风险动作审批：L1/L2/L3 分级，支持通过/驳回/回复，审批流水可追溯|
| ![任务中心](/docs/screenshots/platform%20(6).png) | 任务中心：支持主动下发任务表单；右侧任务列表，可查看自动生成事件和其他任务（INC-2002、INC-2001、《生成式AI办法》合规改造等）的处置状态与进度条 |
| ![场景查看](/docs/screenshots/platform%20\(1\).png)      | 可视化查看安全事件处置进度：告警 / 监管通报 / 新法规响应，支持管理+技术双路                                                            |
| ![集成与设置](/docs/screenshots/platform%20\(2\).png) | 支持IM通道接入（钉钉/飞书/企微），可配置相关业务流和人员于群聊的映射关系，查看MCP 工具、RAG 知识库配置                              |

### Dashboard 总览

Web 端 Dashboard 提供 **16 核心指标 + 10 区大屏**，实时展示 RAG 知识库健康度、编排进度、Agent 覆盖情况、Nacos AI Registry 状态。

| 截图                                                           | 说明                                                                                       |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| ![Dashboard 总览 2](/docs/screenshots/dashboard%20\(2\).png) | 实时总览：Agent 协作矩阵、TeamLeader 7x24 在线、Skill 使用率 99.3%、MCP 工具 6/6 正常                         |
| ![Dashboard 总览 1](/docs/screenshots/dashboard%20\(1\).png) | 详细总览：RAG 知识库 294,440 条 / 事件处置进度 最多同时查看3条处置链路 / Agent 覆盖 8/8 / Nacos Registry 32/32 Skill |

***

## 它是什么

AegIsLoop Adaptive 把真实公司安全团队的 8 个岗位抽象成 8 个岗位化 Agent,配合一个人机协同层(L0.5)和一个自适应引擎(A6),形成一支会协同、可治理、能自我进化的安全运营团队。

> **别人给你一个更聪明的告警面板,AegIsLoop 给你一支会合规、会举一反三、会自我进化的安全运营团队。**

### 五层架构

```
┌────────────────────────────────────────────────────────────────────┐
│                  AegIsLoop Adaptive 5 层架构                       │
│  L1  Team 编排层  AgentTeams / hiclaw · A0 TeamLeader              │
│  L2  Agent 层     8 个岗位化 Agent(A0-A7)                          │
│  L3  Skill 层     32 个 Skill(编排4/资产4/检测4/漏洞4/              │
│                    合规4/响应3/质量4/复盘5)                         │
│  L4  工具层       6 类 MCP + 5 套 RAG(294,440 条)                   │
│  L0.5 人机协同层   Web 平台 / IM 通道 双模式                         │
│  L5  可观测层      16 指标 + 10 区大屏 + Nacos AI Registry          │
└────────────────────────────────────────────────────────────────────┘
```

***

## 核心特性

- **8 岗位化 Agent** —— 映射真实 SOC 协作模式(Leader / 资产 / 告警 / 漏洞 / 合规 / 响应 / 质量 / 复盘)
- **32 个可复用 Skill** —— 版本化、带迭代痕迹、支持灰度发布与回滚
- **3 条端到端编排流** —— 告警 / 监管通报 / 新法规,共 62 步可回放
- **L0-L4 风险分级 + H1/H2 审批** —— 低风险自动闭环,高风险必审批、可追溯
- **A6 自适应引擎** —— 输出质量评分、Skill 漂移检测、RAG 健康、自适应反馈回滚
- **证据链锚定** —— 每个结论附 `evidence_id`,可追溯到原始证据
- **Apache 2.0 全栈开源** —— 可私有化部署,数据不出单位

***

## 快速开始

### 1. 准备运行机器

```bash
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

### 5. 创建 Team + 发送事故任务

详细步骤见 [at/AGENTTEAMS\_RUNBOOK.md](at/AGENTTEAMS_RUNBOOK.md)

***

## 8 个岗位化 Agent

| ID                    | 角色                | 核心职责                          | 关键 Skill | 风险权限  |
| --------------------- | ----------------- | ----------------------------- | -------- | ----- |
| **A0 Leader**         | TeamLeader        | 调度、编排流选择、证据链、审批路由             | S01-S04  | L0-L3 |
| A1 AssetManager       | 资产管理员             | 资产画像、SBOM、组件-漏洞关联             | S05-S08  | L0    |
| A2 ThreatDetector     | 告警分析师             | 告警聚合、IOC 富化、攻击模式识别            | S09-S12  | L0-L1 |
| A3 VulnVerifier       | 漏洞验证              | CVE 5.0 + EPSS + KEV 三段式、修复建议 | S13-S16  | L0    |
| A4 ComplianceGuard    | 合规管理              | 法规检索、新法规 diff、PIA 评估、审批路由     | S17-S20  | L0-L1 |
| A5 IncidentResponder  | 应急响应              | 修复计划、风险分级、L1 自动执行             | S21-S23  | L0-L1 |
| **A6 QualitySteward** | 质量治理(Adaptive 引擎) | 输出质量、Skill 漂移、RAG 健康、自适应反馈    | S24-S27  | L0    |
| A7 KnowledgeWeaver    | 复盘知识织造            | 复盘报告、RAG 知识回写、改进项跟踪           | S28-S32  | L0    |

> **A6 是 AegIsLoop「Adaptive」的核心引擎,缺失则不构成 Adaptive。**

***

## 6 类 MCP 工具

| 工具                  | 函数                                     | 真实产品参考                   | 可替换为       |
| ------------------- | -------------------------------------- | ------------------------ | ---------- |
| `mock_cmdb`         | get\_asset, list\_assets               | 阿里云 CMDB、ServiceNow      | cmdb-mcp   |
| `mock_sbom`         | get\_components, scan\_vulnerabilities | Anchore、FOSSA、Snyk       | sbom-mcp   |
| `mock_siem`         | search\_events, get\_alert             | Splunk ES、QRadar、奇安信 NDR | siem-mcp   |
| `mock_vuln_scanner` | scan\_target, get\_cve\_info           | Nessus、Qualys、绿盟         | vuln-mcp   |
| `mock_threat_intel` | query\_ioc, lookup\_malware            | 微步在线、奇安信 TI、VirusTotal   | ti-mcp     |
| `mock_notify`       | send\_message, list\_channels          | 钉钉、企微、飞书、SMTP            | notify-mcp |

数据格式:SIEM 事件(CEF)、SBOM 组件(CycloneDX 1.5)、漏洞(CVE 5.0 + EPSS + CISA KEV)、威胁情报(STIX 2.1)、通知(Markdown + 卡片)。

***

## 5 套 RAG 知识库(共 294,440 条)

| 知识库            | 条目数     | 用途           | 数据源                                            |
| -------------- | ------- | ------------ | ---------------------------------------------- |
| KB-Compliance  | 1,800   | 法规检索、PIA 模板  | 等保 2.0、个保法、数据安全法、生成式 AI 办法等                    |
| KB-Vuln        | 285,000 | 漏洞库          | NVD + CNVD + GitHub Advisory + EPSS + CISA KEV |
| KB-Runbook     | 2,400   | 应急响应 Runbook | NIST 800-61 + SANS PICERL                      |
| KB-Postmortem  | 240     | 历史复盘         | 内部复盘案例(脱敏)                                     |
| KB-SupplyChain | 5,000   | 供应链安全        | SBOM 风险组件 + 许可证合规 + 国产化替代清单                    |

***

## 3 条编排流

| 编排流           | 触发场景                | 涉及 Agent                         | 步骤数         | 风险分级   |
| ------------- | ------------------- | -------------------------------- | ----------- | ------ |
| Flow 1 告警流    | `alert_brute_force` | A0 + A1 + A2 + A3 + A5 + A6      | 22          | L2     |
| Flow 2 监管通报流  | `regulator_notice`  | A0 + A1 + A3 + A4 + A5 + A6      | 26          | L3(三审) |
| Flow 3 新法规响应流 | `new_regulation`    | A0 + A1 + A3 + A4 + A5 + A6 + A7 | 14(管理+技术双路) | L3(三审) |

***

## 风险分级 + 审批关口

| 等级 | 含义                    | 自动执行         | 审批门控               |
| -- | --------------------- | ------------ | ------------------ |
| L0 | 只读取证、查询、检索            | ✅            | 无                  |
| L1 | 阻断 IP、关闭告警、禁用默认账户     | ✅(经 A0 串行确认) | H1 事后告知            |
| L2 | 升级组件、调整配置、灰度发布        | ❌            | H1(事实确认)+ H2(执行审批) |
| L3 | 修改管理办法、数据出境、算法备案、强制隔离 | ❌            | H1 + H2 + 业务负责人三审  |

**不可自动化清单**(A6 强制校验):生产数据库 DDL、核心系统强制隔离/下线、对外合规承诺、用户数据删除/批量脱敏、算法模型重新训练/下线。

***

## 可观测:16 指标 + 10 区大屏

- **16 核心指标**:流量 / 性能 / 成本 / 可靠性 / 协同 / 告警,以及 A6 专项(质量分 / 偏差告警 / 漂移告警 / 自适应反馈)
- **10 区大屏**:实时告警流、事故时间线、资产健康度、漏洞与情报、合规状态、审批工作流、性能与成本、复盘沉淀、A6 自适应健康度、人机协同接入态

***

## Skill 生命周期与 Nacos AI Registry

所有 Skill 遵循语义化版本 + 标签(`stable` / `candidate` / `snapshot`),支持灰度发布与质量异常自动回滚。当前阶段 Prompt/Skill/AgentSpec 内联在 `at/create_agents_messages.md` 中,Roadmap 中会迁移到 [Nacos AI Registry](https://nacos.io) 做集中注册与分发:

```
内联(当前) → Nacos 注册 → 灰度(1% → 50% → 100%) → 加载 → 调用 → 回滚(质量异常时)
```

***

## 目录结构

```
aegisteam-adaptive/
├── README.md                      # 本文件
├── LICENSE                        # Apache 2.0
├── docker-compose.yml             # 一键启动(mock 网关 + element-web + nacos)
├── docs/                          # 方案文档
│   ├── 00-main.md                 # 主文档
│   ├── 01-agents-and-skills.md    # 8 Agent + 32 Skill
│   ├── 02-orchestration.md        # 3 编排流 + Mock 剧本
│   ├── 03-presentation-materials.md
│   ├── 04-infrastructure.md       # 5 RAG + 6 MCP + 16 指标
│   └── 07-pain-points-and-scenarios.md  # 痛点 + 场景叙事
├── at/                            # AgentTeams 协议
│   ├── AgentTeam.md               # 团队拓扑
│   ├── AGENTTEAMS_RUNBOOK.md      # 7 步运行手册
│   ├── create_agents_messages.md  # Worker + Team 创建脚本
│   ├── run_demo_task_message.md   # 3 条事故任务
│   ├── team_spec.json
│   └── nacos_registry_mock.json   # Nacos Registry mock
├── agents/                        # 8 AgentSpec(a0-a7)
├── skills/                        # 32 SKILL.md(s01-s32)
├── tools/                         # Mock 工具网关(端口 18090)
├── scenarios/                     # 3 场景 JSON
├── web/                           # Web 端 demo(10 区大屏)
├── ppt/                           # 20 页演示材料(md + pptx)
└── scripts/                       # 工具脚本
```

***

## 文档

| 文档            | 链接                                                                           | 用途            |
| ------------- | ---------------------------------------------------------------------------- | ------------- |
| 主文档           | [docs/00-main.md](docs/00-main.md)                                           | 项目总览          |
| Agent + Skill | [docs/01-agents-and-skills.md](docs/01-agents-and-skills.md)                 | 角色与技能矩阵       |
| 编排流 + 剧本      | [docs/02-orchestration.md](docs/02-orchestration.md)                         | 端到端时间线        |
| 基础设施          | [docs/04-infrastructure.md](docs/04-infrastructure.md)                       | RAG/MCP/指标    |
| 痛点与场景         | [docs/07-pain-points-and-scenarios.md](docs/07-pain-points-and-scenarios.md) | 问题与价值叙事       |
| 运行手册          | [at/AGENTTEAMS\_RUNBOOK.md](at/AGENTTEAMS_RUNBOOK.md)                        | 7 步运行         |
| MCP 映射        | [tools/MCP\_MAPPING.md](tools/MCP_MAPPING.md)                                | Mock → 真实 MCP |
| Web Demo      | [web/](web/)                                                                 | 10 区大屏        |

***

## Roadmap

| 版本   | 关键能力                                           |
| ---- | ---------------------------------------------- |
| v1.0 | 8 Agent + 32 Skill + 5 RAG + 6 MCP + 3 编排流(当前) |
| v1.1 | Web 端 demo 完整版 + 演示视频                          |
| v1.2 | Nacos AI Registry 接入 + Skill 灰度发布 + 多模态告警      |
| v1.3 | SIEM/SOAR 真实接入 + 跨团队协同                         |
| v2.0 | Adaptive Engine 自学新攻击手法 + 多租户                  |

***

## 如何参与

欢迎通过 Issue 与 PR 参与贡献:

- **报告问题 / 提需求** → 提交 [Issue](https://github.com/axiaoxun/aegisteam-adaptive/issues)
- **贡献 Skill** → 参考 `skills/s01_incident_routing/SKILL.md` 的模板
- **贡献场景** → 参考 `scenarios/*.json` 的结构
- **改进文档** → 直接提 PR

***

## 贡献者

- **安全运营** —— 10 年甲方安全运营,等保 2.0 / 数据安全法 / 个保法落地经验
- **Agent / LLM 工程** —— 大模型应用、RAG、Agent 框架工程化
- **全栈工程** —— React 可视化、容器化、文档

***

## License

本项目采用 **Apache License 2.0** 开源,详见 [LICENSE](LICENSE)。允许商业使用、修改、分发,但需保留版权声明与许可证副本。

***

## 致谢

- [阿里云 Higress / hiclaw](https://higress.ai/hiclaw)(AgentTeams 运行时)
- [Nacos AI Registry](https://nacos.io)(Skill 注册与分发)
- 阿里云 / 奇安信 / 微步在线 / VirusTotal(真实产品参考)
- [OpsPilot Zero](https://github.com/alibaba/opspilot-zero)(基线参考,AIOps 场景)

