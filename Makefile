HOST ?= 127.0.0.1
PORT ?= 3001

.PHONY: start restart stop

start:
	npm.cmd run dev -- --hostname $(HOST) --port $(PORT)

stop:
	powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/stop-dev.ps1 -Port $(PORT)

restart: stop start
