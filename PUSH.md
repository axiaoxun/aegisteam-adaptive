# 推送到 GitHub 指南

## 1. 在 GitHub 创建空仓库

1. 打开 https://github.com/new
2. 仓库名:`aegisteam-adaptive`
3. **不要勾选** Add a README file / Add .gitignore / Choose a license(我们已经有了)
4. 私有/公开二选一(比赛一般选公开)
5. 点击 Create repository

记下仓库 URL,例如:
- HTTPS:`https://github.com/<your-username>/aegisteam-adaptive.git`
- SSH:`git@github.com:<your-username>/aegisteam-adaptive.git`

## 2. 本地首次推送

```bash
cd D:\GOAI\infra参赛作品\aegisteam-adaptive

# 初始化 git(如果还没有)
git init

# 配置用户信息(如果还没有)
git config user.name "Your Name"
git config user.email "your-email@example.com"

# 添加远程仓库(用上面记下的 URL)
git remote add origin https://github.com/<your-username>/aegisteam-adaptive.git

# 暂存所有文件
git add .

# 第一次提交
git commit -m "feat: AegisTeam Adaptive v1.0 initial submission

- 8 AgentSpec + 27 SKILL.md
- HTTP mock tool gateway (6 类 MCP × 12 函数)
- 3 scenarios (alert_brute_force / regulator_notice / new_regulation)
- AgentTeams 协议文档(create_agents_messages / runbook / team_spec)
- 5 套方案文档(V1.2 主文档 + 4 份子文档)
- Apache 2.0 License + README + docker-compose"

# 推送到 main 分支
git branch -M main
git push -u origin main
```

如果提示输入凭据:
- HTTPS:输入 GitHub 用户名 + Personal Access Token(PAT)
- SSH:无需输入(已配 SSH key)

## 3. 后续提交

```bash
git add .
git commit -m "feat: 增强 Skill 描述"
git push
```

## 4. 推荐:创建分支用于不同阶段

```bash
# 复赛分支
git checkout -b feature/registry-nacos
# 修改文件后
git add . && git commit -m "feat: 接入 Nacos AI Registry 灰度发布"
git push -u origin feature/registry-nacos
# 在 GitHub 网页创建 Pull Request
```

## 5. 推送过程中的常见问题

| 问题 | 解决方案 |
|---|---|
| `fatal: remote origin already exists` | `git remote remove origin` 后重新 `git remote add origin ...` |
| `Permission denied (publickey)` | SSH key 未配,改用 HTTPS + PAT |
| `support for password authentication was removed` | 必须用 PAT,不能直接用 GitHub 密码 |
| `Updates were rejected because the remote contains work` | 远程有更新,先 `git pull --rebase` 再 `git push` |

## 6. 验证推送成功

访问 `https://github.com/<your-username>/aegisteam-adaptive`,确认:
- README.md 渲染正常(有徽章和架构图)
- docs/ 5 份方案文档在
- at/ 协议文档在
- agents/ 8 个 AgentSpec 在
- skills/ 27 个 SKILL.md 在
- tools/ mock 工具网关代码在
- scenarios/ 3 个 JSON 在
- LICENSE 显示 Apache 2.0

把 GitHub URL 填到比赛报名表。
