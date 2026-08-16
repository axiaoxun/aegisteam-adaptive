// AegisTeam Adaptive — 10 区作战大屏
// React 18 + htm(无 build step)

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import htm from 'htm';
import { AGENTS, SKILLS, MCP_TOOLS, RAG_KNOWLEDGE, METRICS } from './mock_data.js';
import { SCENARIOS, flow_alert, flow_regulator, flow_regulation, APPROVAL_QUEUE, NACOS_REGISTRY } from './scenarios.js';

const html = htm.bind(React.createElement);

// ============================================================
// Zone 1: Header — A6 Adaptive Engine + L0.5 + 全局状态
// ============================================================
function Header({ adaptiveHealth, l0_5Status, globalStats }) {
  return html`
    <div className="panel-card p-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-aegis-green pulse-dot glow-green"></div>
          <span className="font-bold text-lg tracking-wider">AegisTeam Adaptive</span>
          <span className="text-xs text-gray-500">| 自适应盾牌防御团队</span>
        </div>
        <div className="text-xs text-gray-400 font-mono">
          ${new Date().toLocaleTimeString('zh-CN')} · v1.0.0 · Phase: Preliminary
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">A6 自适应</span>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded ${adaptiveHealth >= 0.9 ? 'bg-green-900/40 text-green-300' : 'bg-amber-900/40 text-amber-300'}">
            <span className="pulse-dot ${adaptiveHealth >= 0.9 ? 'bg-aegis-green' : 'bg-aegis-amber'}"></span>
            <span className="text-xs font-mono font-bold">${(adaptiveHealth * 100).toFixed(1)}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">L0.5 人机协同</span>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded ${l0_5Status === 'online' ? 'bg-blue-900/40 text-blue-300' : 'bg-gray-800 text-gray-400'}">
            <span className="pulse-dot ${l0_5Status === 'online' ? 'bg-aegis-accent' : 'bg-gray-600'}"></span>
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
function AgentMesh({ agentStats, onSelectAgent }) {
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
            <div
              key=${a.id}
              onClick=${() => onSelectAgent && onSelectAgent(a)}
              className=${`agent-card ${a.type === 'leader' ? 'leader' : ''} ${stateColor}`}
            >
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
                <span>迭代 ${stat.iter}/5</span>
                <span>并发 ${stat.parallel}/3</span>
              </div>
            </div>
          `;
        })}
      </div>
    </div>
  `;
}

// ============================================================
// Zone 3: 27 Skill 矩阵
// ============================================================
function SkillMatrix() {
  const grouped = useMemo(() => {
    const m = {};
    SKILLS.forEach((s) => {
      if (!m[s.agent]) m[s.agent] = [];
      m[s.agent].push(s);
    });
    return m;
  }, []);

  return html`
    <div className="panel-card h-full overflow-hidden flex flex-col">
      <div className="panel-title">
        <span>③ Skill 矩阵 · 27</span>
        <span className="text-xs text-gray-500 font-normal">按 Agent 分组 · 4 新</span>
      </div>
      <div className="p-2 overflow-y-auto flex-1">
        ${Object.entries(grouped).map(([agentId, skills]) => html`
          <div key=${agentId} className="mb-2">
            <div className="text-[10px] text-gray-500 font-bold mb-1">${agentId}</div>
            <div className="flex flex-wrap gap-1">
              ${skills.map((s) => html`
                <span key=${s.id} className=${`skill-tag ${s.id} ${s.isNew ? 'border-cyan-500' : ''}`} title=${`${s.id} ${s.name} v${s.version} | ${s.calls}次 | ${(s.successRate * 100).toFixed(1)}%`}>
                  ${s.id}${s.isNew ? '*' : ''}
                </span>
              `)}
            </div>
          </div>
        `)}
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
// Zone 6: 事件流(SSE 模拟)
// ============================================================
function EventStream({ events, isPlaying, onPlay, onPause, onReset }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return html`
    <div className="panel-card h-full flex flex-col">
      <div className="panel-title">
        <span>⑥ 事件流(SSE 模拟)</span>
        <div className="flex items-center gap-1">
          <button
            onClick=${isPlaying ? onPause : onPlay}
            className="text-[10px] px-2 py-0.5 rounded bg-aegis-accent/20 text-aegis-accent hover:bg-aegis-accent/30"
          >
            ${isPlaying ? '⏸ 暂停' : '▶ 播放'}
          </button>
          <button
            onClick=${onReset}
            className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400 hover:bg-gray-700"
          >
            ↻ 重置
          </button>
        </div>
      </div>
      <div ref=${scrollRef} className="flex-1 overflow-y-auto p-2 bg-black/30">
        ${events.length === 0 && html`
          <div className="text-center text-gray-600 text-xs py-8">点击「▶ 播放」开始剧本回放</div>
        `}
        ${events.map((e, i) => html`
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
}

// ============================================================
// Zone 7: 场景剧本(3)
// ============================================================
function ScenarioPanel({ selectedScenario, onSelect }) {
  return html`
    <div className="panel-card h-full">
      <div className="panel-title">
        <span>⑦ 场景剧本 · 3</span>
        <span className="text-xs text-gray-500 font-normal">${selectedScenario.severity}</span>
      </div>
      <div className="p-2 space-y-1.5">
        ${SCENARIOS.map((s) => html`
          <div
            key=${s.id}
            onClick=${() => onSelect(s)}
            className=${`scenario-tab p-2 rounded cursor-pointer ${selectedScenario.id === s.id ? 'active' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold">${s.name}</div>
              <div className=${`text-[10px] px-1 py-0.5 rounded font-mono ${s.severity === 'L0' ? 'bg-green-900/40 text-green-300' : s.severity === 'L1' ? 'bg-red-900/40 text-red-300' : 'bg-amber-900/40 text-amber-300'}`}>
                ${s.severity}
              </div>
            </div>
            <div className="text-[10px] text-gray-400 mt-1 line-clamp-2">${s.desc}</div>
            <div className="text-[10px] text-gray-500 font-mono mt-1">${s.stepCount} 步</div>
          </div>
        `)}
      </div>
    </div>
  `;
}

// ============================================================
// Zone 8: 编排流可视化
// ============================================================
function OrchestrationFlow({ events, currentStep, totalSteps }) {
  const phases = useMemo(() => {
    const phaseMap = {
      exec: '执行',
      done: '完成',
      warn: '告警',
      err: '失败',
      approval: '审批',
      notify: '通知',
    };
    const groups = {};
    events.forEach((e) => {
      const key = e.skill || e.type;
      if (!groups[key]) groups[key] = { ...e, count: 0 };
      groups[key].count++;
    });
    return Object.values(groups);
  }, [events]);

  return html`
    <div className="panel-card h-full flex flex-col">
      <div className="panel-title">
        <span>⑧ 编排流 · ${currentStep}/${totalSteps}</span>
        <span className="text-xs text-gray-500 font-normal">实时节点状态</span>
      </div>
      <div className="flex-1 p-3 overflow-y-auto">
        ${phases.length === 0 && html`
          <div className="text-center text-gray-600 text-xs py-8">剧本播放中...</div>
        `}
        <div className="space-y-2">
          ${phases.map((p, i) => html`
            <div key=${i} className="flex items-center gap-2">
              <div className=${`flow-node flex-1 ${p.status === 'running' ? 'running' : p.status === 'pending' ? 'pending' : 'done'}`}>
                <div className="text-[10px] text-gray-400">${p.agent}</div>
                <div className="font-mono text-[10px]">${p.skill || p.type}</div>
              </div>
              <svg width="40" height="20" className="text-aegis-accent">
                <line x1="0" y1="10" x2="40" y2="10" stroke="currentColor" strokeWidth="1" className="flow-line" />
              </svg>
            </div>
          `)}
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// Zone 9: 16 指标网格
// ============================================================
function MetricGrid() {
  return html`
    <div className="panel-card h-full">
      <div className="panel-title">
        <span>⑨ 关键指标 · 16</span>
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
// Zone 10: 审批队列 + Nacos Registry
// ============================================================
function ApprovalAndRegistry() {
  return html`
    <div className="grid grid-cols-2 gap-3 h-full">
      <div className="panel-card h-full">
        <div className="panel-title">
          <span>⑩ 审批队列(H1/H2 关口)</span>
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
          <span className="text-xs text-gray-500 font-normal">${NACOS_REGISTRY.phase === 'preliminary' ? '初赛内联' : '复赛注册'}</span>
        </div>
        <div className="p-2 space-y-1.5">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="metric-tile">
              <div className="value text-aegis-green">${NACOS_REGISTRY.registered}</div>
              <div className="label">已注册 Skill</div>
            </div>
            <div className="metric-tile">
              <div className="value text-aegis-amber">${NACOS_REGISTRY.grayReleasing}</div>
              <div className="label">灰度发布</div>
            </div>
            <div className="metric-tile">
              <div className="value">${NACOS_REGISTRY.healthy}</div>
              <div className="label">健康</div>
            </div>
            <div className="metric-tile">
              <div className="value text-aegis-red">${NACOS_REGISTRY.rolledBack}</div>
              <div className="label">回滚</div>
            </div>
          </div>
          <div className="bg-gray-900/50 p-2 rounded text-[10px] font-mono text-gray-400">
            <div>URL: <span class="text-aegis-accent">${NACOS_REGISTRY.registryUrl}</span></div>
            <div>同步: ${NACOS_REGISTRY.lastSync}</div>
            <div>回滚率: ${(NACOS_REGISTRY.rollbackRate * 100).toFixed(2)}%</div>
          </div>
          <div className="text-[10px] text-gray-500 leading-tight">
            <span class="text-aegis-accent">▸</span> 初赛内联:Skill 直接打包在 AgentSpec,启动时加载<br/>
            <span class="text-aegis-accent">▸</span> 复赛:接 Nacos,支持 1% → 50% → 100% 灰度<br/>
            <span class="text-aegis-accent">▸</span> 失败自动回滚,实时健康监控
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
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [events, setEvents] = useState([]);
  const [agentStats, setAgentStats] = useState({});
  const [adaptiveHealth, setAdaptiveHealth] = useState(0.94);
  const [l0_5Status] = useState('online');
  const [globalStats] = useState({
    activeAlerts: 12,
    pendingApproval: 5,
    closed24h: 915,
  });

  const flowData = useMemo(() => {
    if (selectedScenario.flowId === 'flow_alert') return flow_alert;
    if (selectedScenario.flowId === 'flow_regulator') return flow_regulator;
    return flow_regulation;
  }, [selectedScenario]);

  // 剧本播放逻辑
  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= flowData.length) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      const next = flowData[currentStep];
      setEvents((prev) => [...prev, next]);
      setCurrentStep((s) => s + 1);
      // 更新 agent 状态
      setAgentStats((prev) => ({
        ...prev,
        [next.agent.toLowerCase().replace(' ', '_')]: {
          state: next.status === 'running' ? 'running' : next.status === 'pending' ? 'waiting' : 'idle',
          iter: Math.min((prev[next.agent.toLowerCase().replace(' ', '_')]?.iter || 0) + (next.type === 'exec' ? 0.4 : 0), 5),
          parallel: Math.min((prev[next.agent.toLowerCase().replace(' ', '_')]?.parallel || 0) + (next.type === 'exec' ? 0.2 : 0), 3),
        },
      }));
      // A6 自适应健康度轻微波动
      if (next.agent === 'A6' && next.skill && next.skill.startsWith('S2')) {
        setAdaptiveHealth((h) => Math.max(0.85, Math.min(0.99, h + (Math.random() - 0.5) * 0.02)));
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, flowData]);

  const handlePlay = () => {
    if (currentStep >= flowData.length) {
      setEvents([]);
      setCurrentStep(0);
      setAgentStats({});
    }
    setIsPlaying(true);
  };

  const handlePause = () => setIsPlaying(false);
  const handleReset = () => {
    setIsPlaying(false);
    setEvents([]);
    setCurrentStep(0);
    setAgentStats({});
  };

  const handleSelectScenario = (s) => {
    setSelectedScenario(s);
    setEvents([]);
    setCurrentStep(0);
    setAgentStats({});
    setIsPlaying(false);
  };

  return html`
    <div className="min-h-screen p-3 flex flex-col gap-3">
      <${Header} adaptiveHealth=${adaptiveHealth} l0_5Status=${l0_5Status} globalStats=${globalStats} />

      <div className="grid grid-cols-12 gap-3 flex-1" style=${{ minHeight: 0 }}>
        <div className="col-span-5"><${AgentMesh} agentStats=${agentStats} /></div>
        <div className="col-span-4"><${SkillMatrix} /></div>
        <div className="col-span-3"><${MCPStatus} /></div>

        <div className="col-span-3"><${RAGPanel} /></div>
        <div className="col-span-6"><${EventStream} events=${events} isPlaying=${isPlaying} onPlay=${handlePlay} onPause=${handlePause} onReset=${handleReset} /></div>
        <div className="col-span-3"><${ScenarioPanel} selectedScenario=${selectedScenario} onSelect=${handleSelectScenario} /></div>

        <div className="col-span-7"><${OrchestrationFlow} events=${events} currentStep=${currentStep} totalSteps=${flowData.length} /></div>
        <div className="col-span-5"><${MetricGrid} /></div>

        <div className="col-span-12"><${ApprovalAndRegistry} /></div>
      </div>

      <div class="text-center text-[10px] text-gray-600 py-1">
        AegisTeam Adaptive v1.0.0 · Apache 2.0 · 8 Agent + 27 Skill + 6 MCP + 5 RAG · 演示模式
      </div>
    </div>
  `;
}

const root = createRoot(document.getElementById('root'));
root.render(html`<${App} />`);
