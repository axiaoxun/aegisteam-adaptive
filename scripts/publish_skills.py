#!/usr/bin/env python3
"""AegIsLoop Adaptive — Skill 一键发布脚本。

把现有 Skill 资产统一解析成 Nacos AI Registry 可注册的 SkillCard:
  1. 扫描 `skills/*/SKILL.md`(32 个),解析 frontmatter + `## 作用` 描述 + 正文。
  2. 生成 `at/skills_bundle.json`(SkillCard 数组,按 name 排序)。
  3. 可选 `--register` 连真实 Nacos Open API 发布(config publish 模式)。

用法:
  python3 scripts/publish_skills.py                  # 只生成 bundle(默认)
  python3 scripts/publish_skills.py --register --addr http://127.0.0.1:8848  # 连真实 Nacos 注册

注意:Nacos Skill Registry 需要 Nacos 3.2.0+;低版本时 `--register` 会退化为
config publish(把 SkillCard 以配置形式写入,仍可被 Worker 按 dataId 拉取)。
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional

ROOT = Path(__file__).resolve().parents[1]
SKILLS_DIR = ROOT / "skills"
OUTPUT_BUNDLE = ROOT / "at" / "skills_bundle.json"

NAMESPACE = "aegisloop-adaptive"
GROUP = "AEGISLOOP_SKILLS"

# 复赛替换点:接入 Nacos 3.2+ Skill Registry SDK 后,把 config publish 换成 skill 发布 API
NACOS_CONFIG_PUBLISH = "/nacos/v1/cs/configs"


def parse_frontmatter(text: str) -> Dict[str, str]:
    """解析 SKILL.md 顶部 YAML frontmatter(name/version/owner_agent/tag/category)。"""
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.DOTALL)
    meta: Dict[str, str] = {}
    if not m:
        return meta
    for line in m.group(1).splitlines():
        if ":" in line:
            k, _, v = line.partition(":")
            meta[k.strip()] = v.strip()
    return meta


def extract_description(text: str) -> str:
    """从 `## 作用` 小节取首段非空文字作为描述。"""
    m = re.search(r"##\s*作用\s*\n\s*\n(.*?)(?:\n\s*\n|\n##|\Z)", text, re.DOTALL)
    if not m:
        return ""
    desc = m.group(1).strip().splitlines()
    return desc[0].strip() if desc else ""


def extract_display_name(text: str, name: str) -> str:
    """从首行 `# Sxx Name — 中文名` 提取中文名,退回用 name。"""
    m = re.search(r"^#\s*(.+)$", text, re.MULTILINE)
    if not m:
        return name
    title = m.group(1).strip()
    if "—" in title:
        cn = title.split("—", 1)[1].strip()
        if cn:
            return cn
    return title if title else name


def parse_skill_md(path: Path) -> Optional[Dict[str, Any]]:
    text = path.read_text(encoding="utf-8")
    meta = parse_frontmatter(text)
    if not meta.get("name"):
        return None
    return {
        "name": meta["name"],
        "displayName": extract_display_name(text, meta["name"]),
        "version": meta.get("version", "v1.0.0"),
        "tag": meta.get("tag", "stable"),
        "category": meta.get("category", "uncategorized"),
        "ownerAgent": meta.get("owner_agent", ""),
        "description": extract_description(text),
        "content": text.strip(),
        "source": f"skills/{path.parent.name}/SKILL.md",
    }


def build_skillcards() -> List[Dict[str, Any]]:
    cards: List[Dict[str, Any]] = []
    for md in sorted(SKILLS_DIR.glob("*/SKILL.md")):
        card = parse_skill_md(md)
        if card:
            cards.append(card)
    cards.sort(key=lambda c: c["name"])
    return cards


def write_bundle(cards: List[Dict[str, Any]], out: Path) -> None:
    bundle = {
        "registry": "nacos-ai-registry",
        "namespace": NAMESPACE,
        "group": GROUP,
        "skillcard_version": "1.0",
        "total": len(cards),
        "generated_note": "由 scripts/publish_skills.py 生成;复赛接入 Nacos 3.2+ Skill Registry 后按 dataId 逐个发布",
        "skills": cards,
    }
    out.write_text(
        json.dumps(bundle, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"  已写入 {out.relative_to(ROOT)} ({len(cards)} 个 SkillCard)")


def register_to_nacos(cards: List[Dict[str, Any]], addr: str) -> int:
    """把 SkillCard 以 config publish 方式写入 Nacos(低版本退化路径)。"""
    url = addr.rstrip("/") + NACOS_CONFIG_PUBLISH
    ok, fail = 0, 0
    for card in cards:
        data_id = f"skill.{card['name']}.{card['version']}"
        params = urllib.parse.urlencode(
            {"dataId": data_id, "group": GROUP, "namespaceId": NAMESPACE,
             "content": json.dumps(card, ensure_ascii=False)}
        )
        try:
            req = urllib.request.Request(
                url + "?" + params, method="POST",
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                body = resp.read().decode("utf-8")
                ok += 1
                print(f"  ✓ {data_id}")
        except Exception as exc:  # noqa: BLE001
            fail += 1
            print(f"  ✗ {data_id}: {exc}")
    print(f"  注册结果:成功 {ok} / 失败 {fail}")
    return 0 if fail == 0 else 1


def main() -> int:
    parser = argparse.ArgumentParser(description="AegIsLoop Adaptive Skill 发布")
    parser.add_argument("--register", action="store_true", help="连真实 Nacos 注册")
    parser.add_argument("--addr", default="http://127.0.0.1:8848", help="Nacos 地址")
    parser.add_argument("--out", type=Path, default=OUTPUT_BUNDLE, help="bundle 输出路径")
    args = parser.parse_args()

    print("==========================================")
    print("  AegIsLoop Adaptive — Skill 一键发布")
    print("==========================================")

    cards = build_skillcards()
    by_agent: Dict[str, int] = {}
    for c in cards:
        by_agent[c["ownerAgent"]] = by_agent.get(c["ownerAgent"], 0) + 1

    print(f"  共 {len(cards)} 个 SkillCard,按 owner_agent 分布:")
    for agent, n in sorted(by_agent.items()):
        print(f"    - {agent}: {n}")

    write_bundle(cards, args.out)

    if args.register:
        print(f"  正在注册到 Nacos: {args.addr}")
        return register_to_nacos(cards, args.addr)

    print("  完成。加 --register --addr <nacos地址> 可连真实 Nacos 发布。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
