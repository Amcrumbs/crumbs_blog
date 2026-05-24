HOST ?= 127.0.0.1
PORT ?= 7000

.PHONY: start restart stop clean-dev-cache

start: stop clean-dev-cache
	npm run dev -- --turbo --hostname $(HOST) --port $(PORT)

stop:
ifeq ($(OS),Windows_NT)
	powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/stop-dev.ps1 -Port $(PORT)
else
	./scripts/stop-dev.sh $(PORT)
endif

clean-dev-cache:
ifeq ($(OS),Windows_NT)
	powershell.exe -NoProfile -Command "if (Test-Path -LiteralPath '.next\trace') { Remove-Item -LiteralPath '.next\trace' -Force -ErrorAction SilentlyContinue }; exit 0"
else
	rm -f .next/trace
endif

restart: stop start
