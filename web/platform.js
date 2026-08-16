// AegIsLoop · 自适应安全运营平台 — 人机协同控制台(用户侧 demo)
// React 18 + htm(无 build step),浅色专业企业级风。
// 定位:L0.5 人机协同层 —— 1 名安全工程师在此直接指挥 8 个岗位化 Agent,
// 审批回复高危操作、下发任务、配置钉钉接入、编排合规场景。
// 纯前端 demo,数据为 mock,交互可点击。

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import htm from 'htm';
import { BRAND, AGENTS, SKILLS, MCP_TOOLS, RAG_KNOWLEDGE } from './mock_data.js';
import { SCENARIOS, APPROVAL_QUEUE, flow_alert, flow_regulator, flow_regulation } from './scenarios.js';

const html = htm.bind(React.createElement);

// ============================================================
// 图标(Feather/Lucide 风格 stroke 图标,内联 SVG)
// ============================================================
const ICONS = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  shieldCheck: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
  clipboard: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>',
  gitBranch: '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4"/><circle cx="12" cy="2.5" r="1.5"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  chevronRight: '<polyline points="9 18 15 12 9 6"/>',
  arrowRight: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
  alertTriangle: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  refresh: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  externalLink: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
};

function Icon({ name, size = 18, sw = 1.8, className = '' }) {
  return html`
    <svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth=${sw} strokeLinecap="round" strokeLinejoin="round" className=${className}
      dangerouslySetInnerHTML=${{ __html: ICONS[name] || '' }}>
    </svg>
  `;
}

// ============================================================
// 平台侧 mock 数据(与 mock_data.js / scenarios.js 互补)
// ============================================================
const AGENT_RUNTIME = {
  a0_leader:           { status: 'online',  todayTasks: 42, load: 74 },
  a1_asset_manager:    { status: 'online',  todayTasks: 38, load: 51 },
  a2_threat_detector:  { status: 'busy',    todayTasks: 56, load: 88 },
  a3_vuln_verifier:    { status: 'online',  todayTasks: 29, load: 46 },
  a4_compliance_guard: { status: 'busy',    todayTasks: 17, load: 63 },
  a5_incident_responder:{ status: 'standby', todayTasks: 22, load: 32 },
  a6_quality_steward:  { status: 'online',  todayTasks: 23, load: 41 },
  a7_knowledge_weaver: { status: 'online',  todayTasks: 9,  load: 18 },
};

const STATUS_META = {
  online:  { label: '在线',   color: '#10b981', bg: '#ecfdf5', text: '#059669' },
  busy:    { label: '处置中', color: '#6366f1', bg: '#eef2ff', text: '#4f46e5' },
  standby: { label: '待命',   color: '#94a3b8', bg: '#f1f5f9', text: '#64748b' },
};

const ACTIVITY = [
  { ts: '09:23', agent: 'A6', kind: 'quality',    text: '质量评分 0.94 · Flow1 无回滚' },
  { ts: '09:18', agent: 'A5', kind: 'exec',       text: '已执行 L1 自动封禁 5 个境外 IP' },
  { ts: '09:15', agent: 'L0.5', kind: 'approval', text: '张主管 通过 H1 审批(APR-001)' },
  { ts: '09:12', agent: 'A3', kind: 'vuln',       text: '命中 CVE-2023-38408(CVSS 9.8 · KEV)' },
  { ts: '09:05', agent: 'A0', kind: 'exec',       text: '识别告警流,启动 Flow1,并行派遣 A1/A2/A3' },
  { ts: '09:02', agent: 'A4', kind: 'compliance', text: '监管通报流 Flow2 双路径已就绪' },
  { ts: '08:50', agent: 'A7', kind: 'quality',    text: '复盘回写 KB-Postmortem +1' },
];

const EVIDENCE = {
  'INC-2001': '告警 5 起 · IOC 6 个 · CVE 2 个 · 资产 1 个',
  'INC-2002': '通报 1 份 · P0 资产 3 个 · 出境事件 2 起 · PIA 缺失 3 项',
  'INC-2003': '新法规 1 部 · AI 应用 3 个 · 合规缺口 5 项',
};
const RISK_OF = { 'INC-2001': 'L2', 'INC-2002': 'L3', 'INC-2003': 'L3' };

const APPROVALS_INIT = APPROVAL_QUEUE.map((a) => ({
  ...a,
  risk: RISK_OF[a.scenario] || 'L2',
  evidence: EVIDENCE[a.scenario] || '—',
  resolvedAt: a.status === 'approved' ? '09:17' : null,
  comment: '',
}));

const TASKS_INIT = [
  { id: 'TSK-1042', title: 'INC-2002 断网处置 · 监管通报整改', type: '合规整改', priority: 'L3', status: '处置中', assignee: 'A0 → A4/A5', progress: 62 },
  { id: 'TSK-1041', title: 'INC-2001 SSH 暴力破解处置', type: '告警处置', priority: 'L2', status: '已闭环', assignee: 'A0 → A1/A2/A3/A5', progress: 100 },
  { id: 'TSK-1040', title: '《生成式 AI 办法》合规改造', type: '合规整改', priority: 'L3', status: '排期中', assignee: 'A0 → A3/A4/A5', progress: 38 },
  { id: 'TSK-1039', title: '资产暴露面月度盘点', type: '资产盘点', priority: 'L1', status: '已完成', assignee: 'A1', progress: 100 },
];

const DINGTALK_INIT = {
  enabled: true,
  appName: 'AegIsLoop 安全助手',
  appKey: 'dingxxxxxxxxxxxxxxxxxxxx',
  appSecret: '••••••••••••••••••••',
  robotWebhook: 'https://oapi.dingtalk.com/robot/send?access_token=••••••',
  channels: [
    { name: '告警处置群', key: 'ALERT_GROUP', enabled: true, desc: '高频告警、响应动作实时推送' },
    { name: '审批通知群', key: 'APPROVAL_GROUP', enabled: true, desc: 'H1/H2 审批推送给安全负责人 / CISO' },
    { name: '监管通报群', key: 'COMPLIANCE_GROUP', enabled: true, desc: '监管通报、整改进度、法务协同' },
    { name: '复盘学习群', key: 'POSTMORTEM_GROUP', enabled: false, desc: 'A7 复盘报告、Runbook 更新推送' },
  ],
};

const FLOW_DATA = {
  flow_alert: flow_alert,
  flow_regulator: flow_regulator,
  flow_regulation: flow_regulation,
};

const NAV = [
  { key: 'overview', label: '工作台', icon: 'grid' },
  { key: 'agents', label: 'Agent 指挥台', icon: 'users' },
  { key: 'approvals', label: '审批中心', icon: 'shieldCheck' },
  { key: 'tasks', label: '任务中心', icon: 'clipboard' },
  { key: 'flows', label: '场景编排', icon: 'gitBranch' },
  { key: 'integrations', label: '集成与设置', icon: 'sliders' },
];

const TITLES = {
  overview: '工作台',
  agents: 'Agent 指挥台',
  approvals: '审批中心',
  tasks: '任务中心',
  flows: '场景编排',
  integrations: '集成与设置',
};

// ============================================================
// 基础组件
// ============================================================
function StatusDot({ color, pulse = true }) {
  return html`
    <span className="inline-block w-2 h-2 rounded-full ${pulse ? 'dot-pulse' : ''}" style=${{ background: color }}></span>
  `;
}

function LevelBadge({ level }) {
  const map = {
    H1: { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
    H2: { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
    L0: { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' },
    L1: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
    L2: { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
    L3: { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
  };
  const m = map[level] || { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
  return html`
    <span className="mono text-[11px] font-semibold px-1.5 py-0.5 rounded-md border" style=${{ background: m.bg, color: m.text, borderColor: m.border }}>${level}</span>
  `;
}

function Pill({ children, bg, text, border }) {
  return html`
    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border" style=${{ background: bg, color: text, borderColor: border }}>${children}</span>
  `;
}

function SectionTitle({ icon, title, right }) {
  return html`
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        ${icon && html`<span className="text-brand-600">${icon}</span>`}
        <h2 className="text-[15px] font-semibold text-slate-800">${title}</h2>
      </div>
      ${right || ''}
    </div>
  `;
}

// ============================================================
// 侧边栏
// ============================================================
function Sidebar({ view, setView, pendingCount, open, onClose }) {
  return html`
    <aside className=${`w-60 flex-none bg-white border-r border-slate-200 flex flex-col h-screen fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 lg:sticky lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="px-5 py-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-800 flex items-center justify-center text-white shadow-sm">
            <${Icon} name="shieldCheck" size=${20} />
          </div>
          <div>
            <div className="text-[15px] font-bold text-slate-900 leading-tight">AegIsLoop</div>
            <div className="text-[10px] text-slate-400 leading-tight">自适应安全运营平台</div>
          </div>
        </div>
        <button onClick=${onClose} className="lg:hidden text-slate-400 hover:text-slate-600 p-1"><${Icon} name="x" size=${18} /></button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        ${NAV.map((n) => {
          const active = view === n.key;
          return html`
            <button
              key=${n.key}
              onClick=${() => { setView(n.key); onClose(); }}
              className=${`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition ${active ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <${Icon} name=${n.icon} size=${18} sw=${active ? 2 : 1.7} />
              <span className="flex-1 text-left">${n.label}</span>
              ${n.key === 'approvals' && pendingCount > 0 && html`
                <span className="mono text-[10px] font-bold bg-red-500 text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">${pendingCount}</span>
              `}
            </button>
          `;
        })}
      </nav>

      <div className="px-3 py-4 border-t border-slate-100">
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <${StatusDot} color="#10b981" />
            <span className="text-[12px] font-semibold text-slate-700">团队在线 8/8</span>
          </div>
          <div className="text-[10px] text-slate-400 leading-relaxed">1 名安全工程师 + 8 个岗位化 Agent,7×24 自适应值守</div>
        </div>
      </div>
    </aside>
  `;
}

// ============================================================
// 顶栏
// ============================================================
function Topbar({ title, pendingCount, onMenu }) {
  return html`
    <header className="h-16 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-2 text-[15px] font-semibold text-slate-800">
        <button onClick=${onMenu} className="lg:hidden text-slate-500 hover:text-slate-700 -ml-1 p-1"><${Icon} name="menu" size=${20} /></button>
        ${title}
        <span className="hidden sm:inline text-[11px] font-normal text-slate-400 mono">· L0.5 人机协同层</span>
      </div>
      <div className="flex items-center gap-3">
        <button onClick=${() => { window.location.href = './index.html'; }}
          className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 hover:text-brand-600 border border-slate-200 hover:border-brand-200 rounded-lg px-3 py-1.5 transition">
          <${Icon} name="monitor" size=${15} /> 作战大屏
        </button>
        <div className="relative">
          <${Icon} name="bell" size=${19} className="text-slate-500" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></span>
        </div>
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-white flex items-center justify-center text-[12px] font-semibold">张</div>
          <div className="leading-tight">
            <div className="text-[12px] font-semibold text-slate-800">张主管</div>
            <div className="text-[10px] text-slate-400">安全负责人</div>
          </div>
        </div>
      </div>
    </header>
  `;
}

// ============================================================
// 视图 1:工作台
// ============================================================
function Overview({ onNav, approvals, flows }) {
  const metrics = [
    { label: 'MTTD 平均发现', value: '4.2m', trend: '↓ 24×', icon: 'zap', color: '#6366f1' },
    { label: 'MTTR 平均响应', value: '18m', trend: '↓ 5×', icon: 'refresh', color: '#10b981' },
    { label: '自动闭环率', value: '73.4%', trend: '↑', icon: 'check', color: '#0ea5e9' },
    { label: '误报率', value: '6.2%', trend: '↓', icon: 'shield', color: '#f59e0b' },
  ];

  const flowProgress = {
    flow_alert: 100, flow_regulator: 62, flow_regulation: 38,
  };

  return html`
    <div className="space-y-5 fade-up">
      <!-- Hero -->
      <div className="card p-6 bg-gradient-to-br from-white to-brand-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <${StatusDot} color="#10b981" />
              <span className="text-[12px] font-medium text-emerald-600">系统运行正常 · 团队在线</span>
            </div>
            <h1 className="text-[22px] font-bold text-slate-900">早上好,张主管</h1>
            <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">
              昨晚至今晨,您的团队已自动闭环 <span className="font-semibold text-slate-800">915</span> 起告警,
              还有 <span className="font-semibold text-red-500">${approvals.pending}</span> 项高危操作等待您审批。
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick=${() => onNav('approvals')} className="flex items-center gap-1.5 text-[13px] font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg px-4 py-2 transition shadow-sm">
              <${Icon} name="shieldCheck" size=${16} /> 去审批
            </button>
            <button onClick=${() => onNav('tasks')} className="flex items-center gap-1.5 text-[13px] font-medium text-slate-700 bg-white border border-slate-200 hover:border-brand-300 rounded-lg px-4 py-2 transition">
              <${Icon} name="plus" size=${16} /> 下发任务
            </button>
          </div>
        </div>
      </div>

      <!-- 指标 -->
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        ${metrics.map((m) => html`
          <div key=${m.label} className="card p-4 card-hover">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-slate-500">${m.label}</span>
              <span className="w-7 h-7 rounded-lg flex items-center justify-center" style=${{ background: `${m.color}14`, color: m.color }}>
                <${Icon} name=${m.icon} size=${15} />
              </span>
            </div>
            <div className="mono text-[24px] font-semibold text-slate-900">${m.value}</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">${m.trend} 较纯人工</div>
          </div>
        `)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Agent 团队健康度 -->
        <div className="card p-5 col-span-1">
          <${SectionTitle} icon=${html`<${Icon} name="users" size=${17} />`} title="Agent 团队" right=${html`
            <button onClick=${() => onNav('agents')} className="text-[11px] text-brand-600 hover:text-brand-700 flex items-center gap-0.5">指挥 <${Icon} name="chevronRight" size=${13} /></button>
          `} />
          <div className="space-y-2.5">
            ${AGENTS.map((a) => {
              const rt = AGENT_RUNTIME[a.id];
              const st = STATUS_META[rt.status];
              return html`
                <div key=${a.id} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg flex-none flex items-center justify-center mono text-[11px] font-bold" style=${{ background: `${a.color}1a`, color: a.color }}>${a.name.slice(0, 2)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-medium text-slate-700 truncate">${a.name}</span>
                      ${a.isAdaptive && html`<span className="text-[9px] mono text-brand-600">★</span>`}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <${StatusDot} color=${st.color} />
                      <span className="text-[10px]" style=${{ color: st.text }}>${st.label}</span>
                      <span className="text-[10px] text-slate-400">· 今日 ${rt.todayTasks} 任务</span>
                    </div>
                  </div>
                  <div className="w-12 text-right">
                    <div className="text-[10px] text-slate-400 mono">${rt.load}%</div>
                  </div>
                </div>
              `;
            })}
          </div>
        </div>

        <!-- 进行中的场景编排 -->
        <div className="card p-5 col-span-1">
          <${SectionTitle} icon=${html`<${Icon} name="gitBranch" size=${17} />`} title="进行中的编排" right=${html`
            <button onClick=${() => onNav('flows')} className="text-[11px] text-brand-600 hover:text-brand-700 flex items-center gap-0.5">详情 <${Icon} name="chevronRight" size=${13} /></button>
          `} />
          <div className="space-y-3">
            ${SCENARIOS.map((s) => {
              const pct = flowProgress[s.id];
              return html`
                <div key=${s.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/60">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style=${{ background: s.color }}></span>
                      <span className="text-[12px] font-medium text-slate-700">${s.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <${LevelBadge} level=${s.severity} />
                      <span className="mono text-[11px] text-slate-400">${pct}%</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 mb-2 truncate">${s.short}</div>
                  <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style=${{ width: `${pct}%`, background: s.color }}></div>
                  </div>
                </div>
              `;
            })}
          </div>
        </div>

        <!-- 最近动态 -->
        <div className="card p-5 col-span-1">
          <${SectionTitle} icon=${html`<${Icon} name="activity" size=${17} />`} title="最近动态" />
          <div className="space-y-0 relative">
            ${ACTIVITY.map((a, i) => html`
              <div key=${i} className="flex gap-3 relative pb-4 ${i === ACTIVITY.length - 1 ? '' : ''}">
                ${i < ACTIVITY.length - 1 && html`<span className="absolute left-[7px] top-5 bottom-0 w-px bg-slate-100"></span>`}
                <span className="w-[15px] h-[15px] rounded-full flex-none mt-0.5 border-2 ${a.kind === 'approval' ? 'border-purple-400 bg-purple-50' : a.kind === 'vuln' ? 'border-amber-400 bg-amber-50' : a.kind === 'compliance' ? 'border-emerald-400 bg-emerald-50' : 'border-brand-300 bg-brand-50'}"></span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="mono text-[11px] font-semibold text-slate-700">${a.agent}</span>
                    <span className="mono text-[10px] text-slate-400">${a.ts}</span>
                  </div>
                  <div className="text-[12px] text-slate-600 leading-snug">${a.text}</div>
                </div>
              </div>
            `)}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// 视图 2:Agent 指挥台
// ============================================================
function AgentCommand({ onNav }) {
  const [selectedId, setSelectedId] = useState(AGENTS[0].id);
  const [threads, setThreads] = useState({});
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  const agent = AGENTS.find((a) => a.id === selectedId);
  const rt = AGENT_RUNTIME[selectedId];
  const st = STATUS_META[rt.status];
  const mySkills = SKILLS.filter((s) => s.agent === agent.name.split(' ')[0]);
  const thread = threads[selectedId] || [];

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [thread]);

  function send() {
    const cmd = input.trim();
    if (!cmd) return;
    const userMsg = { role: 'user', text: cmd, ts: now() };
    setThreads((prev) => ({ ...prev, [selectedId]: [...(prev[selectedId] || []), userMsg] }));
    setInput('');
    setTimeout(() => {
      const reply = mockReply(agent, cmd);
      setThreads((prev) => ({ ...prev, [selectedId]: [...(prev[selectedId] || []), reply] }));
    }, 550);
  }

  return html`
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 fade-up">
      <!-- 左:Agent 列表 -->
      <div className="col-span-1 lg:col-span-5 card p-4">
        <${SectionTitle} icon=${html`<${Icon} name="users" size=${17} />`} title="团队员工(8)" right=${html`<span className="text-[11px] text-slate-400">点击员工下达指令</span>`} />
        <div className="space-y-2">
          ${AGENTS.map((a) => {
            const r = AGENT_RUNTIME[a.id];
            const s = STATUS_META[r.status];
            const active = a.id === selectedId;
            return html`
              <button key=${a.id} onClick=${() => setSelectedId(a.id)}
                className=${`w-full text-left p-3 rounded-xl border transition ${active ? 'border-brand-300 bg-brand-50/60' : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'}`}>
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl flex-none flex items-center justify-center mono text-[13px] font-bold" style=${{ background: `${a.color}1a`, color: a.color }}>
                    ${a.name.split(' ')[0]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-semibold text-slate-800">${a.name}</span>
                      ${a.isAdaptive && html`<span className="text-[9px] mono text-brand-600">★</span>`}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">${a.desc}</div>
                  </div>
                  <div className="text-right flex-none">
                    <div className="flex items-center gap-1 justify-end">
                      <${StatusDot} color=${s.color} />
                      <span className="text-[10px]" style=${{ color: s.text }}>${s.label}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mono mt-1">${a.skillCount} Skill</div>
                  </div>
                </div>
              </button>
            `;
          })}
        </div>
      </div>

      <!-- 右:指令对话 -->
      <div className="col-span-1 lg:col-span-7 card flex flex-col" style=${{ minHeight: '480px' }}>
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg flex items-center justify-center mono text-[13px] font-bold" style=${{ background: `${agent.color}1a`, color: agent.color }}>${agent.name.split(' ')[0]}</span>
            <div>
              <div className="text-[14px] font-semibold text-slate-800 flex items-center gap-1.5">${agent.name} ${agent.isAdaptive && html`<span className="text-[9px] mono text-brand-600">★</span>`}</div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <${StatusDot} color=${st.color} pulse=${rt.status === 'busy'} />
                <span>${st.label} · 负载 ${rt.load}% · 今日 ${rt.todayTasks} 任务</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1.5">
            ${mySkills.map((s) => html`<span key=${s.id} className="mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">${s.id} ${s.name}</span>`)}
          </div>
        </div>

        <div ref=${listRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50/50">
          ${thread.length === 0 && html`
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3"><${Icon} name="bot" size=${24} /></div>
              <div className="text-[13px] font-medium text-slate-600">向 ${agent.name} 下达指令</div>
              <div className="text-[11px] text-slate-400 mt-1 max-w-xs">例如:「排查 INC-2002 涉及的 3 个 P0 数据库出境情况」</div>
            </div>
          `}
          ${thread.map((m, i) => html`
            <div key=${i} className=${`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className=${`max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${m.role === 'user' ? 'bg-brand-600 text-white rounded-br-md' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-md'}`}>
                <div className=${`text-[10px] mb-0.5 ${m.role === 'user' ? 'text-brand-100' : 'text-slate-400'}`}>
                  ${m.role === 'user' ? '你 · ' + m.ts : agent.name.split(' ')[0] + ' · ' + m.ts}
                </div>
                ${m.text}
              </div>
            </div>
          `)}
        </div>

        <div className="px-5 py-3 border-t border-slate-100 flex gap-2">
          <input
            value=${input}
            onChange=${(e) => setInput(e.target.value)}
            onKeyDown=${(e) => { if (e.key === 'Enter') send(); }}
            placeholder="向该 Agent 下达指令,回车发送…"
            className="flex-1 text-[13px] px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition"
          />
          <button onClick=${send} className="flex items-center gap-1.5 text-[13px] font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-xl px-4 transition">
            <${Icon} name="send" size=${15} /> 发送
          </button>
        </div>
      </div>
    </div>
  `;
}

function now() {
  const d = new Date();
  return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
}

function mockReply(agent, cmd) {
  const mySkills = SKILLS.filter((s) => s.agent === agent.name.split(' ')[0]);
  const sk = mySkills[Math.floor(Math.random() * mySkills.length)];
  const roleMap = {
    'A0 TeamLeader': '已接管并路由该指令,并行派遣相关 Worker,证据链同步锚定。',
    'A1 资产管理': '正在检索 CMDB / SBOM,返回资产画像与组件清单。',
    'A2 威胁检测': '正在聚合告警并做 IOC 富化与 MITRE TTP 映射。',
    'A3 漏洞验证': '正在执行 CVE 5.0 + EPSS + KEV 三段式验证。',
    'A4 合规管理': '正在检索 KB-Compliance,映射法条并启动 PIA 评估。',
    'A5 应急响应': '已按风险分级生成处置方案,L1 自动执行,L2/L3 提请审批。',
    'A6 自适应引擎': '已对该输出做质量评分与漂移检测,暂无回滚。',
    'A7 复盘织造': '正在生成复盘并回写 Runbook / 知识库。',
  };
  const tail = roleMap[agent.name] || '已接收指令,开始执行。';
  return {
    role: 'agent',
    text: `已接收指令。调用 ${sk.id} ${sk.name} 执行(预计 ${Math.round(sk.p95 / 10)}s 返回结果)。${tail}`,
    ts: now(),
  };
}

// ============================================================
// 视图 3:审批中心
// ============================================================
function ApprovalCenter({ approvals, onApprove, onReject, onReply, setApprovals }) {
  const pending = approvals.filter((a) => a.status === 'pending');
  const done = approvals.filter((a) => a.status !== 'pending');
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyText, setReplyText] = useState('');

  return html`
    <div className="space-y-5 fade-up">
      <div className="flex items-center gap-2 text-[13px] text-slate-500">
        <${Icon} name="alertTriangle" size=${15} className="text-amber-500" />
        高风险动作(AI 不自动执行)必须经过人工审批关口,审批记录全程留痕、可追溯。
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="col-span-1 lg:col-span-8 space-y-4">
          <${SectionTitle} icon=${html`<${Icon} name="shieldCheck" size=${17} />`} title=${`待审批(${pending.length})`} />
          ${pending.length === 0 && html`<div className="card p-8 text-center text-[13px] text-slate-400">全部处理完毕 ✓</div>`}
          ${pending.map((a) => html`
            <div key=${a.id} className="card p-5 card-hover">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <${LevelBadge} level=${a.level} />
                  <${LevelBadge} level=${a.risk} />
                  <span className="mono text-[12px] font-semibold text-slate-700">${a.id}</span>
                  <span className="text-[11px] text-slate-400">${a.scenario}</span>
                </div>
                <span className="flex items-center gap-1 text-[11px] text-amber-600"><${StatusDot} color="#f59e0b" /> 已等待 ${a.waitTime}</span>
              </div>

              <div className="mt-3 text-[15px] font-semibold text-slate-900">${a.action}</div>
              <div className="mt-2 space-y-1 text-[12px] text-slate-500">
                <div className="flex items-center gap-1.5"><${Icon} name="database" size=${13} /> 证据链:<span className="text-slate-600">${a.evidence}</span><span className="mono text-[10px] text-slate-400">(evidence_id 已锚定)</span></div>
                <div className="flex items-center gap-1.5"><${Icon} name="users" size=${13} /> 发起:${a.requester} → 审批:${a.approver}</div>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                <button onClick=${() => onApprove(a.id)} className="flex items-center gap-1.5 text-[13px] font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg px-4 py-2 transition">
                  <${Icon} name="check" size=${15} /> 通过并执行
                </button>
                <button onClick=${() => onReject(a.id)} className="flex items-center gap-1.5 text-[13px] font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg px-4 py-2 transition">
                  <${Icon} name="x" size=${15} /> 驳回
                </button>
                <button onClick=${() => { setReplyTarget(replyTarget === a.id ? null : a.id); }} className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 transition">
                  <${Icon} name="message" size=${15} /> 回复
                </button>
              </div>

              ${replyTarget === a.id && html`
                <div className="mt-3 flex gap-2">
                  <input value=${replyText} onChange=${(e) => setReplyText(e.target.value)} placeholder="回复审批请求(将同步到钉钉审批群)…"
                    className="flex-1 text-[13px] px-3 py-2 rounded-lg border border-slate-200 focus:border-brand-400 outline-none" />
                  <button onClick=${() => { onReply(a.id, replyText); setReplyTarget(null); setReplyText(''); }}
                    className="text-[13px] font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg px-3 transition">发送回复</button>
                </div>
              `}
              ${a.comment && html`<div className="mt-3 text-[12px] text-slate-500 bg-slate-50 rounded-lg px-3 py-2">已回复:<span className="text-slate-700">「${a.comment}」</span></div>`}
            </div>
          `)}
        </div>

        <div className="col-span-1 lg:col-span-4">
          <${SectionTitle} icon=${html`<${Icon} name="activity" size=${17} />`} title="审批流水" />
          <div className="card p-4 space-y-3">
            ${done.length === 0 && html`<div className="text-[12px] text-slate-400 text-center py-6">暂无已处理记录</div>`}
            ${done.map((a) => html`
              <div key=${a.id} className="flex items-start gap-2.5">
                <span className=${`w-6 h-6 rounded-full flex-none flex items-center justify-center ${a.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  <${Icon} name=${a.status === 'approved' ? 'check' : 'x'} size=${13} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium text-slate-700">${a.action}</div>
                  <div className="mono text-[10px] text-slate-400 mt-0.5">${a.id} · ${a.status === 'approved' ? '已通过' : '已驳回'} ${a.resolvedAt ? '· ' + a.resolvedAt : ''}</div>
                </div>
              </div>
            `)}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// 视图 4:任务中心
// ============================================================
function TaskCenter({ tasks, onDispatch }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('告警处置');
  const [priority, setPriority] = useState('L2');
  const [desc, setDesc] = useState('');

  const statusStyle = {
    '处置中': { bg: '#eef2ff', text: '#4f46e5' },
    '已闭环': { bg: '#ecfdf5', text: '#047857' },
    '排期中': { bg: '#fffbeb', text: '#b45309' },
    '已完成': { bg: '#f1f5f9', text: '#475569' },
  };

  function submit() {
    if (!title.trim()) return;
    onDispatch(title, type, priority, desc || '由 A0 自动研判并路由');
    setTitle(''); setDesc('');
  }

  return html`
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 fade-up">
      <div className="col-span-1 lg:col-span-4 card p-5">
        <${SectionTitle} icon=${html`<${Icon} name="plus" size=${17} />`} title="下发任务" />
        <div className="space-y-3">
          <div>
            <label className="text-[12px] font-medium text-slate-600 block mb-1">任务标题</label>
            <input value=${title} onChange=${(e) => setTitle(e.target.value)} placeholder="例如:排查生产网段 SSH 暴露面"
              className="w-full text-[13px] px-3 py-2 rounded-lg border border-slate-200 focus:border-brand-400 outline-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-slate-600 block mb-1">类型</label>
              <select value=${type} onChange=${(e) => setType(e.target.value)} className="w-full text-[13px] px-2 py-2 rounded-lg border border-slate-200 bg-white outline-none">
                <option>告警处置</option>
                <option>合规整改</option>
                <option>漏洞修复</option>
                <option>资产盘点</option>
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium text-slate-600 block mb-1">优先级</label>
              <select value=${priority} onChange=${(e) => setPriority(e.target.value)} className="w-full text-[13px] px-2 py-2 rounded-lg border border-slate-200 bg-white outline-none">
                <option>L0</option>
                <option>L1</option>
                <option>L2</option>
                <option>L3</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[12px] font-medium text-slate-600 block mb-1">补充说明(可选)</label>
            <textarea value=${desc} onChange=${(e) => setDesc(e.target.value)} rows="3" placeholder="补充上下文,A0 将据此自动路由…"
              className="w-full text-[13px] px-3 py-2 rounded-lg border border-slate-200 focus:border-brand-400 outline-none resize-none" />
          </div>
          <button onClick=${submit} className="w-full flex items-center justify-center gap-1.5 text-[13px] font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg py-2.5 transition">
            <${Icon} name="send" size=${15} /> 下发到 Agent 团队
          </button>
          <div className="text-[11px] text-slate-400 leading-relaxed">下发后由 A0 TeamLeader 自动识别类型并并行派遣 Worker,L2/L3 动作自动挂起等待审批。</div>
        </div>
      </div>

      <div className="col-span-1 lg:col-span-8 card p-5">
        <${SectionTitle} icon=${html`<${Icon} name="clipboard" size=${17} />`} title=${`任务列表(${tasks.length})`} right=${html`<span className="text-[11px] text-slate-400">A0 自动路由 · 全程留痕</span>`} />
        <div className="space-y-2.5">
          ${tasks.map((t) => {
            const s = statusStyle[t.status];
            return html`
              <div key=${t.id} className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <${LevelBadge} level=${t.priority} />
                    <span className="text-[13px] font-semibold text-slate-800">${t.title}</span>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style=${{ background: s.bg, color: s.text }}>${t.status}</span>
                </div>
                <div className="flex items-center justify-between mt-2.5">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="mono">${t.id}</span>
                    <span>${t.type}</span>
                    <span className="flex items-center gap-1"><${Icon} name="users" size=${12} /> ${t.assignee}</span>
                  </div>
                  <span className="mono text-[11px] text-slate-400">${t.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mt-2">
                  <div className="h-full rounded-full ${t.progress === 100 ? 'bg-emerald-500' : 'bg-brand-500'}" style=${{ width: `${t.progress}%` }}></div>
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// 视图 5:场景编排
// ============================================================
function Orchestration() {
  const [activeId, setActiveId] = useState('flow_regulator');
  const scen = SCENARIOS.find((s) => s.id === activeId);
  const steps = FLOW_DATA[activeId];

  // 去重后的 Agent 协作链
  const chain = useMemo(() => {
    const seen = [];
    steps.forEach((s) => { if (!seen.includes(s.agent)) seen.push(s.agent); });
    return seen;
  }, [steps]);

  const typeMeta = {
    exec: { label: '执行', bg: '#eef2ff', text: '#4f46e5', icon: 'zap' },
    warn: { label: '研判', bg: '#fffbeb', text: '#b45309', icon: 'alertTriangle' },
    approval: { label: '审批', bg: '#faf5ff', text: '#7c3aed', icon: 'shieldCheck' },
    notify: { label: '通知', bg: '#ecfeff', text: '#0891b2', icon: 'bell' },
    done: { label: '复盘', bg: '#ecfdf5', text: '#047857', icon: 'check' },
  };

  return html`
    <div className="space-y-4 fade-up">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        ${SCENARIOS.map((s) => {
          const active = s.id === activeId;
          return html`
            <button key=${s.id} onClick=${() => setActiveId(s.id)}
              className=${`card p-4 text-left card-hover ${active ? '!border-brand-400 ring-2 ring-brand-100' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style=${{ background: s.color }}></span>
                  <span className="text-[13px] font-semibold text-slate-800">${s.name}</span>
                </div>
                <${LevelBadge} level=${s.severity} />
              </div>
              <div className="text-[12px] text-slate-600 font-medium">${s.short}</div>
              <div className="text-[11px] text-slate-400 mt-1.5 line-clamp-2">${s.desc}</div>
              <div className="flex items-center justify-between mt-3 text-[11px]">
                <span className="mono text-slate-400">${s.stepCount} 步</span>
                <span className="flex items-center gap-1 text-brand-600 font-medium">${active ? '查看编排' : '查看'} <${Icon} name="arrowRight" size=${12} /></span>
              </div>
            </button>
          `;
        })}
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[15px] font-semibold text-slate-800">${scen.name} · ${scen.short}</div>
            <div className="text-[12px] text-slate-400 mt-0.5">${scen.desc}</div>
          </div>
          ${scen.id !== 'flow_alert' && html`
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
              <${Icon} name="gitBranch" size=${13} /> 管理 + 技术双路径
            </span>
          `}
        </div>

        <!-- Agent 协作链 -->
        <div className="flex items-center overflow-x-auto py-2 mb-5">
          ${chain.map((ag, i) => {
            const a = AGENTS.find((x) => x.name.split(' ')[0] === ag) || { name: ag, color: '#94a3b8' };
            const isApproval = ag === 'L0.5';
            return html`
              <div key=${ag} className="flex items-center flex-none">
                ${i > 0 && html`<span className="flow-step-line done"></span>`}
                <div className=${`flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-medium ${isApproval ? 'border-purple-200 bg-purple-50 text-purple-700' : 'border-slate-200 bg-white text-slate-700'}`}>
                  <span className="w-1.5 h-1.5 rounded-full" style=${{ background: a.color }}></span>
                  ${isApproval ? 'L0.5 人工审批' : a.name}
                </div>
              </div>
            `;
          })}
        </div>

        <!-- 步骤时间线 -->
        <div className="space-y-0 max-h-[420px] overflow-y-auto pr-1">
          ${steps.map((st, i) => {
            const tm = typeMeta[st.type] || typeMeta.exec;
            const isApproval = st.type === 'approval';
            return html`
              <div key=${i} className="flex gap-3 relative">
                ${i < steps.length - 1 && html`<span className="absolute left-[11px] top-7 bottom-0 w-px bg-slate-100"></span>`}
                <span className=${`w-[23px] h-[23px] rounded-full flex-none flex items-center justify-center mt-0.5 border ${isApproval ? 'border-purple-200 bg-purple-50' : 'border-slate-200 bg-slate-50'}`} style=${{ color: tm.text }}>
                  <${Icon} name=${tm.icon} size=${12} />
                </span>
                <div className=${`flex-1 pb-3 min-w-0 ${isApproval ? '' : ''}`}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="mono text-[11px] font-semibold text-slate-700">${st.agent}</span>
                    <span className="mono text-[10px] px-1 py-0 rounded bg-slate-100 text-slate-500">${st.skill}</span>
                    <span className="mono text-[10px] text-slate-400">${st.ts}</span>
                    <span className="text-[10px] font-medium px-1.5 py-0 rounded" style=${{ background: tm.bg, color: tm.text }}>${tm.label}</span>
                  </div>
                  <div className=${`text-[12.5px] mt-0.5 leading-snug ${isApproval ? 'text-purple-700 font-medium bg-purple-50/60 border border-purple-100 rounded-lg px-2.5 py-1.5' : 'text-slate-600'}`}>${st.message}</div>
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// 视图 6:集成与设置
// ============================================================
function Integrations({ dingtalk, setDingtalk }) {
  const [testing, setTesting] = useState(false);
  const [testOk, setTestOk] = useState(false);

  function toggleChannel(key) {
    setDingtalk((prev) => ({ ...prev, channels: prev.channels.map((c) => c.key === key ? { ...c, enabled: !c.enabled } : c) }));
  }

  function testConn() {
    setTesting(true); setTestOk(false);
    setTimeout(() => { setTesting(false); setTestOk(true); }, 900);
  }

  return html`
    <div className="space-y-5 fade-up">
      <!-- 钉钉接入 -->
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style=${{ background: '#0089FF' }}>
              <${Icon} name="message" size=${20} />
            </div>
            <div>
              <div className="text-[15px] font-semibold text-slate-800">钉钉接入(IM 通道)</div>
              <div className="text-[12px] text-slate-400">L0.5 人机协同层双通道之一:审批 / 告警 / 通报直达钉钉</div>
            </div>
          </div>
          <button
            onClick=${() => setDingtalk((p) => ({ ...p, enabled: !p.enabled }))}
            className=${`relative w-12 h-6 rounded-full transition ${dingtalk.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}>
            <span className=${`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${dingtalk.enabled ? 'left-6' : 'left-0.5'}`}></span>
          </button>
        </div>

        ${dingtalk.enabled ? html`
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-medium text-slate-600 block mb-1">应用名称</label>
              <input readOnly value=${dingtalk.appName} className="w-full mono text-[13px] px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 outline-none" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-slate-600 block mb-1">AppKey</label>
              <input readOnly value=${dingtalk.appKey} className="w-full mono text-[13px] px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 outline-none" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-slate-600 block mb-1">AppSecret</label>
              <input readOnly value=${dingtalk.appSecret} className="w-full mono text-[13px] px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 outline-none" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-slate-600 block mb-1">机器人 Webhook</label>
              <input readOnly value=${dingtalk.robotWebhook} className="w-full mono text-[12px] px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 outline-none" />
            </div>
          </div>

          <div className="mt-5">
            <div className="text-[12px] font-medium text-slate-600 mb-2">消息通道映射</div>
            <div className="space-y-2">
              ${dingtalk.channels.map((c) => html`
                <div key=${c.key} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition">
                  <span className="w-8 h-8 rounded-lg flex-none flex items-center justify-center bg-blue-50 text-blue-500"><${Icon} name="message" size=${15} /></span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-slate-700">${c.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">${c.desc}</div>
                  </div>
                  <button onClick=${() => toggleChannel(c.key)}
                    className=${`relative w-10 h-5 rounded-full transition ${c.enabled ? 'bg-brand-600' : 'bg-slate-300'}`}>
                    <span className=${`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${c.enabled ? 'left-5' : 'left-0.5'}`}></span>
                  </button>
                </div>
              `)}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button onClick=${testConn} disabled=${testing}
              className="flex items-center gap-1.5 text-[13px] font-medium text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-lg px-4 py-2 transition">
              <${Icon} name=${testing ? 'refresh' : 'zap'} size=${15} className=${testing ? 'animate-spin' : ''} />
              ${testing ? '连接测试中…' : '测试连接'}
            </button>
            ${testOk && html`<span className="flex items-center gap-1.5 text-[13px] text-emerald-600"><${Icon} name="check" size=${15} /> 连接成功,已推送测试消息到「审批通知群」</span>`}
          </div>
        ` : html`
          <div className="text-center py-10 text-[13px] text-slate-400">钉钉接入已关闭,高危操作将仅通过 Web 平台审批。</div>
        `}
      </div>

      <!-- MCP 工具 + RAG 知识库 -->
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <${SectionTitle} icon=${html`<${Icon} name="cpu" size=${17} />`} title="MCP 工具(6)" />
          <div className="space-y-2">
            ${MCP_TOOLS.map((m) => html`
              <div key=${m.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100">
                <span className="mono text-[11px] font-semibold text-slate-700 w-28 flex-none">${m.id}</span>
                <span className="text-[11px] text-slate-500 flex-1 truncate">${m.desc}</span>
                <${StatusDot} color=${m.status === 'healthy' ? '#10b981' : '#f59e0b'} pulse=${m.status !== 'healthy'} />
                <span className="text-[10px] ${m.status === 'healthy' ? 'text-emerald-600' : 'text-amber-600'} flex-none">${m.status === 'healthy' ? '正常' : '降级'}</span>
              </div>
            `)}
          </div>
        </div>
        <div className="card p-5">
          <${SectionTitle} icon=${html`<${Icon} name="book" size=${17} />`} title="RAG 知识库(5)" right=${html`<span className="text-[11px] text-slate-400">${RAG_KNOWLEDGE.reduce((s, k) => s + k.docs, 0).toLocaleString()} 条</span>`} />
          <div className="space-y-2">
            ${RAG_KNOWLEDGE.map((k) => html`
              <div key=${k.id} className="p-2.5 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="mono text-[11px] font-semibold text-slate-700">${k.id}</span>
                  <span className="text-[10px] text-slate-400">${k.name}</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-brand-500" style=${{ width: `${k.hitRate * 100}%` }}></div>
                  </div>
                  <span className="mono text-[10px] text-brand-600">${(k.hitRate * 100).toFixed(1)}%</span>
                  <span className="mono text-[10px] text-slate-400">${k.docs.toLocaleString()}</span>
                </div>
              </div>
            `)}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// 主应用
// ============================================================
function App() {
  const [view, setView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [approvals, setApprovals] = useState(APPROVALS_INIT);
  const [tasks, setTasks] = useState(TASKS_INIT);
  const [dingtalk, setDingtalk] = useState(DINGTALK_INIT);
  const [toast, setToast] = useState(null);

  const pendingCount = useMemo(() => approvals.filter((a) => a.status === 'pending').length, [approvals]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  function notify(msg) {
    setToast(msg);
  }

  function approve(id) {
    setApprovals((prev) => prev.map((a) => a.id === id ? { ...a, status: 'approved', resolvedAt: now(), approver: a.approver || '张主管' } : a));
    notify('已通过审批,动作已下发执行,审批记录留痕');
  }
  function reject(id) {
    setApprovals((prev) => prev.map((a) => a.id === id ? { ...a, status: 'rejected', resolvedAt: now() } : a));
    notify('已驳回,退回给发起 Agent 重新研判');
  }
  function reply(id, text) {
    setApprovals((prev) => prev.map((a) => a.id === id ? { ...a, comment: text } : a));
    notify('回复已同步到钉钉审批群');
  }
  function dispatch(title, type, priority, desc) {
    const newTask = {
      id: 'TSK-' + (1043 + tasks.length),
      title, type, priority,
      status: '处置中',
      assignee: 'A0 → 路由中',
      progress: 8,
    };
    setTasks((prev) => [newTask, ...prev]);
    notify(`任务已下发:A0 识别为「${type}」,开始并行派遣 Worker`);
  }

  const approvalsProps = { approvals, onApprove: approve, onReject: reject, onReply: reply, setApprovals };

  return html`
    <div className="flex min-h-screen">
      <${Sidebar} view=${view} setView=${setView} pendingCount=${pendingCount} open=${sidebarOpen} onClose=${() => setSidebarOpen(false)} />
      <div className=${`fixed inset-0 bg-slate-900/40 z-30 lg:hidden ${sidebarOpen ? '' : 'hidden'}`} onClick=${() => setSidebarOpen(false)}></div>
      <div className="flex-1 min-w-0 flex flex-col">
        <${Topbar} title=${TITLES[view]} pendingCount=${pendingCount} onMenu=${() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 max-w-[1200px] w-full mx-auto">
          ${view === 'overview' && html`<${Overview} onNav=${setView} approvals=${{ pending: pendingCount }} flows=${SCENARIOS} />`}
          ${view === 'agents' && html`<${AgentCommand} onNav=${setView} />`}
          ${view === 'approvals' && html`<${ApprovalCenter} ...${approvalsProps} />`}
          ${view === 'tasks' && html`<${TaskCenter} tasks=${tasks} onDispatch=${dispatch} />`}
          ${view === 'flows' && html`<${Orchestration} />`}
          ${view === 'integrations' && html`<${Integrations} dingtalk=${dingtalk} setDingtalk=${setDingtalk} />`}
        </main>
      </div>

      ${toast && html`
        <div className="toast fixed bottom-6 right-6 flex items-center gap-2.5 bg-slate-900 text-white text-[13px] rounded-xl px-4 py-3 shadow-xl z-50">
          <${Icon} name="check" size=${16} className="text-emerald-400" />
          ${toast}
        </div>
      `}
    </div>
  `;
}

const root = createRoot(document.getElementById('root'));
root.render(html`<${App} />`);
