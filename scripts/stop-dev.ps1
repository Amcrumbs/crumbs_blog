param(
  [int]$Port = 3001
)

$ErrorActionPreference = "SilentlyContinue"

$connections = Get-NetTCPConnection -LocalPort $Port
$processIds = $connections | Select-Object -ExpandProperty OwningProcess -Unique

foreach ($processId in $processIds) {
  if ($processId -and $processId -ne $PID) {
    Stop-Process -Id $processId -Force
  }
}

Write-Host "Stopped dev server processes on port $Port."
