#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""基于 template.pptx 生成 AegIsLoop Adaptive 参赛 PPT(内容文字版)。

策略:保留模板封面 / P0 / 目录 / 7 个章节分隔页的视觉框架;
content 页删除示例图片与"建议覆盖"提示,替换为实际文字内容;
第一章后新增一页「竞品对比」。
"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE_TYPE
from pptx.oxml.ns import qn

SRC = "/mnt/d/GOAI/infra参赛作品/template.pptx"
DST = "/mnt/d/GOAI/infra参赛作品/aegisteam-adaptive/ppt/AegIsLoop-Adaptive.pptx"

INK    = RGBColor(0x1F, 0x29, 0x37)
GREY   = RGBColor(0x6B, 0x72, 0x80)
ACCENT = RGBColor(0x4F, 0x46, 0xE5)
BRAND  = RGBColor(0x7C, 0x3A, 0xED)
FONT   = "Microsoft YaHei"

prs = Presentation(SRC)


# ---------- helpers ----------
def _set_font(run, size=12, bold=False, color=INK):
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = color
    run.font.name = FONT
    rPr = run._r.get_or_add_rPr()
    for tag in ("a:ea", "a:cs"):
        e = rPr.find(qn(tag))
        if e is None:
            e = rPr.makeelement(qn(tag), {})
            rPr.append(e)
        e.set("typeface", FONT)


def remove_shape(shape):
    shape._element.getparent().remove(shape._element)


def set_shape_text(shape, text, size=12, bold=False, color=INK, align=None):
    """清空并重写一个已有 shape 的文字,支持 \\n 换行。"""
    tf = shape.text_frame
    p = tf.paragraphs[0]
    for r in list(p.runs):
        r._r.getparent().remove(r._r)
    for extra in tf.paragraphs[1:]:
        extra._p.getparent().remove(extra._p)
    lines = text.split("\n")
    for i, line in enumerate(lines):
        if i == 0:
            run = p.add_run()
        else:
            run = tf.add_paragraph().add_run()
        run.text = line
        _set_font(run, size, bold, color)
        if align:
            p.alignment = align


HINT_MARKERS = ("建议覆盖", "建议用", "可从以下方面")


def clear_pictures_and_hints(slide):
    to_remove = []
    for shape in slide.shapes:
        if shape.shape_type == MSO_SHAPE_TYPE.PICTURE:
            to_remove.append(shape)
        elif shape.has_text_frame:
            t = shape.text_frame.text
            if "（示例）" in t or any(m in t for m in HINT_MARKERS):
                to_remove.append(shape)
    for s in to_remove:
        remove_shape(s)


def _add_textbox(slide, left, top, width, height):
    tb = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = tb.text_frame
    tf.word_wrap = True
    return tf


def _first_para(tf):
    if len(tf.paragraphs) == 1 and not tf.paragraphs[0].runs:
        return tf.paragraphs[0]
    return tf.add_paragraph()


def add_para(tf, text, size=12, bold=False, color=INK, align=None):
    p = _first_para(tf)
    p.space_before = Pt(2)
    p.space_after = Pt(2)
    if align:
        p.alignment = align
    run = p.add_run()
    run.text = text
    _set_font(run, size, bold, color)
    return p


def add_bullet(tf, text, size=11.5, bold=False, color=INK):
    p = _first_para(tf)
    p.space_before = Pt(1)
    p.space_after = Pt(1)
    run = p.add_run()
    run.text = "▪ " + text
    _set_font(run, size, bold, color)
    return p


def add_table(slide, left, top, width, data, font_size=10, header_bold=True):
    rows, cols = len(data), len(data[0])
    height = 0.34 * rows
    shp = slide.shapes.add_table(rows, cols, Inches(left), Inches(top), Inches(width), Inches(height))
    tbl = shp.table
    for r in range(rows):
        for c in range(cols):
            cell = tbl.cell(r, c)
            cell.text = str(data[r][c])
            cell.margin_top = Pt(1)
            cell.margin_bottom = Pt(1)
            for p in cell.text_frame.paragraphs:
                for run in p.runs:
                    _set_font(run, font_size, bold=(header_bold and r == 0), color=INK)
    return shp


def render_blocks(slide, blocks):
    """在 content 页按顺序排版 blocks。block = (kind, ...)"""
    clear_pictures_and_hints(slide)
    x, y = 0.7, 1.45
    width = 12.0
    for b in blocks:
        kind = b[0]
        if kind == "title":
            tf = _add_textbox(slide, x, y, width, 0.42)
            add_para(tf, b[1], size=15, bold=True, color=BRAND)
            y += 0.46
        elif kind == "quote":
            tf = _add_textbox(slide, x, y, width, 0.55)
            add_para(tf, b[1], size=12.5, bold=True, color=ACCENT)
            y += 0.58
        elif kind == "bullet":
            tf = _add_textbox(slide, x, y, width, 0.38)
            add_bullet(tf, b[1])
            y += 0.38
        elif kind == "table":
            data = b[1]
            fs = b[2] if len(b) > 2 else 10
            add_table(slide, x, y, width, data, font_size=fs)
            y += 0.34 * len(data) + 0.28


def move_slide(old_index, new_index):
    xml_slides = prs.slides._sldIdLst
    slides = list(xml_slides)
    xml_slides.remove(slides[old_index])
    xml_slides.insert(new_index, slides[old_index])


# ---------- 1. 封面 ----------
s1 = prs.slides[0]
for shape in s1.shapes:
    if not shape.has_text_frame:
        continue
    t = shape.text_frame.text
    if "内容框架模板" in t:
        set_shape_text(shape, "AegIsLoop Adaptive\n自适应 AI 安全运营团队", size=40, bold=True, color=INK)
    elif "Datawhale" in t:
        set_shape_text(shape, "AegIsLoop Adaptive Team · 2026-08-16", size=12, color=GREY)
    elif "方案 PPT 模板" in t:
        set_shape_text(shape, "GOAI 2026 · 赛道一 新智基座 | Agent Infra(Cybersecurity + AI)", size=14, color=ACCENT)

# ---------- 2. P0 一页纸 ----------
p0_fills = {
    "【在此填写项目名称】": "AegIsLoop Adaptive 自适应 AI 安全运营团队",
    "【描述真实场景与核心痛点】": "大部分政府事业单位与中小企业面临安全预算、专职安全人员不足问题,面对高频攻击告警/监管通报整改/新法规落地等常见网络安全场景,存在4个痛点:守不住(24h值守)、来不及(快速响应)、讲不通(便捷沟通)、落不下(制度落地)",
    "【概述端到端解决方案】": "8岗位化安全Agent + 1人机协同层 + A6自适应引擎;3编排流(告警/监管/新法规)端到端跑通",
    "【列 1–2 个关键差异化优势】": "A6自适应反馈 + L0.5人机协同 + 合规专家(不止告警降噪)",
    "【说明复用与迁移价值】": "Apache 2.0 全栈开源,200+ 文件可复用",
    "【说明当前完成度与里程碑】": "v1.0 完赛态 + Web demo + Nacos AI Registry(复赛)",
}
for shape in prs.slides[1].shapes:
    if shape.has_text_frame and shape.text_frame.text in p0_fills:
        set_shape_text(shape, p0_fills[shape.text_frame.text], size=11, color=INK)

# ---------- 3. 目录:第 8 项 Demo视频 -> 团队介绍 ----------
for shape in prs.slides[2].shapes:
    if shape.has_text_frame and "Demo视频" in shape.text_frame.text:
        set_shape_text(shape, "团队介绍")

# ---------- 4. content 页 ----------
# 第一章 场景与价值
render_blocks(prs.slides[4], [
    ("title", "目标用户与核心痛点"),
    ("bullet", "目标用户:大部分政府事业单位与中小企业(年安全预算<50万,专职安全<3人)"),
    ("bullet", "痛点(两压×两缺→四难):威胁严峻×合规繁多×资金缺×人员缺 → 守不住·来不及·讲不通·落不下"),
    ("title", "三类真实场景(AgentTeams 端到端跑通)"),
    ("bullet", "① 高频攻击告警 → Flow1(22步):告警→响应 <5min"),
    ("bullet", "② 监管通报整改 → Flow2(26步):通报→整改方案 <24h"),
    ("bullet", "③ 新法规落地 → Flow3(14步):法规→合规方案 <30d"),
    ("title", "可量化价值(对比纯人工)"),
    ("table", [
        ["指标", "纯人工", "AegIsLoop", "提升"],
        ["告警→初步响应", "4h", "<5min", "24×"],
        ["通报→整改计划", "5-7d", "<24h", "5×+"],
        ["新法规→合规方案", "2-3月", "<30d", "3×+"],
    ]),
])

# 第二章 方案总览
render_blocks(prs.slides[6], [
    ("title", "五层架构"),
    ("bullet", "L1 Team编排(AgentTeams/hiclaw, A0) · L2 8岗位化安全Agent · L3 32 Skill · L4 6MCP+5RAG · L0.5 人机协同 · L5 可观测"),
    ("title", "端到端主流程"),
    ("bullet", "事故触发 → A0路由 → 3编排流(告警22步/监管26步/法规14步) → 8Agent协同 → A6自适应+L0.5审批 → 输出报告 → A7知识回写"),
    ("title", "关键技术选型"),
    ("table", [
        ["选型", "必要性", "边界"],
        ["AgentTeams", "官方 baseline 同源", "仅用编排,Worker自研"],
        ["Nacos AI Registry", "官方推荐 Registry", "复赛接入,初赛Mock契约一致"],
        ["6 MCP + 5 RAG Mock", "评审可重放", "协议对齐 CEF/CycloneDX/CVE/STIX"],
    ]),
])

# 第三章 多 Agent 协同
render_blocks(prs.slides[8], [
    ("title", "8 Agent 分工(映射 SOC 8 大岗)"),
    ("table", [
        ["ID", "岗位", "Skill", "核心职责"],
        ["A0", "TeamLeader", "4", "路由·审批·报告"],
        ["A1", "资产管理", "4", "CMDB·SBOM·暴露面"],
        ["A2", "威胁检测", "4", "告警融合·IOC富化"],
        ["A3", "漏洞验证", "4", "CVE·EPSS·KEV"],
        ["A4", "合规管理", "4", "法规RAG·PIA·备案"],
        ["A5", "应急响应", "3", "修复·验证·回滚"],
        ["A6", "自适应引擎", "4", "质量·漂移·反馈"],
        ["A7", "复盘织造", "5", "复盘·知识回写"],
    ], 9),
    ("title", "高风险动作安全边界"),
    ("bullet", "L0只读 · L1事后告知 · L2 H1+H2双签 · L3三审(法规场景) · L4冻结+监管直报"),
    ("bullet", "证据链锚定:每个结论附 evidence_id,可追溯到原始证据;审批不可并行"),
])

# 第四章 Skill 工程
render_blocks(prs.slides[10], [
    ("title", "32 Skill(按 Agent 分布)"),
    ("bullet", "A0编排4 · A1资产4 · A2检测4 · A3漏洞4 · A4合规4 · A5响应3 · A6质量4 · A7复盘5 = 32"),
    ("title", "单 Skill 规格(以 S24 output_quality 为例)"),
    ("bullet", "输入:output_text / evidence_chain / skill_versions → 输出:score(0-100) / feedback_action / reason"),
    ("bullet", "失败处理:score<30 升级A0 · 超时重跑退避 · 连续3次失败自动回滚"),
    ("title", "生命周期与复用"),
    ("bullet", "v1.0→v1.1→v1.2→v1.3.1→v1.4(Roadmap) · stable/candidate/snapshot 灰度 · reuse_targets 可迁移标注"),
])

# 第五章 工程落地
render_blocks(prs.slides[12], [
    ("title", "可运行性"),
    ("bullet", "git clone + build_submission.sh · node serve.js 零依赖 · 3 编排流可回放(22+26+14=62步)"),
    ("title", "运行证据(评审可验证)"),
    ("bullet", "Web 10区大屏 · 3场景JSON · 8AgentSpec · 32SKILL.md · 演示视频"),
    ("title", "安全治理机制"),
    ("bullet", "角色化审批(H1/H2/L3三审) · 证据链锚定 · 全留痕审计 · L0-L4分级 · A6漂移自动回滚"),
])

# 第六章 开源
render_blocks(prs.slides[14], [
    ("title", "可复用成果(200+ 文件)"),
    ("bullet", "8 AgentSpec · 32 SKILL.md · 3 场景JSON · 6 MCP Mock · 5 RAG Mock(294,440条) · Web源码"),
    ("title", "接口契约"),
    ("bullet", "MCP 协议 · CEF / CycloneDX1.5 / CVE5.0 / STIX2.1 · Nacos Registry(semver + tag)"),
    ("title", "开源协议"),
    ("bullet", "Apache License 2.0 全栈开源(明确专利授权,商用更安全)"),
])

# 第七章 落地计划
render_blocks(prs.slides[16], [
    ("title", "里程碑"),
    ("table", [
        ["版本", "时间", "关键能力"],
        ["v1.0 初赛", "2026-08", "8Agent + 32Skill + 3编排流"],
        ["v1.1", "2026-09", "Web demo + 视频 + Release"],
        ["v1.2 复赛", "2026-10", "Nacos Registry + Skill灰度"],
        ["v1.3", "2026-12", "真实 SIEM/SOAR 接入"],
        ["v2.0", "2027-H1", "Adaptive 自学 + 多租户"],
    ]),
    ("title", "风险控制"),
    ("bullet", "Nacos不熟(中)→初赛Mock契约一致 · 真实接入(中)→协议对齐零改动 · 自适应误判(低)→分级+人工兜底"),
])

# 第八章 团队
render_blocks(prs.slides[18], [
    ("title", "团队(3 人)"),
    ("table", [
        ["角色", "背景", "分工"],
        ["PM/架构", "10年安全运营", "方案·8Agent分工·监管场景"],
        ["算法/Agent", "2年大模型", "32Skill·A6引擎·Nacos"],
        ["工程/演示", "5年全栈", "Web大屏·MCP/RAG·视频"],
    ]),
    ("bullet", "互补:运营+算法+工程 三角覆盖赛题全维度"),
    ("bullet", "投入:22天 × 每周50h+,日 stand-up + 周 demo"),
])

# ---------- 5. 新增:竞品对比页(插到第一章内容之后) ----------
new_layout = prs.slides[4].slide_layout
comp_slide = prs.slides.add_slide(new_layout)
move_slide(len(prs.slides) - 1, 5)

render_blocks(comp_slide, [
    ("title", "差异化 · 市面 AI SOC 止步于告警降噪"),
    ("quote", "别人送你一个更聪明的告警面板(17万条→42条);AegIsLoop 送你一支会合规、会举一反三、会自我进化的安全运营团队。"),
    ("table", [
        ["维度", "市面 AI SOC", "AegIsLoop Adaptive"],
        ["本质", "告警研判引擎(更聪明的面板)", "8岗位化安全Agent自适应安全运营团队"],
        ["事件覆盖", "仅告警(1类)", "告警+监管通报+新法规(3类)"],
        ["误报降噪", "✅ 97.7%", "✅ 融合+情报研判"],
        ["合规/被通报整改", "❌ 未覆盖", "✅ A4合规专家闭环(法条映射+PIA)"],
        ["自进化/举一反三", "❌ 静态规则", "✅ A6自适应 + A7复盘回写Runbook"],
        ["治理/审计", "⚠️ 黑盒难追溯", "✅ L0.5人机协同+证据链+L0-L3分级"],
        ["部署形态", "公有云托管", "✅ 开源私有化,数据不出单位"],
    ], 9),
])

prs.save(DST)
print("OK ->", DST)
print("total slides:", len(prs.slides))
