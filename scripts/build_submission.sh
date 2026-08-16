#!/usr/bin/env bash
# AegIsLoop Adaptive — 压缩包打包脚本
# 用法:bash scripts/build_submission.sh
# 产物:../aegisloop-adaptive-submission.zip(根目录的上一级)
# 注:本地源码目录名仍是 aegisteam-adaptive(因 Trae IDE 锁住无法重命名)
# 兼容:Windows Git Bash / Mac / Linux(用 Python zipfile,不依赖 zip 命令)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PARENT_DIR="$(cd "$ROOT_DIR/.." && pwd)"
OUTPUT_NAME="aegisloop-adaptive-submission"
OUTPUT_PATH="$PARENT_DIR/${OUTPUT_NAME}.zip"
# staging 目录直接叫 aegisloop-adaptive,这样 zip 内部路径干净
STAGING_DIR="$PARENT_DIR/aegisloop-adaptive"

echo "=========================================="
echo "  AegIsLoop Adaptive 压缩包打包"
echo "=========================================="
echo "源码根: $ROOT_DIR"
echo "输出: $OUTPUT_PATH"
echo ""

cd "$ROOT_DIR"

# 0. 清理
echo "[0/6] 清理临时文件..."
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "*.pyc" -delete 2>/dev/null || true
find . -name ".DS_Store" -delete 2>/dev/null || true

# 1. 准备 staging
echo "[1/6] 准备 staging 目录..."
rm -rf "$STAGING_DIR"
mkdir -p "$STAGING_DIR"

# 2. 复制
echo "[2/6] 复制文件..."
cp README.md LICENSE .gitignore PUSH.md docker-compose.yml "$STAGING_DIR/"
cp -r docs/ "$STAGING_DIR/docs/"
cp -r at/ "$STAGING_DIR/at/"
cp -r agents/ "$STAGING_DIR/agents/"
cp -r skills/ "$STAGING_DIR/skills/"
cp -r tools/ "$STAGING_DIR/tools/"
cp -r scenarios/ "$STAGING_DIR/scenarios/"
cp -r ppt/ "$STAGING_DIR/ppt/"
cp -r scripts/ "$STAGING_DIR/scripts/"

if [ -d "web" ]; then
  echo "  - web/ 存在,复制全部源码(无 build step,HTML+ESM+CDN)"
  mkdir -p "$STAGING_DIR/web"
  # 复制所有非 node_modules / .vite / dist 的文件
  for f in $(find web -type f -not -path "*/node_modules/*" -not -path "*/.vite/*" -not -path "*/dist/*" -not -name "*.pyc"); do
    rel="${f#web/}"
    mkdir -p "$STAGING_DIR/web/$(dirname "$rel")"
    cp "$f" "$STAGING_DIR/web/$rel"
  done
fi

# 3. 验证
echo "[3/6] 验证 staging..."
TOTAL_FILES=$(find "$STAGING_DIR" -type f | wc -l)
TOTAL_SIZE=$(du -sh "$STAGING_DIR" | cut -f1)
echo "  - 总文件数: $TOTAL_FILES"
echo "  - 总大小: $TOTAL_SIZE"

REQUIRED_FILES=(
  "README.md"
  "LICENSE"
  "docs/00-main.md"
  "docs/01-agents-and-skills.md"
  "docs/02-orchestration.md"
  "docs/03-presentation-materials.md"
  "docs/04-infrastructure.md"
  "at/AgentTeam.md"
  "at/AGENTTEAMS_RUNBOOK.md"
  "at/create_agents_messages.md"
  "at/run_demo_task_message.md"
  "at/team_spec.json"
  "at/nacos_registry_mock.json"
  "tools/mock_tool_server.py"
  "tools/mock_tools.py"
  "tools/tool_catalog.json"
  "tools/MCP_MAPPING.md"
  "scenarios/alert_brute_force.json"
  "scenarios/regulator_notice.json"
  "scenarios/new_regulation.json"
  "ppt/AegIsLoop-Adaptive-18pages.md"
)

MISSING=0
for f in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$STAGING_DIR/$f" ]; then
    echo "  ❌ 缺失: $f"
    MISSING=$((MISSING+1))
  fi
done

if [ $MISSING -gt 0 ]; then
  echo "=========================================="
  echo "  ❌ 缺失 $MISSING 个关键文件,中止打包"
  echo "=========================================="
  rm -rf "$STAGING_DIR"
  exit 1
fi

AGENT_COUNT=$(find "$STAGING_DIR/agents" -name "Agent.md" | wc -l)
SKILL_COUNT=$(find "$STAGING_DIR/skills" -name "SKILL.md" | wc -l)
echo "  - AgentSpec 数: $AGENT_COUNT (期望 8)"
echo "  - SKILL.md 数: $SKILL_COUNT (期望 32)"

if [ $AGENT_COUNT -ne 8 ] || [ $SKILL_COUNT -ne 32 ]; then
  echo "  ❌ 数量不对,中止"
  rm -rf "$STAGING_DIR"
  exit 1
fi

echo "  ✅ 所有关键文件齐全"

# 4. 选择打包方式:Python > PowerShell > zip
echo "[4/6] 打包 zip..."

cd "$PARENT_DIR"
rm -f "$OUTPUT_PATH"

if command -v python3 >/dev/null 2>&1 || command -v python >/dev/null 2>&1; then
  PYTHON=$(command -v python3 || command -v python)
  echo "  - 使用 Python zipfile 打包"
  "$PYTHON" -c "
import os, sys, zipfile
src = r'$STAGING_DIR'
out = r'$OUTPUT_PATH'
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(src):
        # 排除 __pycache__ 和 .pyc
        dirs[:] = [d for d in dirs if d != '__pycache__']
        for f in files:
            if f.endswith('.pyc') or f == '.DS_Store':
                continue
            full = os.path.join(root, f)
            arc = os.path.relpath(full, os.path.dirname(src))
            zf.write(full, arc)
print(f'OK: {out}')
"
elif command -v powershell >/dev/null 2>&1 || command -v pwsh >/dev/null 2>&1; then
  PS=$(command -v powershell || command -v pwsh)
  echo "  - 使用 PowerShell Compress-Archive 打包"
  "$PS" -NoProfile -Command "Compress-Archive -Path '${STAGING_DIR}' -DestinationPath '${OUTPUT_PATH}' -Force"
elif command -v zip >/dev/null 2>&1; then
  echo "  - 使用 zip 命令打包"
  zip -r "$OUTPUT_PATH" "${OUTPUT_NAME}-staging" -x "*.DS_Store" "*/__pycache__/*" "*.pyc"
else
  echo "  ❌ 找不到任何打包工具(python/powershell/zip 都不存在)"
  rm -rf "$STAGING_DIR"
  exit 1
fi

# 5. zip 完成后,清理 staging 目录(避免和源码目录冲突,源码目录可能也叫 aegisloop-adaptive)
#    注:此处不再 rename staging,因为它已经是干净的 aegisloop-adaptive 名字

# 6. 完成
echo "[5/6] 完成!"
echo ""
echo "=========================================="
echo "  ✅ 压缩包构建成功"
echo "=========================================="
echo "  路径: $OUTPUT_PATH"
echo "  大小: $(du -sh "$OUTPUT_PATH" | cut -f1)"
echo "  文件数: $TOTAL_FILES"
echo "  解压目录: $PARENT_DIR/${OUTPUT_NAME}/"
echo ""
echo "解压验证:"
echo "  unzip -l \"$OUTPUT_PATH\" 2>/dev/null || python -c \"import zipfile; z=zipfile.ZipFile('$OUTPUT_PATH'); [print(n) for n in z.namelist()[:30]]\""
echo "=========================================="
