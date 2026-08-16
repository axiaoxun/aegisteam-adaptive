FROM python:3.11-slim

WORKDIR /app

# 复制 mock 工具网关代码
COPY mock_tools.py mock_tool_server.py __init__.py /app/
COPY scenarios/ /app/scenarios/

EXPOSE 18090

# 健康检查
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://127.0.0.1:18090/health || exit 1

# 启动 mock 工具网关
CMD ["python3", "mock_tool_server.py", "--host", "0.0.0.0", "--port", "18090"]
