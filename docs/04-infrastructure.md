# AegisTeam Adaptive · 基础设施层设计

> 文档版本:V1.1  ·  日期:2026-08-15  ·  适配:AegisTeam Adaptive(人机协同层 + A0 Leader + 8 Agent + 23 Skill)
>
> 本文是工程化基础设施总图,聚焦 **RAG 知识库 × MCP 工具集成 × 可观测体系** 三件套,补齐评审中"工程落地 20%"的最高落地分。
>
> **Mock 化原则**:初赛 36 小时窗口,所有外部依赖先用 Mock 数据驱动;基础设施仍按真实生产环境设计,接口契约、Schema、SLA 与正式部署完全一致,只把数据源替换为内置 Mock Adapter,评审看到的是"可生产"的工程结构。
>
> **本版相对 V1.0 核心改动**:
> - **RAG 从 4 套扩到 5 套**:新增 **KB-SupplyChain(供应链安全 / 软件物料 / 第三方风险)**,为 8 Agent × 23 Skill 提供软件供应链维度决策证据
> - **MCP 从 5 类扩到 6 类**:新增 **通知通道 MCP(钉钉 / 企微 / 飞书)**,作为人机协同层的物理通道
> - **可观测升级到 16 指标 + 10 区大屏**:新增 A6 QualitySteward 自适应健康度相关指标;大屏 9 区→10 区
> - **新增 L0.5 人机协同层**:在 A0 Leader 之上抽象"Web 平台 + IM 通道"双前端,支持 1 名安全工程师在多终端值守
> - **角色升级**:原"调度 Agent"统一改名为"Leader Agent",体现"团队领导而非调度员"的角色升级

---

## 一、5 套 RAG 知识库设计

AegisTeam Adaptive 的"自适应"二字落地在知识上。8 个 Agent 之所以能 7×24 接管 SOC 团队,前提是有 5 套持续更新的知识库作为决策证据。所有知识库统一部署在 **PolarDB for PostgreSQL + pgvector** 上(行存 + 向量混合存储),由 Nacos 统一配置索引参数,由 RocketMQ 异步接收增量更新。

### 1.1 法规知识库(KB-Compliance)

| 字段 | 内容 |
|---|---|
| **知识库名称** | `kb_compliance_v1`(等保 / 数据安全 / 个保 / 网络安全 / 行业规范) |
| **内容来源** | ① 监管原文 PDF/HTML(等保 2.0 测评要求、数据安全法、个保法、网络安全法、关基条例);② 行业规范(金融 JR/T 0071、电信 YD/T 3813、医疗 HIPAA 摘要);③ 内部合规检查表(法务/合规岗历史沉淀) |
| **数据结构** | 每条记录 9 字段:`id`(KB-C-00001)、`law_name`(等保 2.0)、`clause_no`(8.1.4.2)、`clause_text`(原文 ≤500 字)、`summary`(LLM 摘要 ≤120 字)、`control_object`(网络/主机/数据/人员/制度)、`enforce_level`(强制/推荐)、`effective_date`、`update_time` |
| **数据量级** | **约 1,800 条** —— 等保 2.0 条款 312 条 + 数据安全法 56 条 + 个保法 73 条 + 网络安全法 79 条 + 关基条例 48 条 + 金融行业 420 条 + 电信行业 380 条 + 内部检查表 430 条 |
| **更新频率** | 监管原文按"季度扫描 + 变更 diff"模式更新(月更 1 次);内部检查表按"周更"模式由合规岗推送 |
| **检索方式** | **混合检索**(BM25 + pgvector cosine,权重 0.4 / 0.6),reranker 用 BGE-reranker-large;Top-K=8,余弦阈值 0.78 |
| **被哪些 Agent / Skill 使用** | A4 合规与个保 Agent 全部 3 个 Skill(合规自评、个保法检查、数据分类分级);A0 Leader Agent 在生成"高风险动作审批单"时引用条款;A7 复盘 Agent 在出报告时引用条款做证据闭环 |
| **Mock 化方案** | 内置 50 条精选条款 JSON(覆盖等保 2.0 三级 8 大类 + 个保法核心 6 条 + 金融行业 JR/T 0071 关键 10 条),Demo 中 A4 Agent 的"自评报告"展示完整引用链路,字段 `source_url` 指向 Mock 链接 |

### 1.2 漏洞知识库(KB-Vuln)

| 字段 | 内容 |
|---|---|
| **知识库名称** | `kb_vuln_v1`(CVE / CWE / NVD + 内部复盘) |
| **内容来源** | ① NVD 官方 JSON Feed(每日同步,2025 年新增 22,000+ CVE);② CWE 字典(MITRE 官方);③ CNVD / CNNVD 摘要;④ 内部历史漏洞复盘(由 A3 漏洞验证 Agent 提交,A7 复盘 Agent 沉淀);⑤ 阿里云漏洞库 + 微步在线 XVE 摘要(脱敏) |
| **数据结构** | 每条记录 14 字段:`cve_id`、`cve_title`、`cvss_v3`(float)、`cvss_vector`、`cwe_id`、`affected_product`、`affected_version`、`exploit_available`(bool)、`exploit_maturity`(weaponized/proof-of-concept/unreported)、`patch_available`(bool)、`patch_url`、`summary`(≤200 字)、`internal_poc`(内部 PoC 摘要,脱敏)、`last_seen_in_our_env` |
| **数据量级** | **约 285,000 条** —— NVD 历史 CVE 全量 280,000 + 内部复盘 4,200 + 阿里云漏洞库精选 800;CWE 字典另存 933 个弱项类型作为子表 |
| **更新频率** | NVD 每日凌晨 03:00 增量同步(Delta Feed);内部复盘"实时"(A3 Agent 复测完成即推送,经 A7 审核入库) |
| **检索方式** | **多路召回 + rerank**:① 向量检索(semantic,`summary` + `cve_title` 嵌入);② 关键词检索(产品/版本号);③ 受影响资产反查(CMDB host_id 反向 join)。最终经 BGE-reranker 排序,Top-K=20,带 0.85 阈值兜底 |
| **被哪些 Agent / Skill 使用** | A1 资产管理 Agent(暴露面扫描结果反查 CVE);A2 威胁检测 Agent(情报关联);A3 漏洞验证 Agent 全部 3 个 Skill(漏洞验证、PoC 安全生成、复测执行);A4 合规 Agent(关联等保条款);A5 事件响应 Agent(紧急漏洞触发隔离);A7 复盘 Agent(生成漏洞专题报告) |
| **Mock 化方案** | 预置 30 条近年高危 CVE(覆盖 Log4Shell CVE-2021-44228、Spring4Shell CVE-2022-22965、Confluence CVE-2023-22515 等),`internal_poc` 字段填"内部已复现,详见 Mock 复盘 #0427",Demo 演示从告警→关联 CVE→复测→出报告的完整链路 |

### 1.3 Runbook 知识库(KB-Runbook)

| 字段 | 内容 |
|---|---|
| **知识库名称** | `kb_runbook_v1`(标准化处置流程) |
| **内容来源** | ① NIST SP 800-61 事件处理指南(摘要);② CIS Critical Security Controls;③ MITRE ATT&CK 缓解措施;④ 内部 Runbook(A5/A6 Agent 历史沉淀);⑤ 厂商应急响应手册(深信服/奇安信/阿里云安全应急脱敏版) |
| **数据结构** | 每条记录 11 字段:`runbook_id`(RB-2025-0042)、`scenario`(勒索软件/数据泄露/DDoS/钓鱼/账号失陷/供应链投毒/合规违规 7 大类)、`severity`(P0-P3)、`trigger_condition`(触发条件自然语言)、`steps`(JSON 数组,每步含 actor、action、tool、expected_output、rollback、time_budget)、`required_approval`(L1/L2/L3 分级)、`evidence_required`(证据清单)、`escalation_path`、`last_validated`(最近验证时间)、`success_rate`、`mttr_minutes` |
| **数据量级** | **约 2,400 条** —— 7 大场景 × 平均 340 条子流程 + 应急通用流程 30 条;每个 Runbook 步骤数 5-15 步 |
| **更新频率** | 季度评审(每条 Runbook 强制要求至少 90 天内被命中 1 次,否则降权到冷库) |
| **检索方式** | **关键词 + 向量混合**(BM25 权重 0.55,因 Runbook 强依赖术语匹配如"Log4j JNDI 注入") |
| **被哪些 Agent / Skill 使用** | A0 Leader Agent 派工主索引;A2 告警归并 Agent 自动匹配 Runbook 草拟响应计划;A5 事件响应 Agent 全部 3 个 Skill(主机隔离/网络阻断/账号封禁)按 Runbook 步骤执行;A7 复盘 Agent 在事后校验"实际执行 vs Runbook 偏差" |
| **Mock 化方案** | 预置 8 条典型 Runbook(勒索软件应急 / 数据泄露溯源 / 钓鱼事件 / 漏洞利用 / 弱口令爆破 / DDoS / 内部违规 / 合规通报整改),Demo 剧本"09:00 弱口令爆破→10:30 横向移动→11:00 隔离"全流程匹配 RB-2025-0007 |

### 1.4 复盘案例库(KB-Postmortem)

| 字段 | 内容 |
|---|---|
| **知识库名称** | `kb_postmortem_v1`(历史事件复盘) |
| **内容来源** | ① 内部历史事件复盘报告(2022-2026 共 4 年,180 份);② 公开安全事件复盘(SolarWinds 供应链、Capital One 数据泄露、Uber 内部钓鱼 等 60 篇);③ 阿里云 / 腾讯云 / 国家互联网应急中心 公开通报摘要;④ 行业 ISAC 共享(脱敏) |
| **数据结构** | 每条记录 13 字段:`case_id`、`case_name`、`event_time`、`attack_chain`(MITRE ATT&CK TTP 数组)、`root_cause`、`detection_signal`(首次告警的告警源)、`detection_latency_seconds`、`response_latency_seconds`、`lessons_learned`(≤300 字)、`best_practice`、`control_gap`、`linked_runbook`、`embedding_vector`(384 维) |
| **数据量级** | **约 240 条** —— 内部 180 + 公开 60;每条 1-3 页,合计 1,200 KB 文本 |
| **更新频率** | 月更(每月新事件触发入库 1-3 条) |
| **检索方式** | **纯向量检索**(语义为主,因复盘价值在"经验是否可迁移"),Top-K=5,余弦阈值 0.82 |
| **被哪些 Agent / Skill 使用** | A7 复盘 Agent 全部 2 个 Skill(复盘提炼、Runbook 生成)主索引;A0 Leader Agent 在面对"未知新型事件"时检索相似历史案例,辅助决策升级;人机协同层"安全工程师"自学查阅 |
| **Mock 化方案** | 预置 10 个高质复盘(含本次 Demo 剧本对应的 1 个"演练复盘"),用于 A7 Agent 出具"本次演练 vs 历史相似事件偏差分析"报告 |

### 1.5 供应链安全知识库(KB-SupplyChain)

| 字段 | 内容 |
|---|---|
| **知识库名称** | `kb_supply_chain_v1`(供应链安全 / 软件物料 / 第三方风险) |
| **内容来源** | ① CVE-EPSS-KEV 三方关联数据(NIST 官方:NVD 漏洞 × EPSS 风险评分 × CISA KEV 在野利用);② 开源许可证合规规则(SPDX License List + OSI 官方);③ SBOM 风险评估模板(CycloneDX / SPDX 标准);④ 第三方供应商风险评估方法(ISO 27036 / NIST SP 800-161);⑤ 供应链攻击案例库(SolarWinds SUNBURST、Log4Shell CVE-2021-44228、Confluence CVE-2023-22515、Kaseya VSA、3CX Supply Chain、event-stream、ua-parser-js 等 30+ 高质案例);⑥ EPSS 风险评分模型(Exploit Prediction Scoring System) |
| **数据结构** | 每条记录 11 字段:`entry_id`、`category`(CVE-EPSS-KEV/license/sbom_template/vendor_assessment/case_study)、`title`、`summary`(≤200 字)、`content_body`(≤2,000 字)、`source_url`、`risk_score`(float 0-10,EPS Score)、`exploitation_status`(weaponized/poc/unreported)、`related_cve[]`、`license_type`(GPL/MIT/Apache 等,适用时)、`update_time` |
| **数据量级** | **约 5,000 条** —— CVE-EPSS-KEV 关联 2,500 + 许可证规则 300 + SBOM 评估模板 150 + 供应商评估方法 50 + 供应链攻击案例 2,000 |
| **更新频率** | 实时(CVE-EPSS-KEV 每日增量);周更(许可证变更);月更(案例库补充) |
| **检索方式** | **多路召回 + rerank**:① 向量检索(语义,`summary` + `content_body` 嵌入);② 关键词检索(产品/版本号/许可证 ID);③ 按 `risk_score` 降序;最终 BGE-reranker 排序,Top-K=10,带 0.85 阈值兜底 |
| **被哪些 Agent / Skill 使用** | A1 资产管理 Agent 4 个 Skill(资产发现 / SBOM 解析 / 暴露面扫描 / 影子 IT 识别);A3 漏洞验证 Agent 3 个 Skill(漏洞验证 / PoC 安全生成 / 复测执行);A4 合规与个保 Agent 3 个 Skill(合规自评 / 个保法检查 / 数据分类分级);A6 QualitySteward Agent 1 个 Skill(规则漂移监控) |
| **Mock 化方案** | 预置 50 条精选条目,文件 `mock-kb-supply-chain.json` —— 覆盖 10 个高危 CVE-EPSS-KEV 关联、5 个开源许可证规则、10 个 SBOM 评估模板、5 个供应链攻击案例(覆盖 SolarWinds SUNBURST、Log4Shell、3CX 等经典)。Demo 中 A3 Agent 演示"从告警→查供应链风险评分→生成修复建议"完整链路 |

### 1.6 知识库总图(快速对比)

| 维度 | 法规 KB | 漏洞 KB | Runbook KB | 复盘 KB | **供应链 KB**(新增) |
|---|---|---|---|---|---|
| 条目数 | ~1,800 | ~285,000 | ~2,400 | ~240 | **~5,000** |
| 主检索 | 混合(0.4/0.6) | 多路+rerank | BM25 为主(0.55) | 纯向量 | **多路+rerank(risk_score 优先)** |
| 更新频率 | 季度 + 周 | 日 + 实时 | 季度 | 月 | **实时 + 周 + 月** |
| 主消费者 | A4、A0 Leader | A3、A1、A5 | A5、A0 Leader | A7、A0 Leader | **A1、A3、A4、A6** |
| 存储 | PolarDB + pgvector | PolarDB + pgvector | PolarDB + pgvector | PolarDB + pgvector | PolarDB + pgvector |
| Embedding 模型 | BGE-large-zh-v1.5(中文条款) | BGE-base-en-v1.5(英文 CVE 摘要) | BGE-large-zh-v1.5 | BGE-large-zh-v1.5 | **BGE-large-en-v1.5(EPSS / NVD 英文为主)** |

**5 套 KB 总量约 294,440 条**,核心生产数据(NVD 全量)与高质量精选(供应链/法规/Runbook)分层存储,90 天热 + 1 年冷归档。

---

## 二、6 类 MCP 工具集成

MCP(Model Context Protocol)作为 Agent ↔ 外部工具的"USB-C"接口,本项目用 **stdio + SSE 双模**:stdio 适合本地 CLI 类工具(扫描器、SBOM 生成器),SSE 适合远程 SaaS 类(威胁情报、SIEM、通知通道)。所有 MCP Server 部署在 K8s Pod 中,通过 Higress 网关对外暴露,统一鉴权走 OIDC + Nacos 配置中心。

### 2.1 CMDB(配置管理数据库)

| 字段 | 内容 |
|---|---|
| **工具类别** | 资产管理 / 配置管理 |
| **真实产品** | **腾讯蓝鲸 CMDB / 阿里云 ECS Inventory / Prometheus + 1Panel**(中小单位首选开源) |
| **MCP Server 实现** | **stdio 模式**(`mcp-server-cmdb` Node.js 进程),资源(Resource)定义为 `cmdb://host/{host_id}`、`cmdb://service/{service_id}`、`cmdb://app/{app_id}`,工具(Tool)定义 `search_hosts`、`get_host_detail`、`update_host_tag`、`list_exposed_assets` |
| **对接 Agent / Skill** | A1 资产管理 Agent(资产发现、SBOM 解析、暴露面扫描 3 个 Skill);A5 事件响应 Agent(主机隔离时反查 host_id);A6 审计 Agent(资产变更留痕) |
| **数据交换格式** | `application/json`;MCP 工具调用 JSON-RPC 2.0 |
| **Mock 化方案** | 内置 `mock-cmdb.json` 30 台主机(覆盖 Web 服务器、DB、K8s 节点、办公终端 4 类),字段含 `host_id`、`hostname`、`ip`、`os`、`service`、`owner`、`business`、`asset_criticality`,Demo 剧本中"10:30 横向移动"目标主机 host-007 已在 Mock 中预置 |

**JSON Schema 示例**(`get_host_detail` 输入):
```json
{
  "type": "object",
  "properties": {
    "host_id": {"type": "string", "pattern": "^host-[0-9]{4}$"},
    "include_relations": {"type": "boolean", "default": true}
  },
  "required": ["host_id"]
}
```

**输出示例**:
```json
{
  "host_id": "host-0007",
  "hostname": "web-prod-07",
  "ip": "10.20.30.40",
  "os": "CentOS 7.9",
  "services": ["nginx-1.20.1", "tomcat-9.0.50", "log4j-2.14.1"],
  "owner": "team-payments",
  "business": "支付网关",
  "criticality": "P0",
  "relations": {"depends_on": ["db-prod-02"], "deployed_by": "Jenkins-001"}
}
```

### 2.2 SBOM(软件物料清单)

| 字段 | 内容 |
|---|---|
| **工具类别** | 软件供应链 / 依赖管理 |
| **真实产品** | **OWASP Dependency-Check / CycloneDX(cdxgen 生成器)/ Syft**(开源三件套) |
| **MCP Server 实现** | **stdio 模式**(`mcp-server-sbom`),工具定义 `generate_sbom`(入参构建产物路径)、`query_components`(按 CVE/CWE 检索)、`compare_sbom`(两版本 diff)、`list_license`(许可证合规) |
| **对接 Agent / Skill** | A1 资产管理 Agent(SBOM 解析 Skill);A3 漏洞验证 Agent(漏洞验证时反查组件版本);A4 合规 Agent(许可证合规检查) |
| **数据交换格式** | CycloneDX 1.5 JSON(标准格式) |
| **Mock 化方案** | 预生成 3 个微服务的 SBOM 文件,内含 Log4j 2.14.1、Jackson 2.9.10、OpenSSL 1.0.2 等已知风险组件,共约 280 个 component,用于 A1 Agent 演示"SBOM 解析 → 关联 CVE → 触发 A3 复测"链路 |

**JSON Schema 示例**(`query_components` 输出摘要):
```json
{
  "components_total": 280,
  "vulnerable_components": 7,
  "high_risk": [
    {"name": "log4j-core", "version": "2.14.1", "cves": ["CVE-2021-44228"], "cvss": 10.0},
    {"name": "jackson-databind", "version": "2.9.10", "cves": ["CVE-2019-14439"], "cvss": 7.5}
  ]
}
```

### 2.3 SIEM / SOAR

| 字段 | 内容 |
|---|---|
| **工具类别** | 安全信息与事件管理 / 安全编排自动化响应 |
| **真实产品** | **Elastic Security(开源首选)/ IBM QRadar / 阿里云云安全中心 / Palo Alto Cortex XSOAR** |
| **MCP Server 实现** | **SSE 模式**(`mcp-server-siem` 监听 `:8081/sse`,`mcp-server-soar` 监听 `:8082/sse`),远程 SaaS 类,资源 `siem://alert/{alert_id}`、Tool `query_alerts`、`get_alert_timeline`、`create_soar_case`、`trigger_playbook` |
| **对接 Agent / Skill** | A2 告警归并 Agent(多源告警归并、情报关联、告警分级、误报识别 4 个 Skill);A5 事件响应 Agent(触发 SOAR 剧本);A6 审计 Agent(查询告警历史) |
| **数据交换格式** | ECS(Elastic Common Schema)+ STIX 2.1(情报交换) |
| **Mock 化方案** | 内置 `mock-siem-events.json` 含 50 条预生成告警(覆盖弱口令爆破、SQL 注入、WebShell 上传、内网横向、异常外联 5 类),`mock-soar-playbooks.json` 含 8 个预置剧本,RocketMQ 推流模拟"09:00 弱口令爆破"事件 |

**JSON Schema 示例**(`query_alerts` 输出单条):
```json
{
  "alert_id": "ALT-2026-0815-001",
  "timestamp": "2026-08-15T09:00:23+08:00",
  "source": "WAF",
  "rule": "Multiple failed logins from same IP",
  "severity": "medium",
  "src_ip": "203.0.113.42",
  "dest_host": "host-0007",
  "user": "admin",
  "count": 47,
  "raw_log": "..."
}
```

### 2.4 漏洞扫描器

| 字段 | 内容 |
|---|---|
| **工具类别** | 漏洞扫描 / 主动探测 |
| **真实产品** | **Nessus Essentials(Tenable.io)/ Qualys VMDR / OpenVAS / Nuclei**(开源) |
| **MCP Server 实现** | **stdio 模式**(`mcp-server-scanner`),Tool `create_scan_task`、`get_scan_result`、`cancel_scan`、`get_vuln_detail`;扫描结果以 CycloneDX VEX 格式回传 |
| **对接 Agent / Skill** | A1 资产管理 Agent(暴露面扫描 Skill);A3 漏洞验证 Agent 全部 3 个 Skill(漏洞验证、PoC 安全生成、复测执行);A4 合规 Agent(关联等保条款) |
| **数据交换格式** | Nessus `.nessus` XML / Nuclei JSON / OpenVAS XML;归一化后存为 `scanner_vuln_v1` 表 |
| **Mock 化方案** | 预生成 15 个漏洞扫描结果(Log4Shell CVE-2021-44228、永恒之蓝 MS17-010、Confluence CVE-2023-22515 等),`mock-scanner-results.json` 含 CVSS、漏洞描述、利用难度、复测建议字段 |

**JSON Schema 示例**(`create_scan_task` 输入):
```json
{
  "scan_type": "authenticated",
  "targets": ["host-0007", "host-0008"],
  "policy": "Web Application Scan",
  "credential_id": "cred-ssh-prod-01",
  "compliance_template": "等保2.0-三级"
}
```

### 2.5 威胁情报

| 字段 | 内容 |
|---|---|
| **工具类别** | 威胁情报 / IOC 关联 |
| **真实产品** | **MISP(开源)/ VirusTotal / AlienVault OTX / 微步在线 ThreatBook / 奇安信威胁情报中心** |
| **MCP Server 实现** | **SSE 模式**(`mcp-server-ti`,对接 3 个上游),Tool `query_ioc`(IP/域名/URL/Hash/Mutex)、`get_threat_actor`、`subscribe_feed`(订阅 STIX/TAXII feed) |
| **对接 Agent / Skill** | A2 告警归并 Agent(情报关联 Skill);A3 漏洞验证 Agent(PoC 安全生成时核查威胁源);A5 事件响应 Agent(阻断 IOC 触发情报确认);A7 复盘 Agent(生成 ATT&CK TTP 映射) |
| **数据交换格式** | STIX 2.1(标准)+ TAXII 2.1(传输) |
| **Mock 化方案** | 内置 `mock-ti-feed.json` 含 80 个 IOC(覆盖本 Demo 剧本用到的攻击者 IP `203.0.113.42`、C2 域名、4 个恶意 Hash),Demo 中 A2 Agent 调用 `query_ioc` 命中"APT-29 / Cozy Bear"标签,触发升级到 L2 审批 |

**JSON Schema 示例**(`query_ioc` 输入):
```json
{
  "indicator_type": "ipv4",
  "value": "203.0.113.42",
  "include_relations": true,
  "confidence_threshold": 60
}
```

**输出示例**:
```json
{
  "indicator": "203.0.113.42",
  "verdict": "malicious",
  "confidence": 92,
  "threat_actors": ["APT-29", "Cozy Bear"],
  "first_seen": "2024-03-12",
  "campaigns": ["SUNBURST-supply-chain"],
  "ttps": ["T1190", "T1071.001"],
  "tags": ["c2", "apt"]
}
```

### 2.6 通知通道(人机协同层物理通道)

| 字段 | 内容 |
|---|---|
| **工具类别** | 通知 / IM 通道 / 人机协同 |
| **真实产品** | **钉钉机器人 / 企业微信(WeCom)应用 / 飞书机器人 / Slack Webhook / 邮件 SMTP / 短信 SMS**(多通道适配) |
| **MCP Server 实现** | **SSE 模式**(`mcp-server-notify`,监听 `:8083/sse`),资源 `notify://channel/{channel_id}`、Tool `send_message`(入参 channel、recipient、template、severity)、`send_approval_card`(审批卡,带"通过/驳回/转交"按钮)、`get_delivery_status`(送达回执)、`subscribe_user_reply`(订阅用户回复) |
| **对接 Agent / Skill** | A0 Leader Agent(推送审批卡、升级告警、SLA 告警);A2 告警归并 Agent(高危告警直推工程师);A3 漏洞验证 Agent(漏洞确认通知业务方);A5 事件响应 Agent(响应执行通知);A6 证据审计 Agent(审计报告送达);A7 复盘 Agent(周报送达) |
| **数据交换格式** | 通道侧:**钉钉 Markdown / 企微 text+action_card / 飞书 interactive / SMTP RFC5322**;内部统一封装为 `notify_payload{channel, recipient, template_id, variables, severity, expire_at}` JSON |
| **Mock 化方案** | 内置 `mock-notify-channel.json` 模拟 4 个 IM 通道(钉钉/企微/飞书/邮件)各 3 个群组,共 12 个 recipient;`mock-approval-cards.json` 含 6 张预生成审批卡(H1 / H2 / 高危告警 / SLA 告警 / 漏洞修复 / 复盘确认),Demo 中演示"09:50 审批卡弹出→10:10 Alice 点击通过→回执回到 A0 Leader" |

**JSON Schema 示例**(`send_approval_card` 输入):
```json
{
  "card_id": "H1H2-20260815-001",
  "channel": "wechat",
  "recipient": "alice",
  "template": "approval_h1h2_merged",
  "variables": {
    "incident_id": "INC-20260815-001",
    "fact": "CVE-2026-XXXX SQL 注入,可利用性 HIGH",
    "plan": "WAF 拦截 + lib-db-driver 升级到 v2.3.2",
    "sla_minutes": 30,
    "actions": ["approve", "reject", "transfer"]
  },
  "expire_at": "2026-08-15T10:20:23+08:00"
}
```

**输出示例**:
```json
{
  "delivery_id": "DLV-20260815-001",
  "channel": "wechat",
  "recipient": "alice",
  "sent_at": "2026-08-15T09:50:23+08:00",
  "card_url": "wechat://card/H1H2-20260815-001",
  "status": "delivered",
  "ack": {"approved": true, "approver": "alice", "ts": "2026-08-15T10:10:00+08:00", "comment": "同意"}
}
```

> **L0.5 人机协同层**:本 MCP 是人机协同层的"物理通道"实现。人机协同层在 A0 Leader 之上提供 **Web 平台**(团队大屏 + 审批中心 + 知识检索,适配值班/会议/桌面场景)和 **IM 通道**(钉钉/企微/飞书,适配移动值守/出差/会议场景)两种前端,均通过通知通道 MCP 与 A0 Leader 双向通信。**安全工程师不再是"被动等通知的 1 个人",而是"人机协同层接入方"**,可在任一终端完成审批、查阅、复盘、培训。

### 2.7 MCP 工具集成总图

| MCP 工具 | 通信模式 | 上游产品 | 主用户 Agent | 安全分级 | 备注 |
|---|---|---|---|---|---|
| CMDB | stdio | 蓝鲸 / 1Panel | A1、A5 | L0 只读 / L1 标签 | 资产主数据 |
| SBOM | stdio | Dependency-Check / Syft | A1、A3 | L0 只读 | 软件物料 |
| SIEM | SSE | Elastic Security | A2 | L0 只读 | 告警源 |
| SOAR | SSE | Cortex XSOAR | A2、A5 | L1/L2 触发剧本 | 自动化响应 |
| 漏洞扫描 | stdio | Nessus / Nuclei | A1、A3 | L1 扫描 / L2 修复 | 主动探测 |
| 威胁情报 | SSE | MISP / VirusTotal | A2、A3、A5 | L0 只读 | IOC 关联 |
| **通知通道**(新增) | **SSE** | **钉钉 / 企微 / 飞书** | **A0 Leader、A2、A5** | **L0 通知 / L1 审批卡** | **人机协同层物理通道** |

---

## 三、可观测体系(三层)

可观测性是"人机协同层(1 名安全工程师)+ 8 个 Agent"能否真正落地的关键 —— 1 个安全工程师同时盯 8 个 Agent,必须靠可观测替他"看全场"。本项目自研 **AgentLoop 指标采集层 + AgentScope Studio 链路追踪 + 团队大屏** 三件套,部署在 Higress 网关之后,数据落 PolarDB 时序表 + Elasticsearch。

### 3.1 第一层:链路追踪(Tracing)

**目的**:把 8 个 Agent 的每一次协同"画出来",谁调了谁、上下文传了什么、哪一步慢、哪一步失败。

| 维度 | 设计 |
|---|---|
| **采集框架** | **AgentScope Studio**(阿里开源)作为 Trace 收集与可视化后端,采集器基于 OpenTelemetry SDK,所有 Agent 入口/出口/Skill 调用/MCP 工具调用均埋点 |
| **数据字段** | 每条 Span 12 字段:`trace_id`(贯穿一次完整事件,如 09:00 弱口令爆破事件全链)、`span_id`、`parent_span_id`、`agent_id`(A0-A7)、`skill_id`(S01-S23)、`mcp_tool`、`latency_ms`、`tokens_in`、`tokens_out`、`status`(ok/error/timeout)、`security_level`(L0-L3)、`risk_decision`(approved/blocked/escalated) |
| **存储** | Elasticsearch(ES 8.x,索引 `aegis-trace-{yyyy-MM-dd}`,按天滚动,保留 90 天热数据 + 1 年冷归档) |
| **关键能力** | ① **上下文传递可视化**:每次 A0 Leader→A2→A5 调度链可看到"事件 ID、原始告警、关联 CVE、关联 Runbook ID"如何流转;② **SLA 监控**:单 Skill P50/P95/P99 延迟,事件级端到端 P95(目标:30 分钟内完成 L1 闭环);③ **失败定位**:Span 树状图 + 错误 Span 高亮 |
| **辅助决策** | 安全工程师 1 眼看出"哪个 Agent 慢了、哪条 Skill 链路断了",无需逐日志排查。例:P95 超 30 分钟的自动标红,跳转到对应 Span |
| **Mock 化方案** | AgentScope Studio 直接接 Demo 剧本预生成 trace.json(含 47 个 Span,覆盖 09:00→11:30 全流程),无需真实 Agent 启动即可回放展示 |

### 3.2 第二层:指标监控(Metrics)

**目的**:8 Agent 团队的"健康仪表盘",让安全工程师秒判系统是否正常。

**采集框架**:**AgentLoop**(比赛推荐)+ Prometheus exporter,所有指标 30s 周期 push 到 **Prometheus → PolarDB 时序表**。

| 指标名 | 类型 | 计算方式 | 告警阈值 | 用途 |
|---|---|---|---|---|
| `agent_active_count{agent_id}` | Gauge | 心跳活跃 Agent 数 | 0 < x ≤ 8 | 团队大屏 Agent 状态卡 |
| `skill_invoke_total{agent_id, skill_id}` | Counter | Skill 累计调用次数 | - | 频次热度图 |
| `skill_invoke_latency_ms{quantile}` | Summary | P50/P95/P99 延迟 | P95 > 5s 警告 | SLA 看板 |
| `alert_false_positive_rate` | Gauge | 误报数 / 总告警数(7 天滚动) | > 30% 告警 | A2 Agent 自评估 |
| `alert_escalation_rate{from_level, to_level}` | Gauge | 升级率(L0→L1, L1→L2) | L1→L2 > 40% 告警 | 流程瓶颈诊断 |
| `vuln_verification_pass_rate` | Gauge | A3 复测通过 / 复测总数 | < 70% 告警 | 漏洞闭环质量 |
| `mcp_tool_call_total{tool, status}` | Counter | MCP 工具调用次数/成功率 | 错误率 > 5% 告警 | 工具健康度 |
| `mttd_seconds` | Histogram | 平均威胁检测时间(告警→归并完成) | P95 > 10min 告警 | 威胁检测 SLA |
| `mttr_seconds` | Histogram | 平均威胁响应时间(归并→隔离完成) | P95 > 30min 告警 | 事件响应 SLA |
| `rag_retrieval_hit_rate{kb_name}` | Gauge | 知识库检索命中率(5 套 KB 分别统计) | < 60% 警告 | RAG 质量 |
| `human_approval_pending_total` | Gauge | 待人工审批工单数 | > 5 告警 | 升级大屏告警 |
| `evidence_chain_completeness` | Gauge | 证据链完整率(6 类证据齐全) | < 95% 告警 | A6 审计质量 |
| **`agent_output_quality_score{agent_id}`**(新增) | **Gauge** | **A6 QualitySteward 评估每个 Agent 输出质量分(0-100),含 schema 合规 / 字段缺失 / 引用 KB 数 / 证据完整度 4 子项加权** | **< 70 告警** | **A6 自适应健康度** |
| **`skill_deviation_alert_total`**(新增) | **Counter** | **Skill 实际执行 vs Runbook 描述偏差告警数(S20 复盘 Skill 检测)** | **> 3/24h 告警** | **A6 Skill 漂移监控** |
| **`rule_drift_alert_total`**(新增) | **Counter** | **检测规则/合规规则版本漂移告警数(S22 任务派工对比基础规则库)** | **> 1/24h 告警** | **A6 规则漂移监控** |
| **`adaptive_feedback_triggered_total`**(新增) | **Counter** | **自适应反馈触发次数(A6 检测到偏差后自动派发改进任务的次数)** | **-** | **自适应闭环度量** |

**存储**:Prometheus(短期 15 天)+ PolarDB 时序表(长期 1 年,用于月度/季度评审报告)

**辅助决策**:
- 误报率突增 → A2 Agent 自动调参(threshold)或 A7 Agent 增加规则
- L1→L2 升级率过高 → 流程瓶颈,A0 Leader Agent 自动派工给 A4 合规岗优先处理
- RAG 命中率低 → 提示某 KB 需要补充语料(5 套 KB 分别看,定位更精准)
- MTTR P95 持续高 → 提示"待审批积压",安全工程师介入
- **agent_output_quality_score 持续下降** → A6 触发"Skill 重训"或"派工换路径"
- **skill_deviation_alert 突增** → A0 Leader 自动降权该 Skill,A7 重新生成 Runbook
- **rule_drift_alert 触发** → A0 Leader 推送工程师复核规则库版本

**Mock 化方案**:30 分钟预生成 metrics.csv,大屏直接展示真实指标计算结果(8 Agent 健康度、Skill 调用热度、误报率 18%、MTTR 22min、A6 输出质量分 88.5)。

### 3.3 第三层:团队大屏(Dashboard)

**目的**:**1 名安全工程师 + 1 块大屏(或 1 个 IM 通道)** 就能管理 8 Agent。Demo 中是核心展示页面。

**实现**:自研 React 18 + ECharts 5 大屏(亦可基于 Grafana 二次开发),**4 屏 10 区布局**,数据 5s 轮询,人机协同层双前端共用同一份数据源。

| 区域 | 指标 | 展示形式 | 辅助决策 |
|---|---|---|---|
| **左屏 1:团队作战图** | 8 Agent 状态卡(空闲/执行中/等待审批/异常 4 态) | 8 个 agent-card(色块+头像+当前任务 ID),参考 SRE 大屏风格 | 1 秒定位"哪个 Agent 卡住" |
| **左屏 2:实时事件流** | 实时告警流(时间倒序,带等级色标) | 时间轴列表(每条 1 行),含事件 ID / 来源 / 严重度 / 当前处理 Agent | 看告警处理速度,异常滞留事件标红 |
| **中屏:风险热力图** | 资产-威胁 2D 热力图(资产 30 节点 × 威胁类别 7 类) | ECharts heatmap,色阶从绿到红 | 1 秒找到"最危险资产组合" |
| **中屏:Skill 调用拓扑** | 8 Agent × 23 Skill 实时调用矩阵 | 桑基图 / 流向图,粗细=调用频次 | 看出"A2 主要调用了哪 3 个 Skill" |
| **中屏:LLM 成本与 SLA** | 当日 tokens、$ 成本、端到端 P95 | 3 个 stat tile + sparkline | 控制成本,看 SLA 趋势 |
| **右屏 1:升级告警** | L2/L3 待审批工单(倒计时) | 卡片列表(红/橙,带 sla_countdown) | 安全工程师只需关注这张屏 |
| **右屏 2:误报率与 RAG 命中率** | 双折线图(7 天趋势,5 套 KB 分别) | ECharts dual-line | 知识库与告警质量趋势 |
| **右屏 3:知识库健康** | 5 套 KB 的条数、命中率、最近更新 | 5 个 KB 卡片(绿/黄/红) | 哪套 KB 需要补充 |
| **底屏:Trace 关键路径** | 最近 5 条事件的端到端链路 | 5 个迷你 trace timeline(可点击展开) | 复盘"这条事件走了哪几步" |
| **🆕 右屏 4:自适应健康度 + 人机协同接入态**(A6 QualitySteward 专区) | ① Agent 输出质量分(过去 1h,0-100,8 Agent 各一格)② Skill 偏差告警数 ③ 规则漂移告警数 ④ 5 套 KB 检索命中率(分条) ⑤ 证据链完整率 ⑥ 自适应反馈触发次数(24h) ⑦ **人机协同接入态子面板**:当前接入前端(Web / IM)+ 角色活跃度(主审批人 / 备审批人 / 业务方 / 合规官)+ 通知通道健康度 | 6 个 stat tile + 1 个角色活跃度堆叠条 + 1 个接入模式切换徽章;**A6 专属色**(青蓝色调,与团队大屏主色区分) | 1 秒看"自适应机制是否健康、谁在线、在哪台设备上" |

**存储**:
- 实时数据(状态卡 / 事件流 / 自适应健康度):RocketMQ 推流(每事件 1 条消息,延迟 <1s)
- 历史数据(热力图 / 趋势图 / KB 命中率):PolarDB 时序表
- Trace 数据:ES(同第一层,5min 聚合)

**辅助决策**:
- 安全工程师在"升级告警"区做审批决策(支持 Web / IM 双端接入,出差/会议中也能秒批)
- "团队作战图" 1 秒看"团队是否满血"
- "风险热力图" 1 秒看"哪里是今晚重点"
- "**自适应健康度**" 1 秒看"A6 是否在替我盯着团队质量"

**Mock 化方案**:大屏前端硬编码 Demo 剧本(09:00→11:30),状态卡每 30s 切换一次(用 setInterval + 预生成状态序列),最终截图/录屏即可。**这是初赛评审最看重的"工程落地"可视化。**

**布局变化说明**:相对 V1.0 的 9 区布局,本版在右屏新增"**自适应健康度 + 人机协同接入态**"复合区(第 10 区),把 A6 QualitySteward 的 6 个核心指标与人机协同层接入态合并展示;保留其他 9 区不变,左屏/中屏/底屏零侵入。

---

## 四、基础设施总览(一张图)

```
                ┌──────────────────────────────────────────┐
                │   L0.5 人机协同层(1 名安全工程师双前端)   │
                │   ┌────────────┐    ┌────────────┐       │
                │   │ Web 平台   │    │ IM 通道    │       │
                │   │ 大屏+审批  │    │ 钉钉/企微  │       │
                │   └─────┬──────┘    └─────┬──────┘       │
                └─────────┼─────────────────┼──────────────┘
                          │(审批 / 查阅)    │(通知 MCP)
                ┌─────────▼─────────────────▼──────────────┐
                │   A0 Leader Agent(团队领导)              │
                └──────────────┬───────────────────────────┘
                               │(派工 / 状态)
                ┌──────────────▼───────────────────────────┐
                │   Higress 网关 + Nacos 配置中心           │
                └──┬─────┬─────┬─────┬─────┬─────┬────┬────┘
                   │     │     │     │     │     │    │
   ┌───────────────┘     │     │     │     │     │    └────────────┐
   │     ┌───────────────┘     │     │     │     └────────────┐    │
   │     │     ┌───────────────┘     │     └────────────┐     │    │
   ▼     ▼     ▼     ▼     ▼     ▼     ▼     ▼     ▼     ▼    ▼
┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐   ┌──────┐┌────┐
│ A0 ││ A1 ││ A2 ││ A3 ││ A4 ││ A5 ││ A6 ││ A7 │   │ 团队 ││审批│
│Lead││资产││告警││漏洞││合规││响应││审计││复盘│   │ 大屏 ││ 端 │
│ er ││    ││    ││    ││    ││    ││    ││    │   │10 区 ││    │
└──┬─┘└──┬─┘└──┬─┘└──┬─┘└──┬─┘└──┬─┘└──┬─┘└──┬─┘   └──┬───┘└──┬─┘
   │     │     │     │     │     │     │     │        │      │
   └─────┴─────┴──┬──┴─────┴─────┴─────┴─────┘        │      │
                  │                                    │      │
   ┌──────────────▼──────────────┐                     │      │
   │  23 Skill × 5 RAG KB        │                     │      │
   │  (PolarDB + pgvector)       │                     │      │
   │  KB-Compliance / Vuln /     │                     │      │
   │  Runbook / Postmortem /     │                     │      │
   │  **SupplyChain**(新增)      │                     │      │
   └──────────────┬──────────────┘                     │      │
                  │                                    │      │
   ┌──────────────▼──────────────┐    ┌────────────────▼──────▼──┐
   │  6 类 MCP Server(7 个)      │    │   可观测三层             │
   │  CMDB/SBOM/SIEM/SOAR/       │    │   - AgentScope Studio    │
   │  Scanner/TI/**Notify**      │    │   - AgentLoop + Prom     │
   │  (新增)                     │    │   - 团队大屏(10 区)      │
   └──────────────┬──────────────┘    └──────────────────────────┘
                  │
   ┌──────────────▼──────────────┐
   │  RocketMQ(事件流)            │
   │  PolarDB(时序 + 业务)        │
   │  ES(Trace)                   │
   └─────────────────────────────┘
```

**总图要点**:
- **L0.5 人机协同层** 在最上层,代表 1 名安全工程师的两种接入前端(Web 平台 / IM 通道),通过通知通道 MCP 与 A0 Leader 双向通信
- **8 个 Agent** 由 A0 Leader(原"调度")统一派工,其他 7 个 Agent 各司其职
- **5 套 RAG KB** 落在统一 PolarDB + pgvector 上,通过 Skill 调用为 Agent 提供决策证据
- **6 类 MCP Server**(共 7 个进程,SIEM/SOAR 拆 2 个)通过 Higress 网关对外暴露
- **可观测三层** 与 MCP/Agent 双向耦合,数据落 PolarDB 时序 + ES

---

## 五、Mock 化清单(初赛 36 小时交付版)

为保证 Demo 100% 可演示,以下组件在初赛使用 Mock Adapter 实现,接口与生产完全一致:

| 组件 | Mock 方式 | 真实切换路径 |
|---|---|---|
| 原 4 套 RAG KB | 内置 50+30+8+10 条预生成数据 | 启动时读取 Nacos 配置,真实模式对接 PolarDB + pgvector |
| **KB-SupplyChain(新增)** | **内置 50 条精选条目(`mock-kb-supply-chain.json`)** | **启动时读取 Nacos 配置,真实模式对接 NVD + EPSS + KEV + SPDX + NIST** |
| 原 5 类 MCP 工具 | 6 个 mock-mcp-server(返回固定 JSON) | 替换 stdio/SSE endpoint 为真实服务地址 |
| **通知通道 MCP(新增)** | **7 个 mock-mcp-server 总数(`mock-notify-channel.json` 模拟 4 通道 12 群组)** | **替换为钉钉/企微/飞书真实 Webhook + OAuth 2.0** |
| SIEM 告警 | mock-siem-events.json 定时推流到 RocketMQ | 对接真实 Elastic Security SDK |
| 漏洞扫描 | mock-scanner-results.json 预生成报告 | 启动 Nessus 真实任务 |
| 威胁情报 | mock-ti-feed.json 命中预设 IOC | 对接微步在线 / MISP |
| 链路追踪 | 预生成 trace.json(47 Span)回放 | OpenTelemetry SDK 自动采集 |
| 指标监控 | 预生成 metrics.csv(30 min 序列) | Prometheus exporter 自动采集 |
| 团队大屏 | setInterval 切换状态卡(预生成序列) | WebSocket 实时推流 |
| **人机协同层(新增)** | **前端硬编码审批卡 + IM 群组 + 角色表** | **对接真实 SSO + 钉钉/企微/飞书 SDK** |

---

## 六、对齐评审维度自检

- **场景价值 25%**:"1 人 1 队"叙事 + 5 套 KB + 7 MCP 工具(含通知通道),完整替代小型 SOC 团队,人机协同层双模式让 1 名工程师 7×24 移动值守 ✅
- **多 Agent 协同 25%**:A0 Leader Agent 经 KB-Runbook 派工,经 MCP-SIEM/MCP-CMDB/MCP-Notify 协同,人机协同层作为物理通道 ✅
- **Skill 工程 25%**:23 Skill 全部以 5 套 KB 为决策证据,经 MCP 工具执行,A6 QualitySteward 监控 Skill 偏差与规则漂移 ✅
- **工程落地 20%**:本文 RAG × MCP × 可观测 三件套完整,PolarDB + RocketMQ + ES + AgentScope + AgentLoop 全栈落地,5 套 KB 约 29.4 万条数据,16 个核心指标 ✅
- **开源 5%**:MCP Server 与大屏前端全部开源,Roadmap 明确 ✅

---

**文档结束。** 评审看到的是"可生产"的工程结构,初赛 Demo 用 Mock 数据驱动,真实数据接入只需替换 Adapter。
