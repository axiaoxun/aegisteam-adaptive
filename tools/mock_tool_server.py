from __future__ import annotations

import argparse
import json
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any, Callable, Dict
from urllib.parse import unquote, urlparse

from mock_tools import make_tools, list_scenarios


TOOL_STATES: Dict[str, Any] = {}


def get_state(scenario_id: str):
    if scenario_id not in TOOL_STATES:
        TOOL_STATES[scenario_id] = make_tools(scenario_id)
    return TOOL_STATES[scenario_id]


def reset_state(scenario_id: str) -> Dict[str, Any]:
    TOOL_STATES[scenario_id] = make_tools(scenario_id)
    return {"scenario_id": scenario_id, "status": "reset"}


def call_tool(tools, name: str, payload: Dict[str, Any]) -> Any:
    """统一调度:工具名.函数名 → 实际方法。

    协议:POST /tools/{scenario_id}/{tool_name}.{function_name}
    body 为 JSON 参数对象。
    """
    handlers: Dict[str, Callable[[], Any]] = {
        # CMDB
        "mock_cmdb.get_asset": lambda: tools.get_asset(payload["asset_id"]),
        "mock_cmdb.list_assets": lambda: tools.list_assets(payload.get("filter")),
        # SBOM
        "mock_sbom.get_components": lambda: tools.get_components(payload["asset_id"]),
        "mock_sbom.scan_vulnerabilities": lambda: tools.scan_vulnerabilities(payload["asset_id"]),
        # SIEM
        "mock_siem.search_events": lambda: tools.search_events(payload.get("query"), payload.get("time_range")),
        "mock_siem.get_alert": lambda: tools.get_alert(payload["alert_id"]),
        # Vuln Scanner
        "mock_vuln_scanner.scan_target": lambda: tools.scan_target(payload["target"], payload.get("scan_type", "full")),
        "mock_vuln_scanner.get_cve_info": lambda: tools.get_cve_info(payload["cve_id"]),
        # Threat Intel
        "mock_threat_intel.query_ioc": lambda: tools.query_ioc(payload["ioc_type"], payload["value"]),
        "mock_threat_intel.lookup_malware": lambda: tools.lookup_malware(payload["family"]),
        # Notify
        "mock_notify.send_message": lambda: tools.send_message(payload["channel"], payload["target"], payload["message"]),
        "mock_notify.list_channels": lambda: tools.list_channels(),
    }
    if name not in handlers:
        available = ", ".join(sorted(handlers))
        raise ValueError(f"unknown tool call '{name}', available: {available}")
    return handlers[name]()


class AegisMockToolHandler(BaseHTTPRequestHandler):
    server_version = "AegisTeamMockToolGateway/0.1"

    def _send(self, status: HTTPStatus, payload: Dict[str, Any]) -> None:
        body = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self) -> Dict[str, Any]:
        length = int(self.headers.get("Content-Length", "0"))
        if length == 0:
            return {}
        raw = self.rfile.read(length).decode("utf-8")
        return json.loads(raw) if raw.strip() else {}

    def do_OPTIONS(self) -> None:
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        parts = [unquote(part) for part in parsed.path.strip("/").split("/") if part]
        try:
            if parts == ["health"]:
                self._send(HTTPStatus.OK, {
                    "ok": True,
                    "service": "aegisteam-mock-tool-gateway",
                    "version": "0.1.0",
                    "tools_count": 12,
                })
                return
            if parts == ["scenarios"]:
                self._send(HTTPStatus.OK, {"ok": True, "result": list_scenarios()})
                return
            if len(parts) == 3 and parts[0] == "tools" and parts[2] == "trace":
                tools = get_state(parts[1])
                self._send(HTTPStatus.OK, {"ok": True, "result": tools.trace})
                return
            if len(parts) == 3 and parts[0] == "tools" and parts[2] == "actions":
                tools = get_state(parts[1])
                self._send(HTTPStatus.OK, {"ok": True, "result": tools.actions})
                return
            if len(parts) == 1 and parts[0] == "tools":
                # 返回所有工具的元信息
                self._send(HTTPStatus.OK, {
                    "ok": True,
                    "protocol": "POST /tools/{scenario_id}/{tool_name}.{function_name}",
                    "tools": [
                        {"name": "mock_cmdb", "functions": ["get_asset", "list_assets"]},
                        {"name": "mock_sbom", "functions": ["get_components", "scan_vulnerabilities"]},
                        {"name": "mock_siem", "functions": ["search_events", "get_alert"]},
                        {"name": "mock_vuln_scanner", "functions": ["scan_target", "get_cve_info"]},
                        {"name": "mock_threat_intel", "functions": ["query_ioc", "lookup_malware"]},
                        {"name": "mock_notify", "functions": ["send_message", "list_channels"]},
                    ],
                })
                return
            self._send(HTTPStatus.NOT_FOUND, {"ok": False, "error": "unknown endpoint"})
        except Exception as exc:
            self._send(HTTPStatus.BAD_REQUEST, {"ok": False, "error": str(exc)})

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        parts = [unquote(part) for part in parsed.path.strip("/").split("/") if part]
        try:
            if len(parts) != 3 or parts[0] != "tools":
                self._send(HTTPStatus.NOT_FOUND, {"ok": False, "error": "expected /tools/{scenario_id}/{tool_call}"})
                return
            scenario_id, tool_call = parts[1], parts[2]
            payload = self._read_json()
            if tool_call == "reset":
                result = reset_state(scenario_id)
            else:
                result = call_tool(get_state(scenario_id), tool_call, payload)
            self._send(HTTPStatus.OK, {"ok": True, "result": result})
        except Exception as exc:
            self._send(HTTPStatus.BAD_REQUEST, {"ok": False, "error": str(exc)})

    def log_message(self, fmt: str, *args: Any) -> None:
        # 简化输出,避免评审机器日志洪水
        print(f"[{time_str()}] {self.address_string()} - {fmt % args}")


def time_str() -> str:
    import time
    return time.strftime("%H:%M:%S")


def main() -> None:
    parser = argparse.ArgumentParser(description="Run AegisTeam Adaptive HTTP mock tool gateway.")
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", default=18090, type=int, help="default 18090 (baseline uses 18089)")
    args = parser.parse_args()

    server = ThreadingHTTPServer((args.host, args.port), AegisMockToolHandler)
    print(f"===============================================")
    print(f"  AegisTeam Adaptive Mock Tool Gateway")
    print(f"  Listening on http://{args.host}:{args.port}")
    print(f"===============================================")
    print(f"Health:        GET  /health")
    print(f"Scenarios:     GET  /scenarios")
    print(f"Tool call:     POST /tools/{{scenario_id}}/{{tool_name}}.{{function_name}}")
    print(f"Trace:         GET  /tools/{{scenario_id}}/trace")
    print(f"Available:     {len(list_scenarios())} scenarios: {', '.join(list_scenarios()) or '(none yet)'}")
    print(f"===============================================")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down...")


if __name__ == "__main__":
    main()
