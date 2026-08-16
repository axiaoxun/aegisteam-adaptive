# 使用 AgentTeams 运行 AegIsLoop Adaptive Demo

本手册面向第一次试运行 demo 的参赛者。运行机器可以是本地 Mac、Linux 服务器或云主机;mock 工具网关和 AgentTeams 都部署在同一台机器上。

核心流程:

1. 启动 HTTP mock 工具网关(AegIsLoop 6 类 MCP 工具,端口 18090)。
2. 安装 AgentTeams,并按安装器引导完成 LLM 配置。
3. 找到 Docker Worker 可访问的工具网关地址。
4. 在 `manager` 房间串行创建 7 个业务 Worker,并在创建 Team 时生成独立 TeamLeader Worker。
5. 在 Matrix 会话列表中进入名称以 `Team` 开头的 Team 房间,通过 `@aegisloop-leader` 分别发送 3 条事故任务。
6. 验收(参考 §7 的期望信号)。

## 1. 准备运行机器

需要:

- WSL Ubuntu 24.04(已就绪)
- Docker Desktop(已安装,需启动守护进程)
- Python 3(用于启动 mock 工具网关;本仓库 `tools/mock_tool_server.py`)
- 一个 AgentTeams 可使用的 LLM API Key(DeepSeek / Qwen / 阿里云百炼)

检查:

```bash
wsl --status
docker --version
python3 --version
```

## 2. 启动 Mock 工具网关(WSL 中,Python 方式)

> **主推**:与 baseline opsPilot 教程一致,WSL 自带 Python 3.12,零依赖;后续 AT Worker 通过 `172.18.0.1:18090` 访问。

**必须用 WSL Ubuntu 终端**(不是 Git Bash):开始菜单搜 "Ubuntu" / `wsl` 进。

```bash
cd /mnt/d/GOAI/infra参赛作品/aegisteam-adaptive
python3 tools/mock_tool_server.py --host 0.0.0.0 --port 18090
```

**预期**:
```
===============================================
  AegIsLoop Adaptive Mock Tool Gateway
  Listening on http://0.0.0.0:18090
===============================================
...
Available:     3 scenarios: alert_brute_force, new_regulation, regulator_notice
```

**这个终端保持开着!**

**验证**(另开 WSL 终端):

```bash
curl http://127.0.0.1:18090/health
curl http://127.0.0.1:18090/scenarios
curl -X POST http://127.0.0.1:18090/tools/alert_brute_force/mock_siem.get_alert \
  -H 'Content-Type: application/json' \
  -d '{"alert_id": "ALERT-2001"}'
```

期望:
- `/health` → `{"ok": true, "tools_count": 12}`
- `/scenarios` → `["alert_brute_force", "new_regulation", "regulator_notice"]`
- `get_alert` → `severity=CRITICAL score=92.5`

**备选 — Docker 方式**(评审机器无 Python 时用):

```bash
cd /mnt/d/GOAI/infra参赛作品/aegisteam-adaptive
docker-compose up -d mock-tool-gateway
```

注:Docker 方式在 WSL 路径挂载有兼容性坑(已修 mock_tools.py 路径 bug + Dockerfile COPY 路径),**默认推 Python 方式**。

## 3. 安装 AgentTeams

> 本节对齐 [Datawhale 官方教程](../跑通Baseline-拿下第1个赛事作品.md) 的安装方式,使用 **agentscope-ai/AgentTeams** 仓库(非 baseline 文档中的 hiclaw 旧 URL)。

### 3.1 准备环境

- WSL Ubuntu 24.04 已就绪
- Docker Desktop 已安装(本仓库 mock 工具网关需 Docker)
- 需一个 LLM API Key(DeepSeek / Qwen / 阿里云百炼均可,本教程以 DeepSeek 为例)

**启动 Docker Desktop**:Windows 任务栏托盘右键 Docker 图标 → Start(如未启动),等左下角变绿。

**验证**:

```bash
wsl --status        # WSL 2
docker --version    # Docker 28+ / 29+
docker ps           # 不报错即可
```

### 3.2 启动 Mock 工具网关(本仓库提供,端口 18090)

在 WSL 中进入本仓库,启动 mock:

```bash
# 方式 A:Docker 方式(推荐,与 AT Worker 同网络)
cd /mnt/d/GOAI/infra参赛作品/aegisteam-adaptive
docker-compose up -d mock-tool-gateway
docker ps | grep aegisloop
# 期望看到 aegisloop-mock-tool-gateway 容器,18090 端口已映射

# 方式 B:本机 Python 方式(若 docker 守护进程未起)
cd /mnt/d/GOAI/infra参赛作品/aegisteam-adaptive
python3 tools/mock_tool_server.py --host 0.0.0.0 --port 18090
```

**验证 mock 工作**(另开终端):

```bash
curl http://127.0.0.1:18090/health
# 期望:{"ok": true, "service": "aegisloop-mock-tool-gateway", ...}

curl http://127.0.0.1:18090/scenarios
# 期望:["alert_brute_force", "new_regulation", "regulator_notice"]

curl -X POST http://127.0.0.1:18090/tools/alert_brute_force/mock_siem.get_alert \
  -H 'Content-Type: application/json' \
  -d '{"alert_id": "ALERT-2001"}'
# 期望:{"ok": true, "result": {"id": "ALERT-2001", "severity": "CRITICAL", "score": 92.5, ...}}
```

### 3.3 安装 AgentTeams

在 WSL 中执行:

```bash
bash <(curl -sSL https://raw.githubusercontent.com/agentscope-ai/AgentTeams/main/install/agentteams-install.sh)
```

安装器引导项(以 DeepSeek 为例,可任选 LLM):

| 引导项 | 选择 |
|---|---|
| 语言 | 中文 |
| 安装模式 | 快速开始 |
| 版本 | latest |
| LLM 供应商 | OpenAI 兼容 API |
| Base URL | `https://api.deepseek.com/v1` |
| 默认模型 ID | `deepseek-v4-flash` |
| 最大上下文长度 | 1000000 |
| 最大输出长度 | 384000 |
| 是否支持推理/思考模式 | Y |
| 是否支持图片输入 | N |
| LLM API Key | 粘贴你的 Key |
| 记忆搜索配置 | 3(不启用) |
| Manager 运行时 | **QwenPaw(CoPaw)** |
| Worker 运行时 | **QwenPaw(CoPaw)** |
| 其他 | 默认值回车 |

**关键**:Manager 和 Worker 运行时**必须选 QwenPaw(CoPaw)**,否则我们的创建脚本会拒绝。

安装完成后会显示:

- AgentTeams 已启动
- Element 或聊天页面地址(本机通常是 `http://127.0.0.1:18088`)
- 管理员用户名:`admin`
- 自动生成的管理员密码

**如果忘记密码**:

```bash
grep '^AGENTTEAMS_ADMIN_PASSWORD=' ~/agentteams-manager.env
```

**Element 登录**:

```
http://127.0.0.1:18088  →  Edit Homeserver → 填入 http://127.0.0.1:18080  →  admin / 密码
```

## 4. 确定工具网关地址(Docker 容器互通)

> **WSL + Docker Desktop 环境实测结论**:`172.18.0.1`(manager gateway) 指向 Windows Docker Desktop 主机,不指向 WSL(mock 实际跑在 WSL)。**必须用 `host.docker.internal`**,它指向 WSL 真实地址。

**先用 manager 容器验证**(注意容器名是 `agentteams-manager`,不是 `hiclaw-manager`):

```bash
# 1. 找 manager 容器名
docker ps --format '{{.Names}}' | Select-String manager
# 通常是 agentteams-manager

# 2. 验证 host.docker.internal 通(WSL 场景必须用这个)
docker exec agentteams-manager curl -s --max-time 5 http://host.docker.internal:18090/health
# 期望:{"ok": true, "service": "aegisloop-mock-tool-gateway", "version": "0.1.0", "tools_count": 12}

# 3. 验证一个工具调用
docker exec agentteams-manager curl -s --max-time 5 -X POST http://host.docker.internal:18090/tools/alert_brute_force/mock_siem.get_alert -H "Content-Type: application/json" -d '{"alert_id":"ALERT-2001"}'
# 期望:返回 ALERT-2001 完整数据(severity=CRITICAL score=92.5)

# 4. 如果上一步不通,试 gateway(早期 Docker Desktop 偶尔能解析)
docker exec agentteams-manager curl -s --max-time 5 http://172.18.0.1:18090/health
```

**确定 URL**:
- 优先 `http://host.docker.internal:18090`
- 不通则用 `http://172.18.0.1:18090`

**全局替换 `<MOCK_TOOL_BASE_URL>`**:

```powershell
# Windows PowerShell
(Get-Content "D:\GOAI\infra参赛作品\aegisteam-adaptive\at\create_agents_messages.md" -Raw) `
  -replace '<MOCK_TOOL_BASE_URL>', 'http://host.docker.internal:18090' `
  | Set-Content "D:\GOAI\infra参赛作品\aegisteam-adaptive\at\create_agents_messages.md" -NoNewline

# 验证
Select-String -Path "D:\GOAI\infra参赛作品\aegisteam-adaptive\at\create_agents_messages.md" -Pattern "host.docker.internal:18090" | Measure-Object | Select-Object -ExpandProperty Count
# 期望:24(本仓库已统一替换完成)
```

**注意**:`at/create_agents_messages.md` 中 `bash <(curl -sSL ...)` 安装命令是给**评审/复赛**用的,地址需根据实际环境再替换一次。

## 5. 创建 Agent 和 Team

进入 Element Web 的 `manager` 房间。

打开 [create_agents_messages.md](create_agents_messages.md),先把文件中的 `<MOCK_TOOL_BASE_URL>` 全部替换为第 4 步确认的地址,例如:

```text
http://172.18.0.1:18090
```

然后将 [create_agents_messages.md](create_agents_messages.md) 中"复制到 Manager 的完整创建请求"整段发送给 `manager`。这段请求已经包含 7 个业务 Worker 和 1 个 Team 的完整定义,并明确要求:

1. 所有 Worker 使用 `qwenpow`(copow / QwenPaw)运行时。
2. `manager` 必须逐个创建 Worker,不能并行创建。
3. 业务 Worker 创建顺序必须是:`a1-asset-manager` → `a2-threat-detector` → `a3-vuln-verifier` → `a4-compliance-guard` → `a5-incident-responder` → `a6-quality-steward` → `a7-knowledge-weaver`。
4. 每创建完成一个 Worker 后,必须确认该 Worker 创建成功且可以正常运行,再创建下一个 Worker。
5. 创建 `aegisloop-adaptive` Team 时,必须创建一个新的独立 Worker 作为 TeamLeader,名称必须是 `aegisloop-leader`(对应 a0_leader 角色)。
6. 禁止把 a1-a7 中任何一个直接指定为 leader。
7. 必须等 7 个业务 Worker 全部创建完成并确认正常运行后,才允许创建 `aegisloop-adaptive` Team。

Worker 初始化会拉起运行时并写入依赖,低规格机器上并发创建可能造成高 I/O 消耗甚至阻塞。因此不要手动把 Worker 创建任务拆开并并行发送。

注意:

- `manager` 只负责创建和管理。
- 事故任务后续发给 Matrix 会话列表中名称以 `Team` 开头的 Team 房间,并在消息里 `@aegisloop-leader`,不发给 `manager`。
- 7 个业务 Worker 的 AgentSpec、Skill 和工具契约已经内联在创建消息中。
- Worker 不需要读取宿主机上的 `agents/...` 或 `skills/*/SKILL.md` 文件。
- `skills/*/SKILL.md` 主要用于评审、PPT / 文档追溯和后续 Registry 替换。

## 6. 发送事故任务

打开 [run_demo_task_message.md](run_demo_task_message.md)。

在 Element Web / Matrix 会话列表中找到名称以 `Team` 开头、对应 `aegisloop-adaptive` 的 Team 房间。通常 `manager` 在创建完成摘要里会告诉你 Team 房间名称和 `team_leader_name`。

进入 Team 房间后,在输入框先输入并选中 leader mention:

```text
@aegisloop-leader
```

然后把第一条事故任务(`alert_brute_force`)复制到这条 @ 消息里发送。**必须逐个任务发送**:等 `INC-2001` 报告完整输出后,再用同样方式 `@aegisloop-leader` 并发送第二条事故消息(`regulator_notice`)。等 `INC-2002` 报告输出后,再发送第三条(`new_regulation`)。**不要同时发送多起事故**,避免 Team 并发调度时上下文和工具状态互相干扰。

如果你只看到 `manager` 房间,可以先问:

```text
aegisloop-adaptive 对应的 Team 房间在哪里?请告诉我 Matrix 会话列表中名称以 Team 开头的房间名称,以及需要 @ 的 team_leader_name。
```

任务消息只包含故障现象和少量初始告警。日志、Trace、配置变更、漏洞、IOC 和通知应由 Agent 通过 HTTP 工具网关主动查询。

## 7. 判断是否跑通

### INC-2001 / `alert_brute_force` 应包含:

| 检查项 | 期望信号 |
|---|---|
| 影响资产 | `web-app-prod-01`(OpenSSH 7.4p1 / OpenSSL 1.0.2k,公网暴露 22 端口) |
| 证据 | mock_siem 中 5 个独立 IP 217 次失败登录、IOC 富化 1 个 Tor 出口节点 |
| 根因 | Higress WAF 错误放行 22 端口 + OpenSSH 7.4p1 存在 CVE-2023-38408 |
| 修复 | 阻断 5 个 IP(L1 自动)+ 升级 OpenSSH(L2 审批)+ 强制密码重置(L2 审批) |
| 验证 | sshd 登录失败次数下降、A6 质量门通过 |
| A6 反馈 | 至少 1 次 quality gate 触发、1 次证据锚定、1 次自适应反馈 |

### INC-2002 / `regulator_notice` 应包含:

| 检查项 | 期望信号 |
|---|---|
| 影响资产 | `db-user-prod-01` / `db-trade-prod-01` / `db-mkt-prod-01` |
| 证据 | 监管通报 ZJWA-2026-0816-001 + 2 起数据出境查询(08-10 / 08-12) |
| 根因 | admin/admin123 默认口令 + 数据出境未评估 + PIA 缺失 |
| 修复 | 立即阻断出境(L1)+ 禁用默认账户(L1)+ PIA 评估(L2)+ 管理办法(L3) |
| 审批 | 至少 1 个 H1 + 2 个 H2 + 1 个 L3 三审 |
| A6 反馈 | RAG 健康度因新法规触发重评、知识补全 |

### INC-2003 / `new_regulation` 应包含:

| 检查项 | 期望信号 |
|---|---|
| 影响资产 | `ai-app-consult` / `ai-app-medreport` / `ai-app-edu` |
| 证据 | 生成式 AI 办法 5 项条款 + 3 个应用存在 5 项合规缺口 |
| 根因 | 新法规 9-1 实施,3 周内未完成算法备案/内容审核/实名认证/日志留存 |
| 修复 | **管理路径**:草拟办法 + PIA + 算法备案 + 用户协议 |
| 修复 | **技术路径**:内容审核(aliyun.green)+ 水印 + 实名认证 + 日志归档(SLS)+ 数据血缘 |
| 审批 | 至少 2 个 H1 + 4 个 H2 + 1 个 L3 |
| A6 + A7 联动 | A7 知识回写更新 KB-Runbook 中"新法规响应"Runbook |

如果团队要求你人工提供完整日志、Trace、漏洞或配置变更,可以提醒:

```text
请通过已配置的 HTTP mock 工具网关主动查询,不要让我人工收集完整证据。
```

## 后续替换点(初赛 → 复赛 → 生产)

| 当前内容 | 后续替换方向 |
|---|---|
| HTTP mock 工具网关(本仓库) | 真实 MCP Server 或 Higress MCP 代理 |
| `scenarios/*.json` | 真实 SIEM / SBOM / 漏洞扫描 / 威胁情报 / 通知平台 |
| `at/create_agents_messages.md` 中 7 个业务 Worker 的内联 AgentSpec / Skill | Nacos AI Registry 中的 Prompt、Skill、AgentSpec、AgentTeam Spec |
| `skills/*/SKILL.md` 评审材料 | 发布到 Nacos AI Registry 或 AgentTeams Skill Registry,由 Worker 按版本/标签动态加载 |
| 6 类 MCP mock 工具 | 真实 MCP Server:cmdb-mcp / siem-mcp / vuln-mcp / ti-mcp / notify-mcp / sbom-mcp |
