# AegisTeam Adaptive — Web Demo

10 区大屏,展示 8 Agent + 27 Skill + 6 MCP + 5 RAG + 3 编排流 + A6 Adaptive 引擎 + L0.5 人机协同。

## 运行方式(无需 Node)

### 方案 A:直接双击 `index.html`

```bash
# Windows
start web/index.html

# macOS
open web/index.html
```

**注意**:直接打开会因为 `file://` 协议禁止 ES module 加载,需要走方案 B。

### 方案 B:本地静态服务器(推荐)

```bash
# Python 3
cd web && python3 -m http.server 8080

# Python 2
cd web && python -m SimpleHTTPServer 8080

# Node (如果装了)
cd web && npx serve -p 8080

# PowerShell
cd web; python -m http.server 8080
```

浏览器访问 `http://localhost:8080`。

### 方案 C:Docker

```bash
docker run -p 8080:80 -v "$PWD":/usr/share/nginx/html nginx:alpine
```

## 技术栈

- **React 18** — ESM 引入(无 build step)
- **TailwindCSS 3** — CDN Play 模式
- **原生 JS** — 不使用 TypeScript(避免 build 步骤)
- **Mock Event Bus** — 内存事件流,模拟 SSE
- **预录剧本** — 3 个场景的完整 22 / 26 / 14 步时间轴

## 10 区布局

| 区 | 名称 | 内容 |
|---|---|---|
| 1 | Header | A6 Adaptive Engine 健康度 + L0.5 人机协同接入态 + 全局告警计数 |
| 2 | 8 Agent 拓扑 | TeamLeader (A0) + 7 业务 Worker,实时状态/并发/迭代数 |
| 3 | Skill 矩阵 | 27 技能按 Agent 分组,显示版本/调用次数/成功率 |
| 4 | MCP 工具状态 | 6 类 MCP(mock_cmdb/sbom/siem/vuln_scanner/threat_intel/notify) |
| 5 | RAG 知识库 | 5 个 KB 容量/命中率/最近更新时间 |
| 6 | 事件流 | 模拟 SSE,实时显示 Agent 决策/MCP 调用/审批请求 |
| 7 | 场景剧本 | 3 场景下拉(alert_brute_force / regulator_notice / new_regulation) |
| 8 | 编排流可视化 | 当前场景的流程节点 + 状态(执行中/完成/失败/等待审批) |
| 9 | 指标网格 | 16 个关键指标(MTTD / MTTR / 自动闭环率 / 误报率 / 等) |
| 10 | 审批队列 | H1 / H2 关口待审批 + Nacos Registry 状态 |

## 预录剧本时间轴

### Flow 1:告警流(INC-2001 SSH 暴力破解,22 步)
详见 `scenarios.js` → `flow_alert` 数组。点击"播放剧本"按钮,事件流会以 0.8s/步速度自动推进。

### Flow 2:监管通报流(INC-2002 浙江网安,26 步)
详见 `scenarios.js` → `flow_regulator`。

### Flow 3:新法规响应流(INC-2003 生成式 AI 办法,14 步)
详见 `scenarios.js` → `flow_regulation`。

## 与 Mock 工具网关对接(可选)

页面默认使用本地预录剧本。如果要接真实的 Mock 工具网关(端口 18090),修改 `app.jsx` 顶部的 `MODE`:

```js
const MODE = 'mock-server'; // 'mock-replay' | 'mock-server'
const TOOL_GATEWAY = 'http://localhost:18090';
```

## 文件结构

```
web/
├── index.html          # 入口
├── app.jsx             # React 主组件(10 区布局)
├── styles.css          # 自定义样式
├── scenarios.js        # 3 场景 + 3 编排流预录剧本
├── mock_data.js        # 8 Agent + 27 Skill + 6 MCP + 5 RAG 元数据
└── README.md
```

## 浏览器兼容

- Chrome / Edge 90+
- Firefox 90+
- Safari 14+

需要支持 ES Modules + import maps + Tailwind Play CDN。
