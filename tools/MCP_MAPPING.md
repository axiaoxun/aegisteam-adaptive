# AegIsLoop MCP 映射说明

AegIsLoop Adaptive 的 mock 工具网关覆盖 6 类安全运营 MCP 工具,共 12 个函数。

## HTTP 调用协议

```text
POST http://<MOCK_TOOL_BASE_URL>/tools/{scenario_id}/{tool_name}.{function_name}
Content-Type: application/json
```

示例:

```bash
curl -X POST http://127.0.0.1:18090/tools/alert_brute_force/mock_siem.get_alert \
  -H 'Content-Type: application/json' \
  -d '{"alert_id": "ALERT-2001"}'
```

## 工具清单

| # | 工具 | 函数 | 未来 MCP 映射 | 真实产品参考 |
|---|---|---|---|---|
| 1 | `mock_cmdb` | `get_asset` | `cmdb.get_asset` | 阿里云 CMDB / 蓝凌 CMP |
| 2 | `mock_cmdb` | `list_assets` | `cmdb.list_assets` | 同上 |
| 3 | `mock_sbom` | `get_components` | `sbom.cyclonedx.query` | Anchore / FOSSA / Snyk |
| 4 | `mock_sbom` | `scan_vulnerabilities` | `sbom.vuln.scan` | 同上 |
| 5 | `mock_siem` | `search_events` | `siem.events.search` | Splunk ES / QRadar / 奇安信 NDR / 阿里云云安全中心 |
| 6 | `mock_siem` | `get_alert` | `siem.alerts.get` | 同上 |
| 7 | `mock_vuln_scanner` | `scan_target` | `vuln_scanner.scan` | Nessus / Qualys / 绿盟 / 启明星辰 |
| 8 | `mock_vuln_scanner` | `get_cve_info` | `cve.info` | 同上 |
| 9 | `mock_threat_intel` | `query_ioc` | `ti.ioc.query` | 微步在线 / 奇安信 TI / VirusTotal / OTX |
| 10 | `mock_threat_intel` | `lookup_malware` | `ti.malware.lookup` | 同上 |
| 11 | `mock_notify` | `send_message` | `notify.send` | 钉钉 / 企微 / 飞书 / SMTP |
| 12 | `mock_notify` | `list_channels` | `notify.channels.list` | 同上 |

## 工具替换路径(初赛 → 复赛 → 生产)

| 阶段 | mock 工具 | 真实工具 | 接入方式 |
|---|---|---|---|
| 初赛 | HTTP mock 工具网关(本仓库 `tools/mock_tool_server.py`) | — | 本地启动 `python3 tools/mock_tool_server.py` |
| 复赛 | Higress MCP 代理(转真实后端) | 6 类 MCP Server | 通过 `higress.ai/hiclaw` 注册,Worker 走统一 MCP 协议 |
| 生产 | 直接对接 | 阿里云/奇安信/微步等真实 SaaS | 凭据通过 Nacos 配置中心下发 |

## 数据格式参考

- **SIEM 事件**:CEF(Common Event Format)扩展字段风格,含 `deviceVendor / deviceProduct / deviceVersion / signatureId / name / severity / src / dst / request / extension`
- **SBOM 组件**:CycloneDX 1.5 字段,含 `bom-ref / type / name / version / purl / licenses / vulnerabilities`
- **漏洞**:CVE 5.0 + EPSS 评分 + CISA KEV 三段式,含 `cve_id / cvss_v3 / epss_score / kev_listed / affected_products / fix_versions`
- **威胁情报**:STIX 2.1 风格,含 `type / id / created / modified / name / pattern / valid_from / labels / confidence`
- **通知消息**:Markdown + 卡片,支持 `@` mention 与按钮回调
