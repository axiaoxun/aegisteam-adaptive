# Nacos AI Registry 注册发布全流程(Skill / Agent / MCP)

> 文档版本:V1.0 · 日期:2026-08-16 · 适配:AegIsLoop Adaptive 复赛 v1.2
>
> 本文回答三个问题:
> 1. **为什么要把 Skill / Agent / MCP 注册到 Nacos AI Registry?**
> 2. **三类 AI 资产分别怎么注册、怎么发布、怎么灰度、怎么回滚?**
> 3. **现有 `at/nacos_registry_mock.json` 与 `skills/*/SKILL.md` 如何平滑迁移到真实 Registry?**
>
> 定位:初赛用内联 + Mock 行为契约;复赛用 **Nacos AI Registry 动态加载**,实现"Skill/Agent/MCP 可独立发布、可版本化、可灰度、可回滚"。本文是 PPT 第 11/13/17 页与 Git 仓库 `at/nacos_registry_mock.json` 的工程落地方案。

---

## 0. 一句话总览

> **AegIsLoop 把"安全运营团队"拆成 32 个 Skill + 8 个 Agent + 6 类 MCP,初赛内联在 AgentTeams 创建消息里;复赛把这些资产发布到 Nacos 3.x AI Registry,Worker 按 `name + version + tag` 动态发现加载,通过"草稿 → 灰度 → 稳定 → 废弃"四态生命周期 + 自动回滚策略,把"自适应"从 Agent 行为层面延伸到"能力资产管理"层面。**

---

## 1. 为什么需要 Nacos AI Registry

### 1.1 初赛的局限(现状)

初赛阶段,7 个业务 Worker 的 AgentSpec、Skill、工具契约全部**内联**在 `at/create_agents_messages.md` 中,由 manager 在创建时一次性注入:

| 局限 | 后果 |
|---|---|
| Skill 更新 = 重新创建 Worker | 一条 Skill 改一行 Prompt 要重建整个 Agent,代价高 |
| 无版本概念 | 无法"回滚到昨天那个好用的 Skill" |
| 无灰度能力 | 新 Skill 只能全量上线,出问题影响 100% Worker |
| 无独立分发 | Skill 无法单独打 zip 给其他 Agent 框架复用 |
| 无统一治理 | 谁改过哪个 Skill、谁审的、为什么,无审计 |

### 1.2 Nacos AI Registry 解决什么

Nacos 3.x 把 **AI Registry(AI 管理中心)** 定位为与服务发现、配置管理并列的核心能力,统一管理 5 类 AI 资源,并用 namespace 做隔离:

| 资源类型 | 注册/管理内容 | 运行时用途 | Nacos 版本 |
|---|---|---|---|
| **Skill** | Skill 包、SkillCard、版本、标签 | Agent 按 `name/version/tag` 下载加载 | **3.2.0 起** |
| **Agent(A2A)** | AgentCard、Agent 端点、版本 | 多 Agent 应用发现并调用 Agent | **3.1.0 起** |
| **MCP Server** | MCP 服务描述、工具、资源、端点、版本 | MCP Client / Router / 网关发现并调用工具 | **3.0.0 起(3.0.1 完善)** |
| **Prompt** | Prompt 模板、变量、版本、标签 | 应用按 Key/版本/标签读取模板 | 3.0 起 |
| **AgentSpec** | Agent 规范包、manifest、内容、资源 | Agent 平台/开发工具加载规范包 | 3.1 起 |

> 关键认知:**Skill / Agent / MCP 是三种不同粒度的"能力资产",各自有独立的 Registry 模块**,不是一个大一统 API。初赛我们只有一个 `nacos_registry_mock.json` 作为统一契约;复赛要按资源类型分别注册到对应模块。

---

## 2. AegIsLoop 资产 → Nacos 资源映射

| AegIsLoop 资产 | 数量 | Nacos 资源类型 | namespace / group | 注册方式 |
|---|---|---|---|---|
| `skills/*/SKILL.md` | 32 | **Skill** | `aegisloop-adaptive` / `AEGISLOOP_SKILLS` | Skill Registry(SDK / 控制台) |
| `agents/*` Agent Identity 卡 | 8 | **AgentSpec**(规范包)+ **Agent(A2A)**(可调用入口) | `aegisloop-adaptive` / `AEGISLOOP_AGENTS` | AgentSpec Registry + A2A Registry |
| `tools/mock_tools.py` 6 类 12 函数 | 6 MCP | **MCP Server** | `aegisloop-adaptive` / `AEGISLOOP_MCP` | MCP Registry(@Tool 自动注册) |
| A0/A6 等 Prompt 模板 | 若干 | **Prompt** | `aegisloop-adaptive` / `AEGISLOOP_PROMPTS` | 配置中心(Config)复用 |

统一约定(对齐 `at/nacos_registry_mock.json` 与 PPT 第 13 页):

```yaml
server-addr: 127.0.0.1:8848            # 真实 Nacos 3.x 地址
namespace:   aegisloop-adaptive         # 项目独立命名空间(隔离其他参赛作品)
# Skill    → group: AEGISLOOP_SKILLS
# Agent    → group: AEGISLOOP_AGENTS
# MCP      → group: AEGISLOOP_MCP
# Prompt   → group: AEGISLOOP_PROMPTS
versioning:  semver(vX.Y.Z)
tag:         stable | candidate | snapshot   # 与 release_lifecycle 对齐
```

---

## 3. 注册前准备(一次性)

### 3.1 部署 Nacos 3.x(≥ 3.2.0 才支持 Skill Registry)

```bash
# 官方一键安装(MacOS/Linux)
curl -fsSL https://nacos.io/nacos-installer.sh | bash

# Docker 单机(演示)
docker run -d --name nacos-server \
  -p 8848:8848 -p 9848:9848 \
  -e MODE=standalone \
  nacos/nacos-server:3.2.0
```

### 3.2 开启 MCP Registry API(3.0.1+)

标准 MCP Registry API 需要额外端口,默认**禁用**,需显式开启:

```yaml
nacos.ai.mcp.registry.enabled: true   # 开启标准 MCP Registry API
nacos.ai.mcp.registry.port: 9080       # 默认 9080
```

### 3.3 创建命名空间 + 账号

- 控制台 → 命名空间 → 新建 `aegisloop-adaptive`
- 控制台 → 权限控制 → 建账号(只授权本命名空间读写)

---

## 4. Skill 注册发布全流程(核心)

### 4.1 从 SKILL.md 到 SkillCard

以 `skills/s23_l1_auto_execute/SKILL.md` 为例,现有 frontmatter:

```yaml
---
name: s23_l1_auto_execute
version: v1.1.0
owner_agent: a5_incident_responder
tag: stable
category: response
---
```

发布到 Nacos Skill Registry 时,把它转成 **SkillCard**(带 content 的 skill 包)。SkillCard 结构:

```json
{
  "name": "s23_l1_auto_execute",
  "displayName": "S23 L1 自动执行",
  "version": "v1.1.0",
  "tag": "stable",
  "category": "response",
  "ownerAgent": "a5_incident_responder",
  "description": "执行 L1 低风险阻断动作(阻断 IP / 禁用默认账户 / 关闭告警),需 A0 Leader 串行确认",
  "keywords": ["block_ip", "L1", "auto-execute", "响应"],
  "inputSchema": {
    "type": "object",
    "properties": {
      "l1_action": {"type": "object"},
      "a0_serial_confirmation": {"type": "boolean"}
    },
    "required": ["l1_action", "a0_serial_confirmation"]
  },
  "toolContracts": ["mock_notify.send_message"],
  "safetyConstraints": [
    "必须先经 A0 Leader 串行确认",
    "必须记录执行证据",
    "失败时立即回滚"
  ],
  "content": "执行 L1 低风险阻断动作……(SKILL.md 正文)",
  "changelog": [
    {"version": "v1.0", "date": "2026-08-04", "note": "基础 L1 执行"},
    {"version": "v1.1", "date": "2026-08-15", "note": "强制 A0 串行确认"}
  ]
}
```

### 4.2 方式 A:控制台手动注册(演示/评审最快)

1. Nacos 控制台 → AI 管理 → **Skill Registry** → 新建 Skill
2. 填入 SkillCard 各字段(或上传 SKILL.md + manifest)
3. 设置 `namespace=aegisloop-adaptive`、`group=AEGISLOOP_SKILLS`
4. 生命周期选 **draft**(草稿),保存

### 4.3 方式 B:Spring AI Alibaba 订阅加载(Worker 侧)

Worker 不用改 AgentSpec 里内联的 Skill 语义,改从 Registry 订阅:

```xml
<dependency>
    <groupId>com.alibaba.cloud.ai</groupId>
    <artifactId>spring-ai-alibaba-starter-nacos-skill-registry</artifactId>
    <version>1.0.0.3</version>
</dependency>
```

```yaml
spring:
  application:
    name: a5-incident-responder
  ai:
    alibaba:
      nacos:
        skill-registry:
          enabled: true
          server-addr: 127.0.0.1:8848
          namespace: aegisloop-adaptive
          group: AEGISLOOP_SKILLS
          subscribed-skills:            # A5 只订阅自己负责的 Skill
            - s05_asset_query
            - s21_remediation_plan
            - s22_risk_guard
            - s23_l1_auto_execute
          refresh-interval: 30s          # 版本/标签变更自动热加载,无需重启
          username: nacos
          password: nacos
```

应用启动后,客户端把订阅到的 Skill 元数据转成可调用的 Tool,Agent 即可透明调用。

### 4.4 生命周期:四态 + 审核

对齐 `at/nacos_registry_mock.json` 的 `release_lifecycle`:

| 阶段 | 说明 | 灰度比例 |
|---|---|---|
| `draft` | 本地开发,不进 Registry | — |
| `snapshot` | 开发版,灰度给少数 Worker 试跑 | 1% |
| `candidate` | 预发版 | 50% |
| `stable` | 正式版 | 100% |
| `deprecated` | 已废弃,保留 1 个版本可回滚 | — |
| `archived` | 归档,不可加载 | — |

**AegIsLoop 的审核闭环**:Skill 从 `snapshot → candidate → stable` 每升级一档,由 **A6 QualitySteward** 依据 `s24_output_quality` / `s25_drift_detection` / `s26_rag_health` 指标自动判断是否放量;若 `agent_output_quality_score < 70 连续 3 次`,自动回滚,不回滚则人工复核。

---

## 5. Agent 注册(A2A + AgentSpec)

Nacos 把 Agent 拆成**两类资源**,不要混淆:

| 资源 | 管什么 | AegIsLoop 对应 |
|---|---|---|
| **Agent(A2A Registry, 3.1.0+)** | "可调用的 Agent 入口"(AgentCard + 端点) | `aegisloop-leader` / `a1`-`a7` 的运行时端点 |
| **AgentSpec Registry** | "Agent 规范包"(manifest + 内容) | `agents/*` 下的 Identity 卡 + 系统 Prompt |

### 5.1 AgentSpec 注册(规范包)

`at/nacos_registry_mock.json` 里已有 8 个 spec,直接作为 manifest 发布:

```json
{
  "name": "a2_threat_detector",
  "version": "v1.3.2",
  "tag": "stable",
  "role": "Tier1/Tier2 分析师",
  "ownedSkills": ["s09_alert_fusion", "s10_impact_mapping", "s11_ioc_enrichment", "s12_attack_pattern", "s13_l1_block_action"],
  "safetyLevel": "L0-L2",
  "systemPrompt": "你是告警检测 Agent……(Identity 卡正文)"
}
```

### 5.2 Agent(A2A)自动注册

Spring AI Alibaba 应用可**自动注册** A2A Agent;外部 Provider 的 Agent 可通过 SDK/API 发布或从市场导入,统一治理。

```yaml
spring:
  ai:
    alibaba:
      nacos:
        registry:
          enabled: true
        server-addr: 127.0.0.1:8848
        namespace: aegisloop-adaptive
```

---

## 6. MCP Server 注册(3.0+)

### 6.1 把 6 类 mock 工具转成 MCP Server

`tools/mock_tools.py` 的 6 类工具 → 6 个 MCP Server,初赛是 HTTP mock,复赛用 **Higress MCP 代理** 0 代码把存量 HTTP API 声明为 MCP 服务,再注册到 Nacos。

| mock 工具 | 真实 MCP Server | 模式 |
|---|---|---|
| `mock_cmdb` | cmdb-mcp | stdio |
| `mock_sbom` | sbom-mcp | stdio |
| `mock_siem` | siem-mcp | SSE |
| `mock_vuln_scanner` | vuln-mcp | stdio |
| `mock_threat_intel` | ti-mcp | SSE |
| `mock_notify` | notify-mcp | SSE |

### 6.2 方式 A:Spring AI Alibaba `@Tool` 自动注册

```java
@Service
public class CmdbService {
    @Tool(description = "按 host_id 查询主机详情")
    public String getHostDetail(@ToolParam(description = "主机 ID") String hostId) {
        return "{\"host_id\":\"" + hostId + "\", \"criticality\":\"P0\"}";
    }
}
```

```yaml
spring:
  application:
    name: cmdb-mcp-server
  ai:
    mcp:
      server:
        name: cmdb-mcp
        version: 1.0.0
        type: SYNC
        instructions: "资产管理 CMDB MCP 服务"
    alibaba:
      nacos:
        server-addr: 127.0.0.1:8848
        namespace: aegisloop-adaptive
        registry:
          enabled: true
```

### 6.3 方式 B:Python 方案(本仓库是 Python)

`nacos-mcp-wrapper-python`(仓库 `nacos-group/nacos-mcp-wrapper-python`):

```python
from nacos_mcp_wrapper import NacosSettings, MCPTool

settings = NacosSettings(
    server_addr="127.0.0.1:8848",
    namespace="aegisloop-adaptive",
    group="AEGISLOOP_MCP",
)
# 用 @MCPTool 装饰 12 个函数,启动后自动注册
```

### 6.4 发现与调用

注册后,Agent 通过 **Spring AI Alibaba 框架** / **Nacos MCP Router**(`nacos-group/nacos-mcp-router`,提供语义搜索 + 自动安装 + 协议代理)/ **Higress 网关** 任一方式发现并调用,无需在 Worker 里硬编码工具地址。

---

## 7. Prompt 注册(配置中心复用)

Prompt 模板直接复用 Nacos **配置中心** 能力,按 Key/版本/标签读取:

```yaml
dataId:    a0_leader_system_prompt
group:     AEGISLOOP_PROMPTS
namespace: aegisloop-adaptive
# 内容即 Prompt 模板,含 {incident_id} {scenario_id} 等变量占位
```

A0-A7 的系统 Prompt、A6 的自适应反馈 Prompt 都走这里,和 Skill/Agent 一样支持版本 + 灰度。

---

## 8. 灰度发布 + 自动回滚(差异化亮点)

这是 AegIsLoop 相对 baseline 的**核心差异化**:把 A6 QualitySteward 的"自适应"延伸到能力资产治理。

### 8.1 灰度策略

新 Skill 从 `snapshot`(1% Worker)→ `candidate`(50%)→ `stable`(100%),每一档由 A6 的 4 个指标把关:

| 指标 | 阈值 | 动作 |
|---|---|---|
| `agent_output_quality_score` | < 70 连续 3 次 | 回滚 |
| `skill_deviation_alert` | > 15% | 回滚 |
| `rule_drift_alert` | > 20% | 回滚 |
| `rag_health_score` | < 80 | 回滚 |

### 8.2 自动回滚(对齐 mock JSON `rollback_policy`)

```yaml
rollback_action: "重新加载上一个 stable 版本的 Skill + 重启 Worker"
```

回滚闭环:A6 检测到漂移 → `event.adaptive_feedback_triggered`(见 `docs/05-human-loop-observability.md` 通道 C)→ A0 Leader 下发回滚指令 → Worker 从 Registry 拉取上一 stable 版本 → 无需人工介入。

---

## 9. 现有 Mock 数据 → 真实 Registry 的迁移路径

`at/nacos_registry_mock.json` 已经按真实 Registry 的字段建模,迁移只是"换存储 + 换加载方式":

| 当前(mock) | 复赛(真实 Registry) |
|---|---|
| `nacos_registry_mock.json` 一个文件 | Nacos Skill/AgentSpec/A2A/MCP Registry 四模块 |
| `skill_registry.skills[]` 31 条 | 逐条发布为 SkillCard + SKILL.md content |
| `agent_spec_registry.specs[]` 8 条 | 8 个 AgentSpec manifest + 8 个 A2A Agent 入口 |
| 6 类 mock 工具(HTTP) | 6 个真实 MCP Server(@Tool 自动注册) |
| `release_lifecycle` / `rollback_policy` | Nacos 版本管理 + A6 自动回滚策略 |
| Worker 内联 Skill 语义 | Worker 订阅 `subscribed-skills` 动态加载 |

**迁移脚本建议**(复赛落地时补):写一个 `scripts/register_nacos.py`,读取 `nacos_registry_mock.json`,循环调用 Nacos SDK 把 31 个 Skill + 8 个 AgentSpec 一次性注册到对应 group。

---

## 10. 评审 / PPT / Git 沉淀建议

### 10.1 PPT 引用(3 处,与现有 19 页对齐)

- **第 11 页(Skill 工程)**:补一句"32 个 Skill 已建模为 SkillCard,可独立发布到 Nacos AI Registry,支持版本化 + 灰度 + 回滚"
- **第 13 页(工程落地)**:在"Nacos AI Registry"一行补生命周期"draft→snapshot→candidate→stable + A6 自动回滚"
- **第 17 页(落地计划)**:v1.2 里程碑改为"Nacos AI Registry 真接 + Skill 灰度 + 多模态告警",与现有 Roadmap 一致

### 10.2 Git 沉淀(可立即提交的 3 件)

| 文件 | 状态 | 内容 |
|---|---|---|
| `at/nacos_registry_mock.json` | ✅ 已有 | 31 Skill + 8 AgentSpec + 生命周期 + 回滚策略 |
| `docs/06-nacos-ai-registry.md`(本文) | ✅ 新增 | 注册发布全流程教程 |
| `scripts/register_nacos.py` | 📅 复赛补 | 一键注册脚本(读 mock JSON → Nacos SDK) |

### 10.3 答辩 Q&A 备答

| 问题 | 答案要点 |
|---|---|
| Q:初赛为什么不直接用 Nacos Registry? | 初赛 36 小时窗口,内联保证端到端稳定跑通;mock JSON 已按真实字段建模,复赛换加载方式即可,契约不变 |
| Q:Skill 版本冲突怎么办? | semver + tag;Worker 按 `name+version+tag` 拉取;A6 指标不达标自动回滚上一 stable |
| Q:MCP 和 Skill 区别? | Skill 是"Agent 的能力(怎么做)",MCP 是"Agent 的工具(调什么)";分别注册到 Skill Registry / MCP Registry |
| Q:Nacos 挂了影响运行吗? | Worker 本地缓存已订阅 Skill;Registry 恢复后 30s 内续订,降级不阻断 |

---

## 11. 参考资料

- Nacos AI Registry 概述:https://nacos-group.github.io/docs/latest/manual/user/ai/ai-registry-overview/
- MCP Server 自动注册与发现手册:https://nacos.io/en/docs/next/manual/user/ai/mcp-auto-register/
- Spring AI Alibaba Nacos 分布式 MCP:https://github.com/spring-ai-alibaba/website/blob/main/integration/mcps/nacos/nacos-distributed-mcp.md
- Nacos MCP Router:https://github.com/nacos-group/nacos-mcp-router
- Python 方案 nacos-mcp-wrapper:https://github.com/nacos-group/nacos-mcp-wrapper-python

---

**关联文档**:
- [docs/01-agents-and-skills.md](01-agents-and-skills.md) — 8 Agent × 32 Skill 设计
- [docs/04-infrastructure.md](04-infrastructure.md) — 5 RAG + 6 MCP + 16 指标
- [docs/05-human-loop-observability.md](05-human-loop-observability.md) — L0.5 人机协同 + 可观测
- [at/AGENTTEAMS_RUNBOOK.md](../at/AGENTTEAMS_RUNBOOK.md) — 端到端跑通手册
- [at/nacos_registry_mock.json](../at/nacos_registry_mock.json) — Registry mock 数据模型
- [ppt/AegIsLoop-Adaptive-19pages.md](../ppt/AegIsLoop-Adaptive-19pages.md) — 19 页答辩 PPT
