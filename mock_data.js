// AegIsLoop Adaptive — Mock 元数据
// 8 Agent + 32 Skill + 6 MCP + 5 RAG

export const BRAND = {
  short: 'AegIsLoop',
  full: 'AegIsLoop Adaptive',
  cn: 'AegIsLoop 自适应 AI 安全运营系统',
  tagline: '8 个岗位化 Agent + 1 个灵活的人机协同层 = 1 支自适应增强的安全运营团队',
  version: '1.0.0',
  team: 'AegIsLoop Adaptive Team',
  repo: 'axiaoxun/aegisteam-adaptive',
  license: 'Apache 2.0',
};

export const AGENTS = [
  {
    id: 'a0_leader',
    name: 'A0 TeamLeader',
    role: 'aegisloop-leader',
    type: 'leader',
    desc: '团队编排中枢,AgentLoop 调度(max_iterations=5, max_parallel=3)',
    skillCount: 4,
    color: '#8b5cf6',
  },
  {
    id: 'a1_asset_manager',
    name: 'A1 资产管理',
    role: 'aegisloop-a1',
    type: 'worker',
    desc: 'CMDB 资产查询 + SBOM 软件物料清单',
    skillCount: 4,
    color: '#3b82f6',
  },
  {
    id: 'a2_threat_detector',
    name: 'A2 威胁检测',
    role: 'aegisloop-a2',
    type: 'worker',
    desc: '告警融合 + IOC 富化 + MITRE TTP 映射',
    skillCount: 4,
    color: '#10b981',
  },
  {
    id: 'a3_vuln_verifier',
    name: 'A3 漏洞验证',
    role: 'aegisloop-a3',
    type: 'worker',
    desc: 'CVE 5.0 + EPSS + CISA KEV 三段式验证',
    skillCount: 4,
    color: '#f59e0b',
  },
  {
    id: 'a4_compliance_guard',
    name: 'A4 合规管理',
    role: 'aegisloop-a4',
    type: 'worker',
    desc: '5 RAG 知识库 + 双路径(管理+技术)',
    skillCount: 4,
    color: '#a855f7',
  },
  {
    id: 'a5_incident_responder',
    name: 'A5 应急响应',
    role: 'aegisloop-a5',
    type: 'worker',
    desc: 'L0-L3 风险分级 + 不可自动化清单',
    skillCount: 3,
    color: '#ec4899',
  },
  {
    id: 'a6_quality_steward',
    name: 'A6 自适应引擎',
    role: 'aegisloop-a6',
    type: 'worker',
    desc: 'Adaptive 引擎核心:质量评分 + 漂移检测 + RAG 健康 + 自适应反馈',
    skillCount: 4,
    color: '#06b6d4',
    isAdaptive: true,
  },
  {
    id: 'a7_knowledge_weaver',
    name: 'A7 复盘织造',
    role: 'aegisloop-a7',
    type: 'worker',
    desc: '事故复盘 + 知识图谱更新,与 A6 联动',
    skillCount: 5,
    color: '#84cc16',
  },
];

// 32 Skill(S01-S32),与 skills/*/SKILL.md 一一对应
export const SKILLS = [
  // A0 Leader — 编排(4)
  { id: 'S01', name: 'incident_routing',     agent: 'A0', category: '编排', version: '1.1.0', calls: 1247, successRate: 0.991, p95: 89,  usedIn: [1, 2, 3] },
  { id: 'S02', name: 'worker_dispatch',      agent: 'A0', category: '编排', version: '1.2.0', calls: 891,  successRate: 0.987, p95: 67,  usedIn: [1, 2, 3] },
  { id: 'S03', name: 'evidence_chain',       agent: 'A0', category: '编排', version: '1.1.0', calls: 1102, successRate: 0.995, p95: 124, usedIn: [1, 2, 3] },
  { id: 'S04', name: 'approval_gate',        agent: 'A0', category: '编排', version: '1.0.0', calls: 234,  successRate: 1.000, p95: 56,  usedIn: [1, 2, 3] },
  // A1 资产 — 资产(4)
  { id: 'S05', name: 'asset_query',          agent: 'A1', category: '资产', version: '1.2.0', calls: 3421, successRate: 0.994, p95: 45,  usedIn: [1, 2, 3] },
  { id: 'S06', name: 'sbom_query',           agent: 'A1', category: '资产', version: '1.1.0', calls: 1893, successRate: 0.991, p95: 78,  usedIn: [1] },
  { id: 'S07', name: 'vuln_to_asset',        agent: 'A1', category: '资产', version: '1.3.0', calls: 2104, successRate: 0.985, p95: 67,  usedIn: [1, 2] },
  { id: 'S08', name: 'asset_criticality',    agent: 'A1', category: '资产', version: '1.0.0', calls: 1567, successRate: 0.992, p95: 34,  usedIn: [2] },
  // A2 检测 — 检测(4)
  { id: 'S09', name: 'alert_fusion',         agent: 'A2', category: '检测', version: '1.2.0', calls: 2891, successRate: 0.978, p95: 156, usedIn: [1] },
  { id: 'S10', name: 'impact_mapping',       agent: 'A2', category: '检测', version: '1.1.0', calls: 1203, successRate: 0.983, p95: 89,  usedIn: [1, 2] },
  { id: 'S11', name: 'ioc_enrichment',       agent: 'A2', category: '检测', version: '1.2.0', calls: 3456, successRate: 0.989, p95: 112, usedIn: [1] },
  { id: 'S12', name: 'attack_pattern',       agent: 'A2', category: '检测', version: '1.3.0', calls: 892,  successRate: 0.975, p95: 234, usedIn: [1] },
  // A3 漏洞 — 漏洞(4)
  { id: 'S13', name: 'vuln_scan',            agent: 'A3', category: '漏洞', version: '1.1.0', calls: 1678, successRate: 0.992, p95: 567, usedIn: [1, 3] },
  { id: 'S14', name: 'cve_lookup',           agent: 'A3', category: '漏洞', version: '1.2.0', calls: 2456, successRate: 0.996, p95: 134, usedIn: [1, 3] },
  { id: 'S15', name: 'evidence_integrity',   agent: 'A3', category: '漏洞', version: '1.0.0', calls: 567,  successRate: 1.000, p95: 89,  usedIn: [1] },
  { id: 'S16', name: 'fix_advisor',          agent: 'A3', category: '漏洞', version: '1.0.0', calls: 1102, successRate: 0.981, p95: 178, usedIn: [1, 3] },
  // A4 合规 — 合规(4)
  { id: 'S17', name: 'compliance_lookup',    agent: 'A4', category: '合规', version: '1.2.0', calls: 1834, successRate: 0.994, p95: 67,  usedIn: [2, 3] },
  { id: 'S18', name: 'regulation_diff',      agent: 'A4', category: '合规', version: '1.1.0', calls: 423,  successRate: 0.979, p95: 234, usedIn: [3] },
  { id: 'S19', name: 'pia_assessment',       agent: 'A4', category: '合规', version: '1.0.0', calls: 234,  successRate: 0.987, p95: 345, usedIn: [2, 3] },
  { id: 'S20', name: 'approval_routing',     agent: 'A4', category: '合规', version: '1.0.0', calls: 567,  successRate: 0.991, p95: 78,  usedIn: [1, 2, 3] },
  // A5 响应 — 响应(3)
  { id: 'S21', name: 'remediation_plan',     agent: 'A5', category: '响应', version: '1.3.0', calls: 678,  successRate: 0.978, p95: 234, usedIn: [1, 2, 3] },
  { id: 'S22', name: 'risk_guard',           agent: 'A5', category: '响应', version: '1.2.0', calls: 892,  successRate: 0.995, p95: 45,  usedIn: [1, 2, 3] },
  { id: 'S23', name: 'l1_auto_execute',      agent: 'A5', category: '响应', version: '1.1.0', calls: 234,  successRate: 0.991, p95: 567, usedIn: [1, 2] },
  // A6 质量 — 质量(4 个自适应新 Skill)
  { id: 'S24', name: 'output_quality',       agent: 'A6', category: '质量', version: '1.1.0', calls: 1834, successRate: 0.992, p95: 89,  usedIn: [1, 2, 3], isNew: true },
  { id: 'S25', name: 'drift_detection',      agent: 'A6', category: '质量', version: '1.1.0', calls: 567,  successRate: 0.984, p95: 234, usedIn: [1, 2],     isNew: true },
  { id: 'S26', name: 'rag_health',           agent: 'A6', category: '质量', version: '1.0.0', calls: 234,  successRate: 0.997, p95: 178, usedIn: [3],          isNew: true },
  { id: 'S27', name: 'adaptive_feedback',    agent: 'A6', category: '质量', version: '1.2.0', calls: 89,   successRate: 0.978, p95: 312, usedIn: [2],          isNew: true },
  // A7 复盘 — 复盘(5)
  { id: 'S28', name: 'postmortem_gen',       agent: 'A7', category: '复盘', version: '1.0.0', calls: 24,   successRate: 1.000, p95: 567, usedIn: [1, 2] },
  { id: 'S29', name: 'rag_rewind',           agent: 'A7', category: '复盘', version: '1.0.0', calls: 18,   successRate: 0.944, p95: 789, usedIn: [2] },
  { id: 'S30', name: 'lesson_extraction',    agent: 'A7', category: '复盘', version: '1.0.0', calls: 12,   successRate: 1.000, p95: 432, usedIn: [1] },
  { id: 'S31', name: 'improvement_tracking', agent: 'A7', category: '复盘', version: '1.0.0', calls: 21,   successRate: 0.976, p95: 345, usedIn: [1, 2, 3] },
  { id: 'S32', name: 'runbook_update',       agent: 'A7', category: '复盘', version: '1.0.0', calls: 9,    successRate: 1.000, p95: 678, usedIn: [1, 2] },
];

export const MCP_TOOLS = [
  { id: 'mock_cmdb',          desc: 'CMDB 资产查询',           functions: 2, calls: 4521, latency: 23,  status: 'healthy' },
  { id: 'mock_sbom',          desc: 'SBOM 软件物料清单',        functions: 2, calls: 1893, latency: 41,  status: 'healthy' },
  { id: 'mock_siem',          desc: 'SIEM 安全信息事件管理',     functions: 2, calls: 8932, latency: 67,  status: 'healthy' },
  { id: 'mock_vuln_scanner',  desc: '漏洞扫描器',              functions: 2, calls: 2341, latency: 134, status: 'healthy' },
  { id: 'mock_threat_intel',  desc: '威胁情报',                functions: 2, calls: 1247, latency: 89,  status: 'healthy' },
  { id: 'mock_notify',        desc: '通知(IM/邮件/SMS)',         functions: 2, calls: 567,  latency: 156, status: 'degraded' },
];

export const RAG_KNOWLEDGE = [
  { id: 'KB-Compliance',   name: '合规法规库',     docs: 1800,   hitRate: 0.847, lastUpdate: '2026-08-15' },
  { id: 'KB-Vuln',         name: '漏洞情报库',     docs: 285000, hitRate: 0.923, lastUpdate: '2026-08-15' },
  { id: 'KB-Runbook',      name: '应急预案库',     docs: 2400,   hitRate: 0.812, lastUpdate: '2026-08-12' },
  { id: 'KB-Postmortem',   name: '复盘案例库',     docs: 240,    hitRate: 0.789, lastUpdate: '2026-08-10' },
  { id: 'KB-SupplyChain',  name: '供应链风险库',   docs: 5000,   hitRate: 0.834, lastUpdate: '2026-08-14' },
];

export const METRICS = [
  { label: 'MTTD',          value: '4.2m',   trend: 'down' },
  { label: 'MTTR',          value: '18m',    trend: 'down' },
  { label: '自动闭环率',     value: '73.4%',  trend: 'up'   },
  { label: '误报率',         value: '6.2%',   trend: 'down' },
  { label: 'Skill成功率',    value: '98.7%',  trend: 'up'   },
  { label: 'RAG命中率',      value: '84.1%',  trend: 'up'   },
  { label: '今日告警',       value: '1,247',  trend: 'flat' },
  { label: '今日闭环',       value: '915',    trend: 'up'   },
  { label: '今日升级',       value: '12',     trend: 'flat' },
  { label: 'P1 事故',       value: '2',      trend: 'flat' },
  { label: '审批待办',       value: '5',      trend: 'up'   },
  { label: 'A6 自适应触发', value: '23',     trend: 'up'   },
  { label: 'KB 更新',       value: '4',      trend: 'flat' },
  { label: '流程回滚',       value: '1',      trend: 'flat' },
  { label: 'P95 延迟',      value: '2.3s',   trend: 'down' },
  { label: '成本/事故',     value: '$0.42',  trend: 'down' },
];
