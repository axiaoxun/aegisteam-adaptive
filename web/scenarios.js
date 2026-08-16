// AegIsLoop Adaptive — 3 编排流预录剧本(并行播放)
// 22 + 26 + 14 = 62 步事件流
// 格式:{ step, ts, type, agent, skill, level, message, status }

export const SCENARIOS = [
  {
    id: 'flow_alert',
    name: 'Flow 1 · 告警流',
    short: 'INC-2001 SSH 暴力破解',
    desc: '5 个境外 IP + 1 个 Tor 出口对 prod-web-03 暴力破解,使用 OpenSSH 7.4p1',
    severity: 'L2',
    color: '#f59e0b',
    stepCount: 22,
  },
  {
    id: 'flow_regulator',
    name: 'Flow 2 · 监管通报流',
    short: 'INC-2002 浙江网安通报',
    desc: 'ZJWA-2026-0816-001,3 个 PII 数据库涉及 R-001/R-002/R-003',
    severity: 'L1',
    color: '#ef4444',
    stepCount: 26,
  },
  {
    id: 'flow_regulation',
    name: 'Flow 3 · 新法规响应流',
    short: 'INC-2003 生成式 AI 办法',
    desc: '《生成式 AI 服务管理暂行办法》9-1 实施,3 个 AI 应用需双路径合规改造',
    severity: 'L0',
    color: '#10b981',
    stepCount: 14,
  },
];

// === Flow 1: 告警流(22 步) ===
export const flow_alert = [
  { step: 1, ts: 'T+0.0s', type: 'exec', agent: 'A0', skill: 'S01', level: 'info', message: '收到 SIEM 告警 5 起,来源 prod-web-03,开始事件路由', status: 'running' },
  { step: 2, ts: 'T+0.3s', type: 'exec', agent: 'A0', skill: 'S02', level: 'info', message: '并行派遣 A1/A2/A3 三 Worker', status: 'done' },
  { step: 3, ts: 'T+0.5s', type: 'exec', agent: 'A1', skill: 'S05', level: 'info', message: '调用 mock_cmdb.query_asset,资产 prod-web-03(关键级 P1)', status: 'done' },
  { step: 4, ts: 'T+0.8s', type: 'exec', agent: 'A1', skill: 'S06', level: 'info', message: '调用 mock_sbom.get_sbom,OpenSSH 7.4p1 + OpenSSL 1.0.2k', status: 'done' },
  { step: 5, ts: 'T+1.0s', type: 'warn', agent: 'A2', skill: 'S09', level: 'warn', message: '5 起告警聚类:同一攻击者 + 1 个 Tor 出口(已 STIX 标记)', status: 'done' },
  { step: 6, ts: 'T+1.3s', type: 'exec', agent: 'A2', skill: 'S11', level: 'info', message: '调用 mock_threat_intel.enrich_ioc,Tor 标签命中 Mirai botnet C2', status: 'done' },
  { step: 7, ts: 'T+1.6s', type: 'exec', agent: 'A2', skill: 'S12', level: 'info', message: 'MITRE TTP 映射: T1110 (Brute Force) + T1078 (Valid Accounts)', status: 'done' },
  { step: 8, ts: 'T+1.8s', type: 'exec', agent: 'A3', skill: 'S13', level: 'info', message: '调用 mock_vuln_scanner.scan,OpenSSH 7.4p1 命中 CVE-2023-38408(CVSS 9.8)', status: 'done' },
  { step: 9, ts: 'T+2.1s', type: 'exec', agent: 'A3', skill: 'S14', level: 'info', message: 'CVE-2023-38408:EPSS 0.847 / CISA KEV 命中(已列入强制修复)', status: 'done' },
  { step: 10, ts: 'T+2.3s', type: 'exec', agent: 'A3', skill: 'S14', level: 'info', message: 'OpenSSL 1.0.2k 命中 CVE-2020-15778(CVSS 7.8)', status: 'done' },
  { step: 11, ts: 'T+2.5s', type: 'warn', agent: 'A0', skill: 'S03', level: 'warn', message: '证据链: 告警 5 起 + IOC 6 个 + CVE 2 个 + 资产 1 个', status: 'done' },
  { step: 12, ts: 'T+2.7s', type: 'exec', agent: 'A0', skill: 'S01', level: 'info', message: 'A0 内部 AgentLoop 迭代 1/5:重新计算影响半径', status: 'done' },
  { step: 13, ts: 'T+3.0s', type: 'exec', agent: 'A0', skill: 'S01', level: 'info', message: 'A0 内部 AgentLoop 迭代 2/5:考虑横向移动可能性', status: 'done' },
  { step: 14, ts: 'T+3.3s', type: 'exec', agent: 'A0', skill: 'S01', level: 'info', message: '升级判定: L2(中危,P1 资产 + KEV 漏洞 + Tor 出口)', status: 'done' },
  { step: 15, ts: 'T+3.5s', type: 'exec', agent: 'A5', skill: 'S21', level: 'info', message: 'A5 生成处置方案:封禁 5 IP + 升级 OpenSSH + 临时禁用密码登录', status: 'done' },
  { step: 16, ts: 'T+3.7s', type: 'approval', agent: 'A4', skill: 'S20', level: 'info', message: 'H1 关口:封禁 5 IP 需安全负责人审批', status: 'pending' },
  { step: 17, ts: 'T+4.0s', type: 'approval', agent: 'L0.5', level: 'info', message: 'L0.5 人工审批通过(用户:张主管,耗时 2 分钟)', status: 'done' },
  { step: 18, ts: 'T+4.3s', type: 'exec', agent: 'A5', skill: 'S23', level: 'info', message: 'L1 自动执行:封禁 5 IP(防火墙规则已下发)', status: 'done' },
  { step: 19, ts: 'T+4.5s', type: 'notify', agent: 'A0', skill: 'S04', level: 'info', message: '调用 mock_notify.send_alert(钉钉群 + 邮件 + SMS)', status: 'done' },
  { step: 20, ts: 'T+4.8s', type: 'exec', agent: 'A6', skill: 'S24', level: 'info', message: 'A6 质量评分: 0.94(高),流程无回滚', status: 'done' },
  { step: 21, ts: 'T+5.0s', type: 'exec', agent: 'A6', skill: 'S25', level: 'info', message: 'A6 漂移检测: 0 异常,无 RAG 漂移', status: 'done' },
  { step: 22, ts: 'T+5.3s', type: 'done', agent: 'A7', skill: 'S28', level: 'info', message: '复盘文档已生成,KB-Postmortem+1', status: 'done' },
];

// === Flow 2: 监管通报流(26 步,管理+技术双路并行) ===
export const flow_regulator = [
  { step: 1, ts: 'T+0.0s', type: 'exec', agent: 'A0', skill: 'S01', level: 'info', message: '收到浙江省网安 ZJWA-2026-0816-001 通报,优先级 L1', status: 'running' },
  { step: 2, ts: 'T+0.3s', type: 'exec', agent: 'A0', skill: 'S02', level: 'info', message: '并行派遣 A1/A4/A4(双路径)', status: 'done' },
  { step: 3, ts: 'T+0.5s', type: 'exec', agent: 'A4', skill: 'S17', level: 'info', message: '合规检索 KB-Compliance:通报涉及 R-001/R-002/R-003 三项', status: 'done' },
  { step: 4, ts: 'T+0.8s', type: 'exec', agent: 'A1', skill: 'S05', level: 'info', message: '查询 3 个 PII 数据库资产清单', status: 'done' },
  { step: 5, ts: 'T+1.0s', type: 'warn', agent: 'A1', skill: 'S05', level: 'warn', message: '识别 db-pii-user / db-pii-order / db-pii-payment(P0 资产)', status: 'done' },
  { step: 6, ts: 'T+1.2s', type: 'exec', agent: 'A1', skill: 'S08', level: 'info', message: '资产关键级评估: P0(金融 PII)', status: 'done' },
  { step: 7, ts: 'T+1.5s', type: 'exec', agent: 'A4', skill: 'S17', level: 'info', message: 'R-001 弱口令扫描启动(管理路径)', status: 'done' },
  { step: 8, ts: 'T+1.7s', type: 'exec', agent: 'A1', skill: 'S05', level: 'info', message: '技术路径:SSH 配置审计', status: 'done' },
  { step: 9, ts: 'T+2.0s', type: 'warn', agent: 'A1', skill: 'S05', level: 'warn', message: '发现 db-pii-order 启用 password auth(弱口令命中)', status: 'done' },
  { step: 10, ts: 'T+2.3s', type: 'exec', agent: 'A4', skill: 'S19', level: 'info', message: 'PIA 评估启动(对 3 个 PII 数据库)', status: 'done' },
  { step: 11, ts: 'T+2.5s', type: 'exec', agent: 'A1', skill: 'S07', level: 'info', message: '关联查询:数据出境事件(近 30 天)', status: 'done' },
  { step: 12, ts: 'T+2.8s', type: 'warn', agent: 'A1', skill: 'S07', level: 'warn', message: '发现 2 起出境查询:order → HK / payment → SG', status: 'done' },
  { step: 13, ts: 'T+3.0s', type: 'exec', agent: 'A4', skill: 'S18', level: 'info', message: 'R-002 数据出境合规检查:未通过安全评估', status: 'done' },
  { step: 14, ts: 'T+3.3s', type: 'exec', agent: 'A4', skill: 'S19', level: 'info', message: 'R-003 PIA 缺失:3 个数据库均无最近 1 年 PIA 报告', status: 'done' },
  { step: 15, ts: 'T+3.5s', type: 'approval', agent: 'A4', skill: 'S20', level: 'info', message: 'H1 关口:断网处置需 CISO 审批', status: 'pending' },
  { step: 16, ts: 'T+3.8s', type: 'exec', agent: 'A0', skill: 'S03', level: 'info', message: '证据链:通报+3 资产+2 出境事件+3 PIA 缺失', status: 'done' },
  { step: 17, ts: 'T+4.0s', type: 'approval', agent: 'L0.5', level: 'info', message: 'L0.5 审批中(等待 CISO)', status: 'pending' },
  { step: 18, ts: 'T+4.3s', type: 'exec', agent: 'A0', skill: 'S01', level: 'info', message: 'A0 AgentLoop 迭代 1/5:并行启动技术修复', status: 'done' },
  { step: 19, ts: 'T+4.5s', type: 'exec', agent: 'A5', skill: 'S23', level: 'info', message: 'L1 自动:禁用 password auth(仅 key auth)', status: 'done' },
  { step: 20, ts: 'T+4.8s', type: 'exec', agent: 'A5', skill: 'S23', level: 'info', message: 'L1 自动:阻断 2 起出境路由', status: 'done' },
  { step: 21, ts: 'T+5.0s', type: 'approval', agent: 'A4', skill: 'S20', level: 'info', message: 'H2 关口:PIA 报告生成需法务+安全双签', status: 'pending' },
  { step: 22, ts: 'T+5.3s', type: 'exec', agent: 'A0', skill: 'S04', level: 'info', message: '通知:省网安对接人 + 集团 CISO + 法务总监', status: 'done' },
  { step: 23, ts: 'T+5.5s', type: 'exec', agent: 'A4', skill: 'S19', level: 'info', message: 'PIA 报告模板生成(由 A4 起草)', status: 'done' },
  { step: 24, ts: 'T+5.8s', type: 'exec', agent: 'A6', skill: 'S24', level: 'info', message: 'A6 质量评分: 0.87(良好),1 次迭代,0 回滚', status: 'done' },
  { step: 25, ts: 'T+6.0s', type: 'exec', agent: 'A6', skill: 'S27', level: 'info', message: 'A6 自适应反馈:KB-Compliance 新增 1 条 R-002 出境判例', status: 'done' },
  { step: 26, ts: 'T+6.3s', type: 'done', agent: 'A7', skill: 'S28', level: 'info', message: '复盘+上报材料生成完毕,3 工作日内回复省网安', status: 'done' },
];

// === Flow 3: 新法规响应流(14 步) ===
export const flow_regulation = [
  { step: 1, ts: 'T+0.0s', type: 'exec', agent: 'A0', skill: 'S01', level: 'info', message: '《生成式 AI 服务管理暂行办法》9-1 生效,7 天倒计时', status: 'running' },
  { step: 2, ts: 'T+0.3s', type: 'exec', agent: 'A4', skill: 'S18', level: 'info', message: '条款 diff: 新增 5 项合规要求(数据标注/安全评估/语料合规/用户管理/投诉处理)', status: 'done' },
  { step: 3, ts: 'T+0.5s', type: 'exec', agent: 'A1', skill: 'S05', level: 'info', message: 'AI 应用资产清单: ai-customer-service / ai-doc-summary / ai-code-review', status: 'done' },
  { step: 4, ts: 'T+0.8s', type: 'exec', agent: 'A4', skill: 'S17', level: 'info', message: '对照 5 项条款评估现状(双路径:管理+技术)', status: 'done' },
  { step: 5, ts: 'T+1.0s', type: 'exec', agent: 'A4', skill: 'S17', level: 'info', message: '管理路径:ai-doc-summary 缺安全评估 → 需补充', status: 'done' },
  { step: 6, ts: 'T+1.3s', type: 'exec', agent: 'A4', skill: 'S17', level: 'info', message: '管理路径:ai-code-review 语料来源含开源 → 需授权核查', status: 'done' },
  { step: 7, ts: 'T+1.5s', type: 'exec', agent: 'A3', skill: 'S13', level: 'info', message: '技术路径:扫描 3 个 AI 应用依赖,发现 transformers 4.21(GPT-2 旧版)', status: 'done' },
  { step: 8, ts: 'T+1.8s', type: 'exec', agent: 'A3', skill: 'S16', level: 'info', message: '升级建议:升级 transformers ≥ 4.35,补充模型水印', status: 'done' },
  { step: 9, ts: 'T+2.0s', type: 'exec', agent: 'A4', skill: 'S19', level: 'info', message: 'PIA 启动:3 个 AI 应用各 1 份', status: 'done' },
  { step: 10, ts: 'T+2.3s', type: 'approval', agent: 'A4', skill: 'S20', level: 'info', message: 'H1 关口:停用 ai-doc-summary 7 天需业务+法务双签', status: 'pending' },
  { step: 11, ts: 'T+2.5s', type: 'exec', agent: 'A6', skill: 'S26', level: 'info', message: 'A6 RAG 健康检查: KB-Compliance 已加载新办法全文', status: 'done' },
  { step: 12, ts: 'T+2.8s', type: 'exec', agent: 'A0', skill: 'S02', level: 'info', message: 'A0 触发 Replan:并行启动技术升级 + 管理整改', status: 'done' },
  { step: 13, ts: 'T+3.0s', type: 'exec', agent: 'A5', skill: 'S21', level: 'info', message: '生成双轨改造计划(管理 4 步 + 技术 5 步)', status: 'done' },
  { step: 14, ts: 'T+3.3s', type: 'done', agent: 'A0', skill: 'S01', level: 'info', message: '9-1 前完成度 87%,1 项 PIA 待签,无业务中断', status: 'done' },
];

// === 审批队列(H1/H2 关口) ===
export const APPROVAL_QUEUE = [
  { id: 'APR-001', scenario: 'INC-2001', level: 'H1', action: '封禁 5 个境外 IP', requester: 'A5', approver: '张主管', status: 'approved', waitTime: '2m' },
  { id: 'APR-002', scenario: 'INC-2002', level: 'H1', action: '断网 db-pii-order', requester: 'A4', approver: 'CISO 王总', status: 'pending', waitTime: '5m' },
  { id: 'APR-003', scenario: 'INC-2002', level: 'H2', action: 'PIA 报告双签', requester: 'A4', approver: '法务+安全', status: 'pending', waitTime: '8m' },
  { id: 'APR-004', scenario: 'INC-2003', level: 'H1', action: '停用 ai-doc-summary 7 天', requester: 'A4', approver: '业务+法务', status: 'pending', waitTime: '12m' },
  { id: 'APR-005', scenario: 'INC-2001', level: 'H2', action: '升级 OpenSSH 全集群', requester: 'A5', approver: '运维总监', status: 'approved', waitTime: '1m' },
];

// === Nacos AI Registry 状态(简化为:已注册,无阶段区分) ===
// 注:实际为本地 mock,未对接真实 Nacos 服务;但行为契约与 Nacos 一致
export const NACOS_REGISTRY = {
  registered: 32,        // 已注册 Skill 数
  total: 32,             // 总数
  grayReleasing: 0,      // 灰度中
  healthy: 32,           // 健康
  degraded: 0,           // 降级
  rolledBack: 0,         // 回滚
  registryUrl: 'nacos://aegisloop.ai.registry:8848',
  namespace: 'aegisloop-adaptive',
  group: 'AEGISLOOP_SKILLS',
  lastSync: '2026-08-16 09:23:45',
  rollbackRate: 0.000,
  note: '本地 Mock,与 Nacos 行为契约一致(初赛+复赛统一行为)',
};
