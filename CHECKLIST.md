# AegisTeam Adaptive — 最终提交 Checklist

> 提交前逐项打勾。所有项 ✅ 后才能提交。

---

## 1. 方案文档(必交 ✅)

| # | 文档 | 路径 | 状态 |
|---|---|---|---|
| 1.1 | 主文档 V1.2 | `docs/00-main.md` | ✅ |
| 1.2 | 8 Agent + 27 Skill | `docs/01-agents-and-skills.md` | ✅ |
| 1.3 | 3 编排流 + Mock 剧本 | `docs/02-orchestration.md` | ✅ |
| 1.4 | 18 页 PPT + GitHub 结构 | `docs/03-presentation-materials.md` | ✅ |
| 1.5 | 5 RAG + 6 MCP + 16 指标 | `docs/04-infrastructure.md` | ✅ |

---

## 2. 18 页 PPT(必交 ✅)

| # | 检查项 | 状态 |
|---|---|---|
| 2.1 | Markdown 草稿 | `ppt/AegisTeam-Adaptive-18pages.md` ✅ |
| 2.2 | 渲染为 PDF/PPTX(用户自行操作) | ⏳ 需用 Keynote / PPT 排版后导出 |
| 2.3 | 含 Nacos 全链路(2 页) | ✅ 第 8-9 页 |
| 2.4 | 含 5 评审维度自检 | ✅ 第 4 页 |
| 2.5 | 含 8 Agent 拓扑 | ✅ 第 6 页 |
| 2.6 | 含 3 编排流 | ✅ 第 10-12 页 |
| 2.7 | 含 Roadmap | ✅ 第 18 页 |

---

## 3. 参赛压缩包(必交 ✅)

| # | 检查项 | 状态 |
|---|---|---|
| 3.1 | 压缩包已生成 | `../aegisteam-adaptive-submission.zip` ✅ |
| 3.2 | 大小 < 50MB | 196KB ✅(无 node_modules) |
| 3.3 | 含 8 AgentSpec | ✅ |
| 3.4 | 含 27 SKILL.md | ✅ |
| 3.5 | 含 3 场景 JSON | ✅ |
| 3.6 | 含 6 类 MCP mock 代码 | ✅ |
| 3.7 | 含 5 份方案文档 | ✅ |
| 3.8 | 含 18 页 PPT Markdown | ✅ |
| 3.9 | 含 Apache 2.0 LICENSE | ✅ |
| 3.10 | 解压即跑(标准目录结构) | ✅ |

**重新生成压缩包**:

```bash
cd D:\GOAI\infra参赛作品\aegisteam-adaptive
bash scripts/build_submission.sh
```

**验证压缩包**:

```bash
# Windows
Expand-Archive -Path aegisteam-adaptive-submission.zip -DestinationPath test-extract
# 或
unzip -l aegisteam-adaptive-submission.zip
```

---

## 4. GitHub 仓库(必交 ✅)

| # | 检查项 | 状态 |
|---|---|---|
| 4.1 | 在 GitHub 创建空仓库 `aegisteam-adaptive` | ⏳ 用户手动创建 |
| 4.2 | 本地 `git init` | ⏳ 推送前执行 |
| 4.3 | `git add . && git commit` | ⏳ 见 PUSH.md |
| 4.4 | `git push -u origin main` | ⏳ 见 PUSH.md |
| 4.5 | 验证 README 渲染正常 | ⏳ |
| 4.6 | 验证 docs/ 5 份方案可见 | ⏳ |
| 4.7 | 验证 8 AgentSpec + 27 SKILL.md 可见 | ⏳ |
| 4.8 | 复制仓库 URL 到报名表 | ⏳ |

**详细步骤**:`PUSH.md`

---

## 5. Demo 链接(必交 ✅)

| # | 检查项 | 状态 |
|---|---|---|
| 5.1 | Demo 形态 | ✅ Web 前端(10 区大屏)+ curl 录屏 |
| 5.2 | Web 前端路径 | `web/` 目录 ✅ |
| 5.3 | Web 端运行命令 | `cd web && python3 -m http.server 8080` |
| 5.4 | 录屏(15-20 分钟) | ⏳ 用户录制(基于 Web 前端) |
| 5.5 | 录屏上传平台(YouTube/Bilibili) | ⏳ |
| 5.6 | 复制链接到报名表 | ⏳ |

**降级方案**:如果 Web 前端来不及,提供:
- Mock 工具网关的 curl 演示录屏
- Element Web 房间 + 3 条事故任务的截图

---

## 6. 报名表(必交 ⏳)

| # | 字段 | 内容 |
|---|---|---|
| 6.1 | 项目名 | AegisTeam Adaptive(自适应盾牌防御团队) |
| 6.2 | 赛道 | 赛道一:新智基座 | Agent Infra |
| 6.3 | 场景 | Cybersecurity + AI |
| 6.4 | 团队名 | AegisTeam Adaptive |
| 6.5 | 团队成员(3 人) | (待填写) |
| 6.6 | 联系方式 | (待填写) |
| 6.7 | GitHub 仓库 | (推送后填写) |
| 6.8 | Demo 链接 | (录屏上传后填写) |
| 6.9 | 压缩包路径 | `aegisteam-adaptive-submission.zip` |
| 6.10 | 方案简介(500 字) | `docs/00-main.md` Appendix B |

---

## 7. 答辩准备(评审现场 ⏳)

| # | 准备项 | 状态 |
|---|---|---|
| 7.1 | 15-20 分钟演讲稿 | ✅ 见 `ppt/AegisTeam-Adaptive-18pages.md` 演讲节奏 |
| 7.2 | Q&A 高频问题准备 | ✅ 见 PPT 末尾 8 个 Q&A |
| 7.3 | 演示 Demo 备用方案 | ⏳ curl + Element Web 截图 |
| 7.4 | 团队成员分工(谁讲哪几页) | ⏳ |
| 7.5 | 备用 PDF(网络故障时本地打开) | ⏳ |

---

## 8. 提交前的最后 5 分钟 Checklist

- [ ] 压缩包 md5/sha256 校验
- [ ] GitHub 链接可访问(在浏览器中打开)
- [ ] Demo 链接可播放
- [ ] 报名表所有字段已填
- [ ] 团队成员确认参加答辩
- [ ] 备用方案(本地 PDF + 录屏 U 盘)准备

---

## 9. 风险与降级方案

| 风险 | 影响 | 降级方案 |
|---|---|---|
| Web 前端来不及 | 评审看不到 UI | ~~用 Element Web 截图 + curl 演示录屏~~ ✅ 已完成 |
| Nacos Registry 没接 | 缺少复赛路径 | PPT 第 8-9 页已画全链路图,文档已说明 |
| 实际 LLM 跑不通 | demo 失败 | mock 工具 + 内联 Skill 已就位,可独立运行 |
| 时间不够压缩包 < 50MB | 文件过大 | 已排除 node_modules,实际 216KB(含 web/) |
| 团队成员临时有事 | 答辩缺人 | 3 人团队有冗余,可 1 人讲+1 人答+1 人备用 |

---

## 10. 复赛规划(初赛通过后)

| # | 任务 | 估时 |
|---|---|---|
| 10.1 | 接入 Nacos AI Registry | 2-3 周 |
| 10.2 | Skill 灰度发布(1% → 50% → 100%) | 1 周 |
| 10.3 | 真实 MCP Server(cmdb-mcp / siem-mcp / vuln-mcp / ti-mcp / notify-mcp / sbom-mcp) | 3-4 周 |
| 10.4 | 多模态告警(图片/音频) | 2 周 |
| 10.5 | SIEM/SOAR 真实接入 | 4 周 |
| 10.6 | 跨团队协同(HR/财务/法务) | 2 周 |
| 10.7 | Adaptive Engine 自学新攻击手法 | 8 周 |

---

**所有 P0 + P1 项 ✅ 后即可提交。**
