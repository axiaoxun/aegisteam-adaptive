// AegIsLoop Adaptive — 10 区作战大屏
// React 18 + htm(无 build step)
// 改动 1: 改名 AegIsLoop Adaptive
// 改动 2: 事件流 3 路并行(原 1 路单选)
// 改动 3: Skill 改为 8×6 真矩阵
// 改动 4: Nacos 简化(无初赛/复赛阶段)

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import htm from 'htm';
import { BRAND, AGENTS, SKILLS, MCP_TOOLS, RAG_KNOWLEDGE, METRICS } from './mock_data.js';
import { SCENARIOS, flow_alert, flow_regulator, flow_regulation, APPROVAL_QUEUE, NACOS_REGISTRY } from './scenarios.js';

const html = htm.bind(React.createElement);

const FLOWS = [
  { id: 'flow_alert',      data: flow_alert,      color: '#f59e0b', accent: 'border-amber-500' },
  { id: 'flow_regulator',  data: flow_regulator,  color: '#ef4444', accent: 'border-red-500' },
  { id: 'flow_regulation', data: flow_regulation, color: '#10b981', accent: 'border-emerald-500' },
];

// ============================================================
// Zone 1: Header
// ============================================================
function Header({ adaptiveHealth, l0_5Status, globalStats }) {
  return html`
    <div className="panel-card p-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-aegis-green pulse-dot glow-green"></div>
          <span className="font-bold text-lg tracking-wider">${BRAND.full}</span>
          <span className="text-xs text-gray-500">| ${BRAND.cn}</span>
        </div>
        <div className="text-xs text-gray-400 font-mono">
          ${new Date().toLocaleTimeString('zh-CN')} · v${BRAND.version}
        </div>
        <a href="./platform.html"
          className="text-xs px-2.5 py-1 rounded border border-aegis-border text-gray-300 hover:text-white hover:border-aegis-accent transition">
          用户侧平台 →
        </a>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">A6 自适应</span>
          <div className=${`flex items-center gap-1 px-2 py-0.5 rounded ${adaptiveHealth >= 0.9 ? 'bg-green-900/40 text-green-300' : 'bg-amber-900/40 text-amber-300'}`}>
            <span className=${`pulse-dot ${adaptiveHealth >= 0.9 ? 'bg-aegis-green' : 'bg-aegis-amber'}`}></span>
            <span className="text-xs font-mono font-bold">${(adaptiveHealth * 100).toFixed(1)}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">L0.5 人机协同</span>
          <div className=${`flex items-center gap-1 px-2 py-0.5 rounded ${l0_5Status === 'online' ? 'bg-blue-900/40 text-blue-300' : 'bg-gray-800 text-gray-400'}`}>
            <span className=${`pulse-dot ${l0_5Status === 'online' ? 'bg-aegis-accent' : 'bg-gray-600'}`}></span>
            <span className="text-xs font-mono">${l0_5Status === 'online' ? '在线(2)' : '离线'}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-center">
            <div className="text-aegis-red font-bold">${globalStats.activeAlerts}</div>
            <div className="text-gray-500">活跃告警</div>
          </div>
          <div className="text-center">
            <div className="text-aegis-amber font-bold">${globalStats.pendingApproval}</div>
            <div className="text-gray-500">待审批</div>
          </div>
          <div className="text-center">
            <div className="text-aegis-green font-bold">${globalStats.closed24h}</div>
            <div className="text-gray-500">24h 闭环</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// Zone 2: 8 Agent 拓扑
// ============================================================
function AgentMesh({ agentStats }) {
  return html`
    <div className="panel-card h-full">
      <div className="panel-title">
        <span>② 8 Agent 拓扑</span>
        <span className="text-xs text-gray-500 font-normal">TeamLeader + 7 Worker</span>
      </div>
      <div className="p-3 grid grid-cols-2 gap-2">
        ${AGENTS.map((a) => {
          const stat = agentStats[a.id] || { state: 'idle', iter: 0, parallel: 0 };
          const stateColor = {
            idle: 'border-gray-700',
            running: 'border-aegis-accent glow-blue',
            waiting: 'border-aegis-amber',
            error: 'border-aegis-red',
          }[stat.state];
          return html`
            <div key=${a.id} className=${`agent-card ${a.type === 'leader' ? 'leader' : ''} ${stateColor}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className=${`w-2 h-2 rounded-full ${stat.state === 'running' ? 'bg-aegis-accent pulse-dot' : stat.state === 'error' ? 'bg-aegis-red' : 'bg-gray-600'}`}></div>
                  <span className="font-bold text-sm" style=${{ color: a.color }}>${a.name}</span>
                </div>
                ${a.isAdaptive && html`<span className="text-[9px] px-1 py-0.5 rounded bg-cyan-900/40 text-cyan-300 font-mono">ADAPTIVE</span>`}
              </div>
              <div className="text-[10px] text-gray-400 mt-1 line-clamp-2">${a.desc}</div>
              <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-gray-500">
                <span>技能 ${a.skillCount}</span>
                <span>迭代 ${stat.iter.toFixed(1)}/5</span>
                <span>并发 ${stat.parallel.toFixed(1)}/3</span>
              </div>
            </div>
          `;
        })}
      </div>
    </div>
  `;
}

// ============================================================
// Zone 3: Skill 矩阵(8 Agent × 6 维度) — 真正的矩阵
// ============================================================
function SkillMatrix() {
  // 6 列维度:技能数/总调用/平均成功率/平均 P95/新Skill数/使用率
  const rows = useMemo(() => {
    return AGENTS.map((agent) => {
      const mySkills = SKILLS.filter((s) => s.agent === agent.id.replace('_', '').toUpperCase() || s.agent === agent.name.split(' ')[0]);
      const totalCalls = mySkills.reduce((sum, s) => sum + s.calls, 0);
      const avgSuccess = mySkills.length ? mySkills.reduce((s, x) => s + x.successRate, 0) / mySkills.length : 0;
      const avgP95 = mySkills.length ? Math.round(mySkills.reduce((s, x) => s + x.p95, 0) / mySkills.length) : 0;
      const newCount = mySkills.filter((s) => s.isNew).length;
      const usedInAll = mySkills.filter((s) => s.usedIn && s.usedIn.length === 3).length;
      return {
        agent,
        mySkills,
        totalCalls,
        avgSuccess,
        avgP95,
        newCount,
        usedInAll,
      };
    });
  }, []);

  return html`
    <div className="panel-card h-full flex flex-col">
      <div className="panel-title">
        <span>③ Skill 矩阵 · 32</span>
        <span className="text-xs text-gray-500 font-normal">8 Agent × 6 维度</span>
      </div>
      <div className="p-2 flex-1 overflow-auto">
        <table className="w-full text-[10px] font-mono">
          <thead>
            <tr className="text-gray-500 border-b border-aegis-border">
              <th className="text-left p-1">Agent</th>
              <th className="text-center p-1">技能数</th>
              <th className="text-center p-1">总调用</th>
              <th className="text-center p-1">成功率</th>
              <th className="text-center p-1">P95(ms)</th>
              <th className="text-center p-1">新</th>
              <th className="text-center p-1">三流通用</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((r) => html`
              <tr key=${r.agent.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="p-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style=${{ background: r.agent.color }}></div>
                    <span style=${{ color: r.agent.color }}>${r.agent.name}</span>
                    ${r.agent.isAdaptive && html`<span className="text-[8px] text-cyan-400">★</span>`}
                  </div>
                </td>
                <td className="text-center p-1 text-aegis-accent font-bold">${r.mySkills.length}</td>
                <td className="text-center p-1">${r.totalCalls.toLocaleString()}</td>
                <td className="text-center p-1 ${r.avgSuccess >= 0.99 ? 'text-aegis-green' : r.avgSuccess >= 0.97 ? 'text-yellow-300' : 'text-aegis-amber'}">${(r.avgSuccess * 100).toFixed(1)}%</td>
                <td className="text-center p-1 ${r.avgP95 < 100 ? 'text-aegis-green' : r.avgP95 < 300 ? 'text-yellow-300' : 'text-aegis-amber'}">${r.avgP95}</td>
                <td className="text-center p-1">${r.newCount > 0 ? html`<span className="text-cyan-300">${r.newCount}</span>` : '—'}</td>
                <td className="text-center p-1">${r.usedInAll}/${r.mySkills.length}</td>
              </tr>
            `)}
          </tbody>
        </table>
        <div className="mt-2 text-[10px] text-gray-500 leading-tight">
          <span className="text-cyan-300">★</span> A6 自适应引擎 · 新 = 本次新增 Skill · 三流通用 = 在 3 条编排流中都使用
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// Zone 4: 6 MCP 工具状态
// ============================================================
function MCPStatus() {
  return html`
    <div className="panel-card h-full">
      <div className="panel-title">
        <span>④ MCP 工具 · 6</span>
        <span className="text-xs text-gray-500 font-normal">真实产品参考</span>
      </div>
      <div className="p-2 space-y-1.5">
        ${MCP_TOOLS.map((m) => html`
          <div key=${m.id} className="flex items-center justify-between p-1.5 rounded bg-gray-900/50">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-mono text-gray-200">${m.id}</div>
              <div className="text-[10px] text-gray-500 truncate">${m.desc}</div>
            </div>
            <div className="text-right">
              <div className=${`text-[10px] font-mono ${m.status === 'healthy' ? 'text-aegis-green' : 'text-aegis-amber'}`}>
                ${m.calls.toLocaleString()} calls
              </div>
              <div className="text-[10px] text-gray-500 font-mono">P50 ${m.latency}ms</div>
            </div>
          </div>
        `)}
      </div>
    </div>
  `;
}

// ============================================================
// Zone 5: 5 RAG 知识库
// ============================================================
function RAGPanel() {
  return html`
    <div className="panel-card h-full">
      <div className="panel-title">
        <span>⑤ RAG 知识库 · 5</span>
        <span className="text-xs text-gray-500 font-normal">${RAG_KNOWLEDGE.reduce((s, k) => s + k.docs, 0).toLocaleString()} 条</span>
      </div>
      <div className="p-2 space-y-1.5">
        ${RAG_KNOWLEDGE.map((k) => html`
          <div key=${k.id} className="p-1.5 rounded bg-gray-900/50">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono text-gray-200">${k.id}</div>
              <div className="text-[10px] text-gray-500">${k.lastUpdate}</div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="text-[10px] text-gray-500">${k.name}</div>
              <div className="flex-1 h-1 bg-gray-800 rounded">
                <div className="h-full bg-aegis-accent rounded" style=${{ width: `${k.hitRate * 100}%` }}></div>
              </div>
              <div className="text-[10px] font-mono text-aegis-accent">${(k.hitRate * 100).toFixed(1)}%</div>
            </div>
            <div className="text-[10px] text-gray-500 font-mono mt-0.5">${k.docs.toLocaleString()} docs</div>
          </div>
        `)}
      </div>
    </div>
  `;
}

// ============================================================
// Zone 6: 事件流 — 3 路并行
// ============================================================
function EventStreamPanel({ flowsState, onPlayAll, onPauseAll, onResetAll, isPlayingAll }) {
  return html`
    <div className="panel-card h-full flex flex-col">
      <div className="panel-title">
        <span>⑥ 事件流 · 3 路并行</span>
        <div className="flex items-center gap-1">
          <button
            onClick=${isPlayingAll ? onPauseAll : onPlayAll}
            className="text-[10px] px-2 py-0.5 rounded bg-aegis-accent/20 text-aegis-accent hover:bg-aegis-accent/30"
          >
            ${isPlayingAll ? '⏸ 全部暂停' : '▶ 全部播放'}
          </button>
          <button
            onClick=${onResetAll}
            className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400 hover:bg-gray-700"
          >
            ↻ 重置
          </button>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-3 gap-px bg-aegis-border">
        ${FLOWS.map((flow) => {
          const s = flowsState[flow.id];
          const scen = SCENARIOS.find((x) => x.id === flow.id);
          return html`
            <div key=${flow.id} className="bg-aegis-card flex flex-col">
              <div className=${`flex items-center justify-between px-2 py-1 border-b-2 ${flow.accent} bg-gray-900/50`}>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono font-bold truncate" style=${{ color: flow.color }}>${scen.name}</div>
                  <div className="text-[9px] text-gray-500 truncate">${scen.short}</div>
                </div>
                <div className="text-[10px] font-mono text-gray-400 whitespace-nowrap ml-1">
                  ${s.current}/${scen.stepCount}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-1 bg-black/30 min-h-0">
                ${s.events.length === 0 && html`
                  <div className="text-center text-gray-600 text-[10px] py-4">点击 ▶ 全部播放开始</div>
                `}
                ${s.events.map((e, i) => html`
                  <div key=${i} className=${`event-line ${e.type}`}>
                    <span className="text-gray-600">[${e.ts}]</span>
                    <span className=${`font-bold ml-1 ${e.type === 'warn' ? 'text-amber-300' : e.type === 'err' ? 'text-red-300' : e.type === 'approval' ? 'text-purple-300' : e.type === 'notify' ? 'text-cyan-300' : e.type === 'done' ? 'text-green-300' : 'text-blue-300'}`}>${e.agent}</span>
                    <span className="text-gray-500 ml-1">${e.skill || ''}</span>
                    <span className="ml-1">${e.message}</span>
                  </div>
                `)}
              </div>
            </div>
          `;
        })}
      </div>
    </div>
  `;
}

// ============================================================
// Zone 7: 16 指标网格
// ============================================================
function MetricGrid() {
  return html`
    <div className="panel-card h-full">
      <div className="panel-title">
        <span>⑦ 关键指标 · 16</span>
        <span className="text-xs text-gray-500 font-normal">过去 24h</span>
      </div>
      <div className="p-2 grid grid-cols-8 gap-1.5">
        ${METRICS.map((m) => html`
          <div key=${m.label} className="metric-tile">
            <div className="value">${m.value}</div>
            <div className="label">${m.label}</div>
            <div className=${`text-[10px] mt-0.5 ${m.trend === 'up' ? 'text-aegis-green' : m.trend === 'down' ? 'text-aegis-red' : 'text-gray-500'}`}>
              ${m.trend === 'up' ? '▲' : m.trend === 'down' ? '▼' : '—'}
            </div>
          </div>
        `)}
      </div>
    </div>
  `;
}

// ============================================================
// Zone 8: 审批队列 + Nacos(简化版)
// ============================================================
function ApprovalAndRegistry() {
  return html`
    <div className="grid grid-cols-2 gap-3 h-full">
      <div className="panel-card h-full">
        <div className="panel-title">
          <span>⑧ 审批队列(H1/H2 关口)</span>
          <span className="text-xs text-gray-500 font-normal">${APPROVAL_QUEUE.filter((a) => a.status === 'pending').length} 待办</span>
        </div>
        <div className="p-2 space-y-1 overflow-y-auto">
          ${APPROVAL_QUEUE.map((a) => html`
            <div key=${a.id} className=${`p-1.5 rounded text-[11px] ${a.status === 'pending' ? 'bg-purple-900/20 border border-purple-800/50' : 'bg-gray-900/40'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className=${`px-1 py-0 rounded font-mono text-[9px] font-bold ${a.level === 'H1' ? 'bg-amber-900/40 text-amber-300' : 'bg-red-900/40 text-red-300'}`}>${a.level}</span>
                  <span className="font-mono text-gray-300">${a.id}</span>
                  <span className="text-gray-500">${a.scenario}</span>
                </div>
                <span className=${`text-[10px] font-mono ${a.status === 'pending' ? 'text-amber-300' : 'text-green-300'}`}>
                  ${a.status === 'pending' ? `⏳ ${a.waitTime}` : '✓'}
                </span>
              </div>
              <div className="text-gray-300 mt-0.5">${a.action}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">${a.requester} → ${a.approver}</div>
            </div>
          `)}
        </div>
      </div>

      <div className="panel-card h-full">
        <div className="panel-title">
          <span>Nacos AI Registry</span>
          <span className="text-xs text-gray-500 font-normal">已注册</span>
        </div>
        <div className="p-2 space-y-1.5">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="metric-tile">
              <div className="value text-aegis-green">${NACOS_REGISTRY.registered}/${NACOS_REGISTRY.total}</div>
              <div className="label">Skill 已注册</div>
            </div>
            <div className="metric-tile">
              <div className="value text-aegis-amber">${NACOS_REGISTRY.grayReleasing}</div>
              <div className="label">灰度中</div>
            </div>
            <div className="metric-tile">
              <div className="value text-aegis-green">${NACOS_REGISTRY.healthy}</div>
              <div className="label">健康</div>
            </div>
            <div className="metric-tile">
              <div className="value text-aegis-red">${NACOS_REGISTRY.rolledBack}</div>
              <div className="label">回滚</div>
            </div>
          </div>
          <div className="bg-gray-900/50 p-2 rounded text-[10px] font-mono text-gray-400 space-y-0.5">
            <div>URL: <span className="text-aegis-accent">${NACOS_REGISTRY.registryUrl}</span></div>
            <div>Namespace: ${NACOS_REGISTRY.namespace}</div>
            <div>Group: ${NACOS_REGISTRY.group}</div>
            <div>同步: ${NACOS_REGISTRY.lastSync}</div>
            <div>回滚率: <span className="text-aegis-green">${(NACOS_REGISTRY.rollbackRate * 100).toFixed(2)}%</span></div>
          </div>
          <div className="text-[10px] text-gray-500 leading-tight">
            <span className="text-aegis-accent">▸</span> Skill 通过 Nacos AI Registry 注册,运行时按需加载<br/>
            <span className="text-aegis-accent">▸</span> 支持灰度发布(1% → 50% → 100%)+ 自动回滚<br/>
            <span className="text-aegis-accent">▸</span> 本演示为本地 mock,行为契约与 Nacos 一致
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// Zone 9: 3 编排流进度(对应事件流 3 列)
// ============================================================
function FlowProgress({ flowsState }) {
  return html`
    <div className="panel-card h-full">
      <div className="panel-title">
        <span>⑨ 编排流进度 · 3</span>
        <span className="text-xs text-gray-500 font-normal">实时</span>
      </div>
      <div className="p-2 space-y-2">
        ${FLOWS.map((flow) => {
          const s = flowsState[flow.id];
          const scen = SCENARIOS.find((x) => x.id === flow.id);
          const pct = (s.current / scen.stepCount) * 100;
          return html`
            <div key=${flow.id} className="p-1.5 rounded bg-gray-900/40">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style=${{ background: flow.color }}></div>
                  <span className="text-[11px] font-mono font-bold" style=${{ color: flow.color }}>${scen.name}</span>
                  <span className="text-[10px] text-gray-500">${scen.short}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className=${`px-1 rounded ${scen.severity === 'L0' ? 'bg-green-900/40 text-green-300' : scen.severity === 'L1' ? 'bg-red-900/40 text-red-300' : 'bg-amber-900/40 text-amber-300'}`}>
                    ${scen.severity}
                  </span>
                  <span className="text-gray-400">${s.current}/${scen.stepCount}</span>
                </div>
              </div>
              <div className="h-1.5 bg-gray-800 rounded overflow-hidden">
                <div className="h-full transition-all duration-300" style=${{ width: `${pct}%`, background: flow.color }}></div>
              </div>
            </div>
          `;
        })}
      </div>
    </div>
  `;
}

// ============================================================
// Zone 10: 8 Agent × 6 类技能(类别覆盖矩阵)
// ============================================================
function CoverageMatrix() {
  const categories = ['编排', '资产', '检测', '漏洞', '合规', '响应', '质量', '复盘'];
  const matrix = useMemo(() => {
    return AGENTS.map((a) => {
      const row = { agent: a, counts: {} };
      categories.forEach((cat) => { row.counts[cat] = 0; });
      SKILLS.filter((s) => s.agent === a.name.split(' ')[0]).forEach((s) => {
        if (row.counts[s.category] !== undefined) row.counts[s.category]++;
      });
      return row;
    });
  }, []);

  return html`
    <div className="panel-card h-full">
      <div className="panel-title">
        <span>⑩ 技能类别覆盖矩阵 · 8×8</span>
        <span className="text-xs text-gray-500 font-normal">每格 = 该 Agent 在该类别的 Skill 数</span>
      </div>
      <div className="p-2">
        <table className="w-full text-[10px] font-mono">
          <thead>
            <tr className="text-gray-500 border-b border-aegis-border">
              <th className="text-left p-1">Agent</th>
              ${categories.map((c) => html`<th key=${c} className="text-center p-1 text-[9px]">${c}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${matrix.map((r) => html`
              <tr key=${r.agent.id} className="border-b border-gray-800/50">
                <td className="p-1 whitespace-nowrap">
                  <span style=${{ color: r.agent.color }}>${r.agent.name}</span>
                  ${r.agent.isAdaptive && html`<span className="text-cyan-400 ml-1">★</span>`}
                </td>
                ${categories.map((c) => {
                  const n = r.counts[c];
                  const intensity = n === 0 ? 0 : n >= 5 ? 1 : n / 5;
                  return html`
                    <td key=${c} className="text-center p-1">
                      ${n > 0 ? html`
                        <div className="rounded px-1" style=${{ background: `rgba(59,130,246,${0.15 + intensity * 0.4})`, color: intensity > 0.5 ? '#dbeafe' : '#93c5fd' }}>
                          ${n}
                        </div>
                      ` : html`<span className="text-gray-700">·</span>`}
                    </td>
                  `;
                })}
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ============================================================
// 主应用
// ============================================================
function App() {
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [flowsState, setFlowsState] = useState(() => {
    const init = {};
    FLOWS.forEach((f) => {
      init[f.id] = { current: 0, events: [] };
    });
    return init;
  });
  const [agentStats, setAgentStats] = useState({});
  const [adaptiveHealth, setAdaptiveHealth] = useState(0.94);
  const [l0_5Status] = useState('online');
  const [globalStats] = useState({
    activeAlerts: 12,
    pendingApproval: 5,
    closed24h: 915,
  });

  // 3 路并行播放逻辑
  useEffect(() => {
    if (!isPlayingAll) return;

    const timers = [];
    FLOWS.forEach((flow) => {
      const tick = () => {
        setFlowsState((prev) => {
          const s = prev[flow.id];
          if (s.current >= flow.data.length) {
            return prev;
          }
          const next = flow.data[s.current];
          const newEvents = [...s.events, next];
          // 更新 agent 状态
          setAgentStats((aprev) => ({
            ...aprev,
            [next.agent.toLowerCase().replace(' ', '_')]: {
              state: next.status === 'running' ? 'running' : next.status === 'pending' ? 'waiting' : 'idle',
              iter: Math.min((aprev[next.agent.toLowerCase().replace(' ', '_')]?.iter || 0) + (next.type === 'exec' ? 0.4 : 0), 5),
              parallel: Math.min((aprev[next.agent.toLowerCase().replace(' ', '_')]?.parallel || 0) + (next.type === 'exec' ? 0.2 : 0), 3),
            },
          }));
          if (next.agent === 'A6' && next.skill && next.skill.startsWith('S2')) {
            setAdaptiveHealth((h) => Math.max(0.85, Math.min(0.99, h + (Math.random() - 0.5) * 0.02)));
          }
          return {
            ...prev,
            [flow.id]: { current: s.current + 1, events: newEvents },
          };
        });
      };
      timers.push(setInterval(tick, 600));
    });

    return () => timers.forEach(clearInterval);
  }, [isPlayingAll]);

  // 自动停止
  useEffect(() => {
    if (!isPlayingAll) return;
    const allDone = FLOWS.every((f) => flowsState[f.id].current >= f.data.length);
    if (allDone) {
      setIsPlayingAll(false);
    }
  }, [flowsState, isPlayingAll]);

  const handlePlayAll = () => {
    const allDone = FLOWS.every((f) => flowsState[f.id].current >= f.data.length);
    if (allDone) handleResetAll();
    setIsPlayingAll(true);
  };
  const handlePauseAll = () => setIsPlayingAll(false);
  const handleResetAll = () => {
    setIsPlayingAll(false);
    setFlowsState(() => {
      const init = {};
      FLOWS.forEach((f) => { init[f.id] = { current: 0, events: [] }; });
      return init;
    });
    setAgentStats({});
  };

  return html`
    <div className="min-h-screen p-3 flex flex-col gap-3">
      <${Header} adaptiveHealth=${adaptiveHealth} l0_5Status=${l0_5Status} globalStats=${globalStats} />

      <div className="grid grid-cols-12 gap-3 flex-1" style=${{ minHeight: 0 }}>
        <div className="col-span-4 row-span-1"><${AgentMesh} agentStats=${agentStats} /></div>
        <div className="col-span-5 row-span-1"><${SkillMatrix} /></div>
        <div className="col-span-3 row-span-2"><${MCPStatus} /></div>

        <div className="col-span-9 row-span-1"><${EventStreamPanel} flowsState=${flowsState} onPlayAll=${handlePlayAll} onPauseAll=${handlePauseAll} onResetAll=${handleResetAll} isPlayingAll=${isPlayingAll} /></div>

        <div className="col-span-3"><${RAGPanel} /></div>
        <div className="col-span-5"><${FlowProgress} flowsState=${flowsState} /></div>
        <div className="col-span-4"><${CoverageMatrix} /></div>

        <div className="col-span-8"><${MetricGrid} /></div>
        <div className="col-span-4"><${ApprovalAndRegistry} /></div>
      </div>

      <div className="text-center text-[10px] text-gray-600 py-1">
        ${BRAND.full} v${BRAND.version} · ${BRAND.license} · 8 Agent + 32 Skill + 6 MCP + 5 RAG + 3 编排流并行 · 演示模式
      </div>
    </div>
  `;
}

const root = createRoot(document.getElementById('root'));
root.render(html`<${App} />`);
