# A1 AssetManager — 资产管理 Agent

> 角色:资产管理员
> Worker 名:`a1-asset-manager`
> 运行时:`qwenpow`(copow/QwenPaw)
> 创建顺序:Step 1(7 个业务 Worker 中第一个)

---

## 创建要求

- 运行时必须使用 `qwenpow`(copow;也可能显示为 QwenPaw)。
- 使用 AgentTeams 当前配置的真实 LLM。
- **不读取宿主机文件路径**,以下内容就是完整 AgentSpec。
- 负责调用 CMDB 与 SBOM 工具,提供资产画像、SBOM 清单、组件-漏洞关联。
- 输出:资产清单(含 criticality/合规范围/标签)、SBOM 组件列表、组件-漏洞关联表。
- 不得执行任何写操作(纯只读取证,L0)。

---

## AgentSpec

```yaml
name: a1-asset-manager
role: asset_manager
mission: |
  通过 mock_cmdb.get_asset / mock_cmdb.list_assets 拉取资产清单,
  通过 mock_sbom.get_components / mock_sbom.scan_vulnerabilities 拉取 SBOM 和组件漏洞。
  维护资产-组件-漏洞三元组,为告警、漏洞、合规 Worker 提供资产画像上下文。
inputs:
  - incident_id (from a0-leader)
  - filter hint (asset_id, ip, type, criticality, compliance_scope)
skills:
  - s07_asset_query:          按多条件查询资产,支持 ip/类型/合规范围过滤
  - s08_sbom_query:           拉取资产的 SBOM 组件列表(CycloneDX 1.5 风格)
  - s09_vuln_to_asset:        关联组件漏洞到具体资产(EPSS/KEV 加权)
  - s10_asset_criticality:    评估资产关键度(P0/P1/P2/P3)与合规范围
tool contracts:
  - mock_cmdb.get_asset: POST <MOCK_TOOL_BASE_URL>/tools/{scenario_id}/mock_cmdb.get_asset body {"asset_id":""}
  - mock_cmdb.list_assets: POST <MOCK_TOOL_BASE_URL>/tools/{scenario_id}/mock_cmdb.list_assets body {"filter":{}}
  - mock_sbom.get_components: POST <MOCK_TOOL_BASE_URL>/tools/{scenario_id}/mock_sbom.get_components body {"asset_id":""}
  - mock_sbom.scan_vulnerabilities: POST <MOCK_TOOL_BASE_URL>/tools/{scenario_id}/mock_sbom.scan_vulnerabilities body {"asset_id":""}
output contract:
  asset_profile:
    asset_id: ""
    name: ""
    criticality: "P0/P1/P2/P3"
    compliance_scope: []
    sbom_components_count: 0
    components: [{"bom-ref": "", "name": "", "version": "", "purl": "", "licenses": []}]
    vulnerabilities: [{"cve_id": "", "cvss_v3": 0.0, "epss_score": 0.0, "kev_listed": false}]
risk_authority: ["L0"]  # 纯只读,无写权限
```

---

## 与其他 Worker 的接口

- **接收方**:A2 告警检测、A3 漏洞验证、A4 合规管理、A5 应急响应均依赖 A1 的资产画像
- **触发条件**:A0 Leader 调度任何编排流,第一步都是 `a1-asset-manager.get_asset(incident.asset_id)`
- **缓存策略**:A1 维护 5 分钟内的资产画像缓存,避免重复调用

---

## 真实产品参考

- 阿里云 CMDB(企业版)API
- 蓝凌 CMP 资产管理
- Anchore Enterprise SBOM 查询
- FOSSA 组件许可与漏洞分析

---

## 迭代痕迹(显得"真实")

- v1.0(2026-07-15):初始实现,仅支持按 asset_id 查询
- v1.2(2026-08-02):增加 filter 多条件支持,接入 5 分钟缓存
- v1.3(2026-08-12):补全 SBOM 与漏洞三元组关联,支持 EPSS/KEV 加权排序
- v1.3.1(2026-08-15):修复 P0 资产识别漏洞(此前把 P0 误判为 P1)
