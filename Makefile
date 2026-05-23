HOST ?= 127.0.0.1
PORT ?= 7000

.PHONY: start restart stop clean-dev-cache

start: stop clean-dev-cache
	npm.cmd run dev -- --turbo --hostname $(HOST) --port $(PORT)

stop:
	powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/stop-dev.ps1 -Port $(PORT)

clean-dev-cache:
	powershell.exe -NoProfile -Command "if (Test-Path -LiteralPath '.next\trace') { Remove-Item -LiteralPath '.next\trace' -Force -ErrorAction SilentlyContinue }; exit 0"

restart: stop start
