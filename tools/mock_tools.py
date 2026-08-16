"""AegisTeam Adaptive mock tool gateway tools.

AegisTeam 自适应安全运营平台的 HTTP mock 工具网关实现。
参考 baseline 模式,但工具集针对安全运营场景重新设计。

6 类 MCP 工具:
  1. mock_cmdb          - 资产管理(get_asset / list_assets)
  2. mock_sbom          - 软件物料清单(get_components / scan_vulnerabilities)
  3. mock_siem          - 安全信息与事件管理(search_events / get_alert)
  4. mock_vuln_scanner  - 漏洞扫描(scan_target / get_cve_info)
  5. mock_threat_intel  - 威胁情报(query_ioc / lookup_malware)
  6. mock_notify        - 通知通道(send_message / list_channels)

数据格式参考真实产品:
  - SIEM 事件采用 CEF(Common Event Format)扩展字段风格
  - SBOM 组件采用 CycloneDX 1.5 字段风格
  - 漏洞采用 CVE 5.0 + EPSS + CISA KEV 三段式
  - 威胁情报采用 STIX 2.1 风格
  - 通知通道支持钉钉/企微/飞书/SMTP

初赛 demo 使用 HTTP mock,后续可平滑替换为:
  - Higress MCP 代理
  - 真实 MCP Server(cmdb-mcp / siem-mcp / vuln-mcp / ti-mcp)
  - 阿里云/奇安信/微步在线等真实安全 SaaS API
"""
from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional


PROJECT_ROOT = Path(__file__).resolve().parents[1]
SCENARIO_DIR = PROJECT_ROOT / "scenarios"


def load_json(path: Path) -> Dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def list_scenarios() -> List[str]:
    return sorted(path.stem for path in SCENARIO_DIR.glob("*.json"))


def load_scenario(scenario_id: str) -> Dict[str, Any]:
    path = SCENARIO_DIR / f"{scenario_id}.json"
    if not path.exists():
        available = ", ".join(list_scenarios())
        raise ValueError(f"Unknown scenario '{scenario_id}'. Available: {available}")
    return load_json(path)


def compact(value: Any, max_len: int = 200) -> str:
    text = json.dumps(value, ensure_ascii=False, sort_keys=True)
    return text if len(text) <= max_len else text[: max_len - 3] + "..."


def max_severity(alerts: Iterable[Dict[str, Any]]) -> str:
    order = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3, "INFO": 4}
    severities = [alert.get("severity", "INFO") for alert in alerts]
    return min(severities, key=lambda item: order.get(item, 99), default="INFO")


class BaseMockTools:
    """所有场景的 mock 工具基类。记录 trace 与 actions,便于复盘。"""

    def __init__(self, scenario_id: str) -> None:
        self.scenario_id = scenario_id
        self.actions: List[Dict[str, Any]] = []
        self.trace: List[Dict[str, Any]] = []

    def _record(self, tool: str, args: Dict[str, Any], result: Any) -> Any:
        self.trace.append(
            {
                "time": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
                "tool": tool,
                "args": args,
                "result_preview": compact(result),
            }
        )
        return result

    def reset(self) -> None:
        self.actions.clear()
        self.trace.clear()

    # ---- mock_cmdb ----
    def get_asset(self, asset_id: str) -> Dict[str, Any]:
        raise NotImplementedError

    def list_assets(self, filter: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        raise NotImplementedError

    # ---- mock_sbom ----
    def get_components(self, asset_id: str) -> List[Dict[str, Any]]:
        raise NotImplementedError

    def scan_vulnerabilities(self, asset_id: str) -> List[Dict[str, Any]]:
        raise NotImplementedError

    # ---- mock_siem ----
    def search_events(self, query: Optional[str] = None, time_range: Optional[Dict[str, str]] = None) -> List[Dict[str, Any]]:
        raise NotImplementedError

    def get_alert(self, alert_id: str) -> Dict[str, Any]:
        raise NotImplementedError

    # ---- mock_vuln_scanner ----
    def scan_target(self, target: str, scan_type: str = "full") -> Dict[str, Any]:
        raise NotImplementedError

    def get_cve_info(self, cve_id: str) -> Dict[str, Any]:
        raise NotImplementedError

    # ---- mock_threat_intel ----
    def query_ioc(self, ioc_type: str, value: str) -> Dict[str, Any]:
        raise NotImplementedError

    def lookup_malware(self, family: str) -> Dict[str, Any]:
        raise NotImplementedError

    # ---- mock_notify ----
    def send_message(self, channel: str, target: str, message: Dict[str, Any]) -> Dict[str, Any]:
        raise NotImplementedError

    def list_channels(self) -> List[Dict[str, Any]]:
        raise NotImplementedError


class AegisLocalMockTools(BaseMockTools):
    """从 scenario JSON 加载的 mock 工具实现。"""

    def __init__(self, scenario_id: str) -> None:
        super().__init__(scenario_id)
        self.scenario = load_scenario(scenario_id)

    def _scenario(self, key: str, default: Any) -> Any:
        return self.scenario.get(key, default)

    # ---------- CMDB ----------
    def get_asset(self, asset_id: str) -> Dict[str, Any]:
        for asset in self._scenario("assets", []):
            if asset.get("id") == asset_id:
                return self._record("mock_cmdb.get_asset", {"asset_id": asset_id}, asset)
        available = [a.get("id") for a in self._scenario("assets", [])]
        result = {"error": f"asset {asset_id} not found", "available": available}
        return self._record("mock_cmdb.get_asset", {"asset_id": asset_id}, result)

    def list_assets(self, filter: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        assets = self._scenario("assets", [])
        if filter:
            for k, v in filter.items():
                assets = [a for a in assets if a.get(k) == v]
        return self._record("mock_cmdb.list_assets", {"filter": filter or {}}, assets)

    # ---------- SBOM ----------
    def get_components(self, asset_id: str) -> List[Dict[str, Any]]:
        sboms = self._scenario("sboms", {})
        components = sboms.get(asset_id, [])
        return self._record("mock_sbom.get_components", {"asset_id": asset_id}, components)

    def scan_vulnerabilities(self, asset_id: str) -> List[Dict[str, Any]]:
        # 从场景预置的"vulnerabilities"中筛该资产相关的
        vulns = self._scenario("vulnerabilities", [])
        related = [v for v in vulns if asset_id in v.get("affected_assets", [])]
        return self._record("mock_sbom.scan_vulnerabilities", {"asset_id": asset_id}, related)

    # ---------- SIEM ----------
    def search_events(self, query: Optional[str] = None, time_range: Optional[Dict[str, str]] = None) -> List[Dict[str, Any]]:
        events = self._scenario("events", [])
        if query:
            q = query.lower()
            events = [e for e in events if q in json.dumps(e, ensure_ascii=False).lower()]
        return self._record("mock_siem.search_events", {"query": query, "time_range": time_range}, events)

    def get_alert(self, alert_id: str) -> Dict[str, Any]:
        for alert in self._scenario("alerts", []):
            if alert.get("id") == alert_id:
                return self._record("mock_siem.get_alert", {"alert_id": alert_id}, alert)
        return self._record("mock_siem.get_alert", {"alert_id": alert_id}, {"error": f"alert {alert_id} not found"})

    # ---------- Vuln Scanner ----------
    def scan_target(self, target: str, scan_type: str = "full") -> Dict[str, Any]:
        # 直接返回场景中的 scan_result
        scans = self._scenario("scan_results", {})
        result = scans.get(target, {"target": target, "vulnerabilities": [], "message": "no scan result for this target"})
        result["scan_type"] = scan_type
        return self._record("mock_vuln_scanner.scan_target", {"target": target, "scan_type": scan_type}, result)

    def get_cve_info(self, cve_id: str) -> Dict[str, Any]:
        cves = self._scenario("cve_database", {})
        info = cves.get(cve_id)
        if not info:
            return self._record("mock_vuln_scanner.get_cve_info", {"cve_id": cve_id}, {"error": f"CVE {cve_id} not in mock DB"})
        return self._record("mock_vuln_scanner.get_cve_info", {"cve_id": cve_id}, info)

    # ---------- Threat Intel ----------
    def query_ioc(self, ioc_type: str, value: str) -> Dict[str, Any]:
        iocs = self._scenario("iocs", [])
        for ioc in iocs:
            if ioc.get("type") == ioc_type and ioc.get("value") == value:
                return self._record("mock_threat_intel.query_ioc", {"ioc_type": ioc_type, "value": value}, ioc)
        # 默认返回未知 IOC
        return self._record(
            "mock_threat_intel.query_ioc",
            {"ioc_type": ioc_type, "value": value},
            {"type": ioc_type, "value": value, "verdict": "unknown", "confidence": 0.0, "source": "mock_ti"},
        )

    def lookup_malware(self, family: str) -> Dict[str, Any]:
        malwares = self._scenario("malware_db", {})
        info = malwares.get(family)
        if not info:
            return self._record("mock_threat_intel.lookup_malware", {"family": family}, {"error": f"malware family {family} not in mock DB"})
        return self._record("mock_threat_intel.lookup_malware", {"family": family}, info)

    # ---------- Notify ----------
    def send_message(self, channel: str, target: str, message: Dict[str, Any]) -> Dict[str, Any]:
        result = {
            "status": "delivered",
            "channel": channel,
            "target": target,
            "message_id": f"MSG-{int(time.time() * 1000)}",
            "preview": compact(message, 120),
            "delivered_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        }
        self.actions.append({"action": "notify_send", "channel": channel, "target": target})
        return self._record("mock_notify.send_message", {"channel": channel, "target": target, "message": message}, result)

    def list_channels(self) -> List[Dict[str, Any]]:
        channels = self._scenario("notify_channels", [
            {"id": "dingtalk-default", "type": "dingtalk", "enabled": True},
            {"id": "wecom-default", "type": "wecom", "enabled": True},
            {"id": "feishu-default", "type": "feishu", "enabled": False},
            {"id": "smtp-default", "type": "smtp", "enabled": True},
        ])
        return self._record("mock_notify.list_channels", {}, channels)


def make_tools(scenario_id: str) -> BaseMockTools:
    """工厂:目前所有场景共用 AegisLocalMockTools。"""
    return AegisLocalMockTools(scenario_id)
