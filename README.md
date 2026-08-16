# AegIsLoop Adaptive — Web Demo

10 区大屏,展示 8 Agent + 32 Skill + 6 MCP + 5 RAG + 3 编排流并行 + A6 自适应引擎 + L0.5 人机协同 + Nacos AI Registry。

## 运行方式

### ⚠️ 重要:必须用 HTTP 服务器(不能直接双击 index.html)

`file://` 协议下浏览器拒绝 ES module 加载,会一片空白。

### 方案 1(推荐):零依赖 Node 服务器

```bash
# 项目根目录
node web/serve.js
# 或指定端口
node web/serve.js 8888
```

要求:Node.js ≥ 14(无需任何 npm 包,只用了内置 http/fs/path)。

### 方案 2:Python(常见坑:Microsoft Store 桩)

```bash
cd web && python -m http.server 8080
```

**注意**:Windows 上 `python3` 经常被 Microsoft Store 桩劫持,报 "Python was not found" 但实际未启动。解决办法:
- 用 `python` 而不是 `python3`
- 或去「设置 → 应用 → 高级应用设置 → 应用执行别名」关掉 python.exe / python3.exe 桩

### 方案 3:npx serve(需联网)

```bash
npx serve web -p 8080
```

### 方案 4:PowerShell(不推荐,功能有限)

```bash
cd web && powershell -Command "(Invoke-WebRequest -Uri 'http://localhost:8080/' -UseBasicParsing).Content"
```
(注:PowerShell 自带 WebListener 较复杂,推荐用方案 1)

### 方案 5:Docker

```bash
docker run --rm -p 8080:80 -v "$PWD/web":/usr/share/nginx/html nginx:alpine
```

## 验证启动成功

打开 `http://localhost:8080/`,应看到:
- 黑色背景的 10 区作战大屏
- 顶部:「AegIsLoop Adaptive」标题 + A6 自适应 94%
- 中部:8 个 Agent 卡片(A0 紫色,带 ADAPTIVE 徽章)
- 点 ▶ 全部播放 → 3 列事件流同时滚动

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
