// AegisTeam Adaptive — Mock 元数据
// 8 Agent + 27 Skill + 6 MCP + 5 RAG

export const AGENTS = [
  {
    id: 'a0_leader',
    name: 'A0 TeamLeader',
    role: 'aegisteam-leader',
    type: 'leader',
    desc: '团队编排中枢,AgentLoop 调度(max_iterations=5, max_parallel=3)',
    skillCount: 6,
    skills: ['S01 incident_routing', 'S02 worker_dispatch', 'S03 evidence_chain', 'S04 approval_gate', 'S05', 'S06'],
    color: '#8b5cf6',
  },
  {
    id: 'a1_asset_manager',
    name: 'A1 资产管理',
    role: 'aegisteam-a1',
    type: 'worker',
    desc: 'CMDB 资产查询 + SBOM 软件物料清单,关联资产-漏洞-合规',
    skillCount: 4,
    skills: ['S05 asset_query', 'S06 sbom_query', 'S07 vuln_to_asset', 'S08 asset_criticality'],
    color: '#3b82f6',
  },
  {
    id: 'a2_threat_detector',
    name: 'A2 威胁检测',
    role: 'aegisteam-a2',
    type: 'worker',
    desc: '告警融合 + IOC 富化 + MITRE TTP 映射,内部 AgentLoop 自检',
    skillCount: 4,
    skills: ['S09 alert_fusion', 'S10 impact_mapping', 'S11 ioc_enrichment', 'S12 attack_pattern'],
    color: '#10b981',
  },
  {
    id: 'a3_vuln_verifier',
    name: 'A3 漏洞验证',
    role: 'aegisteam-a3',
    type: 'worker',
    desc: 'CVE 5.0 + EPSS + CISA KEV 三段式验证,证据完整性 + 修复建议',
    skillCount: 4,
    skills: ['S13 vuln_scan', 'S14 cve_lookup', 'S15 evidence_integrity', 'S16 fix_advisor'],
    color: '#f59e0b',
  },
  {
    id: 'a4_compliance_guard',
    name: 'A4 合规管理',
    role: 'aegisteam-a4',
    type: 'worker',
    desc: '5 RAG 知识库 + 双路径(管理+技术),PIPA/网安法/数据出境/PIA',
    skillCount: 4,
    skills: ['S17 compliance_lookup', 'S18 regulation_diff', 'S19 pia_assessment', 'S20 approval_routing'],
    color: '#a855f7',
  },
  {
    id: 'a5_incident_responder',
    name: 'A5 应急响应',
    role: 'aegisteam-a5',
    type: 'worker',
    desc: 'L0-L3 风险分级 + 不可自动化清单,playbook 调度',
    skillCount: 3,
    skills: ['S21 remediation_plan', 'S22 risk_guard', 'S23 l1_auto_execute'],
    color: '#ec4899',
  },
  {
    id: 'a6_quality_steward',
    name: 'A6 自适应引擎',
    role: 'aegisteam-a6',
    type: 'worker',
    desc: 'Adaptive 引擎核心:质量评分 + 漂移检测 + RAG 健康 + 自适应反馈',
    skillCount: 4,
    skills: ['S24 output_quality', 'S25 drift_detection', 'S26 rag_health', 'S27 adaptive_feedback'],
    color: '#06b6d4',
    isAdaptive: true,
  },
  {
    id: 'a7_knowledge_weaver',
    name: 'A7 复盘织造',
    role: 'aegisteam-a7',
    type: 'worker',
    desc: '事故复盘 + 知识图谱更新,与 A6 联动形成学习闭环',
    skillCount: 3,
    skills: ['S28 postmortem_writer', 'S29 kb_update', 'S30 pattern_extract'],
    color: '#84cc16',
  },
];

export const SKILLS = [
  // A0
  { id: 'S01', name: 'incident_routing', agent: 'A0', version: '1.4.2', calls: 1247, successRate: 0.991 },
  { id: 'S02', name: 'worker_dispatch', agent: 'A0', version: '1.3.0', calls: 891, successRate: 0.987 },
  { id: 'S03', name: 'evidence_chain', agent: 'A0', version: '1.2.1', calls: 1102, successRate: 0.995 },
  { id: 'S04', name: 'approval_gate', agent: 'A0', version: '1.5.0', calls: 234, successRate: 1.000 },
  { id: 'S05', name: 'incident_state', agent: 'A0', version: '1.1.0', calls: 1247, successRate: 0.998 },
  { id: 'S06', name: 'replan_trigger', agent: 'A0', version: '1.0.5', calls: 23, successRate: 0.957 },
  // A1
  { id: 'S07', name: 'asset_query', agent: 'A1', version: '2.1.0', calls: 3421, successRate: 0.994 },
  { id: 'S08', name: 'sbom_query', agent: 'A1', version: '2.0.3', calls: 1893, successRate: 0.991 },
  { id: 'S09', name: 'vuln_to_asset', agent: 'A1', version: '1.5.2', calls: 2104, successRate: 0.985 },
  { id: 'S10', name: 'asset_criticality', agent: 'A1', version: '1.2.0', calls: 1567, successRate: 0.992 },
  // A2
  { id: 'S11', name: 'alert_fusion', agent: 'A2', version: '1.7.1', calls: 2891, successRate: 0.978 },
  { id: 'S12', name: 'impact_mapping', agent: 'A2', version: '1.4.0', calls: 1203, successRate: 0.983 },
  { id: 'S13', name: 'ioc_enrichment', agent: 'A2', version: '1.6.2', calls: 3456, successRate: 0.989 },
  { id: 'S14', name: 'attack_pattern', agent: 'A2', version: '1.3.5', calls: 892, successRate: 0.975 },
  // A3
  { id: 'S15', name: 'vuln_scan', agent: 'A3', version: '2.2.0', calls: 1678, successRate: 0.992 },
  { id: 'S16', name: 'cve_lookup', agent: 'A3', version: '1.8.0', calls: 2456, successRate: 0.996 },
  { id: 'S17', name: 'evidence_integrity', agent: 'A3', version: '1.1.0', calls: 567, successRate: 1.000 },
  { id: 'S18', name: 'fix_advisor', agent: 'A3', version: '1.5.0', calls: 1102, successRate: 0.981 },
  // A4
  { id: 'S19', name: 'compliance_lookup', agent: 'A4', version: '1.9.1', calls: 1834, successRate: 0.994 },
  { id: 'S20', name: 'regulation_diff', agent: 'A4', version: '1.4.0', calls: 423, successRate: 0.979 },
  { id: 'S21', name: 'pia_assessment', agent: 'A4', version: '1.2.0', calls: 234, successRate: 0.987 },
  { id: 'S22', name: 'approval_routing', agent: 'A4', version: '1.6.0', calls: 567, successRate: 0.991 },
  // A5
  { id: 'S23', name: 'remediation_plan', agent: 'A5', version: '1.5.0', calls: 678, successRate: 0.978 },
  { id: 'S24', name: 'risk_guard', agent: 'A5', version: '1.3.2', calls: 892, successRate: 0.995 },
  { id: 'S25', name: 'l1_auto_execute', agent: 'A5', version: '1.1.0', calls: 234, successRate: 0.991 },
  // A6
  { id: 'S26', name: 'output_quality', agent: 'A6', version: '1.0.0', calls: 1834, successRate: 0.992, isNew: true },
  { id: 'S27', name: 'drift_detection', agent: 'A6', version: '1.0.0', calls: 567, successRate: 0.984, isNew: true },
  { id: 'S28', name: 'rag_health', agent: 'A6', version: '1.0.0', calls: 234, successRate: 0.997, isNew: true },
  { id: 'S29', name: 'adaptive_feedback', agent: 'A6', version: '1.0.0', calls: 89, successRate: 0.978, isNew: true },
];

export const MCP_TOOLS = [
  { id: 'mock_cmdb', desc: 'CMDB 资产查询', functions: 2, calls: 4521, latency: 23, status: 'healthy' },
  { id: 'mock_sbom', desc: 'SBOM 软件物料清单', functions: 2, calls: 1893, latency: 41, status: 'healthy' },
  { id: 'mock_siem', desc: 'SIEM 安全信息事件管理', functions: 2, calls: 8932, latency: 67, status: 'healthy' },
  { id: 'mock_vuln_scanner', desc: '漏洞扫描器', functions: 2, calls: 2341, latency: 134, status: 'healthy' },
  { id: 'mock_threat_intel', desc: '威胁情报', functions: 2, calls: 1247, latency: 89, status: 'healthy' },
  { id: 'mock_notify', desc: '通知(IM/邮件/SMS)', functions: 2, calls: 567, latency: 156, status: 'degraded' },
];

export const RAG_KNOWLEDGE = [
  { id: 'KB-Compliance', name: '合规法规库', docs: 1800, hitRate: 0.847, lastUpdate: '2026-08-15' },
  { id: 'KB-Vuln', name: '漏洞情报库', docs: 285000, hitRate: 0.923, lastUpdate: '2026-08-15' },
  { id: 'KB-Runbook', name: '应急预案库', docs: 2400, hitRate: 0.812, lastUpdate: '2026-08-12' },
  { id: 'KB-Postmortem', name: '复盘案例库', docs: 240, hitRate: 0.789, lastUpdate: '2026-08-10' },
  { id: 'KB-SupplyChain', name: '供应链风险库', docs: 5000, hitRate: 0.834, lastUpdate: '2026-08-14' },
];

export const METRICS = [
  { label: 'MTTD', value: '4.2m', trend: 'down' },
  { label: 'MTTR', value: '18m', trend: 'down' },
  { label: '自动闭环率', value: '73.4%', trend: 'up' },
  { label: '误报率', value: '6.2%', trend: 'down' },
  { label: 'Skill成功率', value: '98.7%', trend: 'up' },
  { label: 'RAG命中率', value: '84.1%', trend: 'up' },
  { label: '今日告警', value: '1,247', trend: 'flat' },
  { label: '今日闭环', value: '915', trend: 'up' },
  { label: '今日升级', value: '12', trend: 'flat' },
  { label: 'P1 事故', value: '2', trend: 'flat' },
  { label: '审批待办', value: '5', trend: 'up' },
  { label: 'A6 自适应触发', value: '23', trend: 'up' },
  { label: 'KB 更新', value: '4', trend: 'flat' },
  { label: '流程回滚', value: '1', trend: 'flat' },
  { label: 'P95 延迟', value: '2.3s', trend: 'down' },
  { label: '成本/事故', value: '$0.42', trend: 'down' },
];
