# AegIsLoop Adaptive — AgentTeam 拓扑

本文件描述 AegIsLoop Adaptive 项目的 Team 形态。主运行路径是 **AgentTeams + 真实 LLM Worker + HTTP mock 工具网关**。

## AgentTeams 运行时

| AgentTeams 概念 | AegIsLoop 设计 |
| --- | --- |
| Manager 房间 | 接收自包含的 Agent 创建消息(Step 1-7 + Step 8 Team) |
| Team 房间 | Matrix 会话列表中名称以 `Team` 开头;用户通过 `@aegisloop-leader` 发送事故任务 |
| TeamLeader Worker | 创建 Team 时由 manager 生成的独立 Worker `aegisloop-leader`(对应 a0_leader 角色) |
| Worker 房间 | 运行 7 个角色明确的业务 LLM Agent(a1-a7) |
| Worker 运行时 | 统一使用 `qwenpow`(copow / QwenPaw) |
| 创建策略 | `manager` 串行创建 7 个业务 Worker;创建 Team 时再生成独立 TeamLeader Worker `aegisloop-leader`;禁止把业务 Worker 指定为 leader |
| AgentSpec | 7 个业务 Worker 的 AgentSpec 内联在 `at/create_agents_messages.md` |
| 事故输入 | `at/run_demo_task_message.md` 中的 3 条事故任务 |
| 工具调用 | HTTP mock 工具网关(6 类 MCP mock,12 个函数) |
| Skill Registry | 初赛阶段使用创建消息中的内联 Skill 语义;复赛阶段发布到 Nacos AI Registry / AgentTeams Skill Registry |

AgentTeams 组件通常运行在 Docker 中,因此运行时不依赖宿主机上的项目目录路径。Worker 通过 HTTP 地址访问工具网关,并根据 `scenario_id` 查询对应事故数据。当前 demo 不要求 Worker 读取宿主机上的 `agents/...` 或 `skills/*/SKILL.md`;后续可把这些 Skill / AgentSpec 发布到 Nacos AI Registry 或 AgentTeams Skill Registry,再由 Worker 按版本/标签动态加载。

## 团队拓扑

```
                                ┌─────────────────────┐
                                │   Manager (hiclaw)  │
                                │  Element Web 房间    │
                                └──────────┬──────────┘
                                           │ 串行创建 7 业务 Worker
                                           │ + 1 Team(自动生成 TeamLeader)
                                           ▼
        ┌──────────────────────────────────────────────────────────────┐
        │            Team: aegisloop-adaptive                          │
        │            房间名以 "Team" 开头                              │
        │                                                               │
        │   ┌─────────────────────────────────────────────────────┐    │
        │   │  TeamLeader: aegisloop-leader(由 Manager 创建)      │    │
        │   │  AgentLoop 调度:max_iterations=5, max_parallel=3    │    │
        │   └─────────────────────────────────────────────────────┘    │
        │       │       │       │       │       │       │              │
        │       ▼       ▼       ▼       ▼       ▼       ▼              │
        │   ┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐ │
        │   │  A1  ││  A2  ││  A3  ││  A4  ││  A5  ││  A6  ││  A7  │ │
        │   │资产  ││告警  ││漏洞  ││合规  ││响应  ││质量  ││复盘  │ │
        │   │管理  ││检测  ││验证  ││管理  ││      ││治理  ││织造  │ │
        │   └──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘ │
        │       │       │       │       │       │       │              │
        │       └───────┴───────┴───────┴───────┴───────┘              │
        │                       │                                       │
        │                       ▼                                       │
        │              L0.5 人机协同层                                   │
        │              (Web 平台 / IM 通道)                              │
        └──────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    HTTP mock 工具网关
                POST /tools/{scenario_id}/{tool_name}.{function_name}
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
            mock_cmdb       mock_siem     mock_vuln_scanner
            mock_sbom       mock_threat_intel  mock_notify
```

## 编排流(Orchestration Flow)

3 条核心编排流,每条由 A0 Leader 通过 AgentLoop 调度:

| 编排流 | 触发场景 | 涉及 Worker | 步骤数 |
|---|---|---|---|
| Flow 1:告警流 | `alert_brute_force` | A0 + A1 + A2 + A3 + A5 + A6 | 22 |
| Flow 2:监管通报流 | `regulator_notice` | A0 + A1 + A3 + A4 + A5 + A6 | 26 |
| Flow 3:新法规响应流 | `new_regulation` | A0 + A1 + A3 + A4 + A5 + A6 + A7(管理+技术双路) | 14 |

## 工作流(以 Flow 1 告警流为例)

1. TeamLeader `aegisloop-leader` 接收 Team 房间中的事故任务,提取 `incident_id`、`scenario_id` 和用户描述,并调度业务 Worker。
2. A1 AssetManager 调用 mock_cmdb / mock_sbom 拉取资产画像和 SBOM。
3. A2 ThreatDetector 调用 mock_siem / mock_threat_intel 拉取告警、事件、IOC,聚合事故候选。
4. A3 VulnVerifier 调用 mock_vuln_scanner / mock_sbom 验证漏洞可利用性,给出修复版本。
5. A5 IncidentResponder 生成应急响应计划(L0/L1 自动执行,L2/L3 生成审批任务)。
6. A6 QualitySteward 在每步做质量门检查;在流程结束后做整体质量评估。
7. TeamLeader 汇总事故报告,与 L0.5 人机协同层交互获取审批,最终输出事故报告。

## Demo 场景

| 场景 | 事故 ID | 根因 | 风险分级 |
|---|---|---|---|
| `alert_brute_force` | INC-2001 | 5 个外部 IP(含 Tor 出口)SSH 暴力破解 web-app-prod-01 | L2(需审批) |
| `regulator_notice` | INC-2002 | 监管通报 3 项整改(弱口令/数据出境/PIA 缺失) | L3(需三审) |
| `new_regulation` | INC-2003 | 《生成式 AI 服务管理暂行办法》3 周内双路径合规整改 | L3(需三审) |
