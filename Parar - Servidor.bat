@echo off
chcp 65001 >nul
echo Encerrando servidor local do prototipo Fred Cabeleireiros (porta 3000)...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }"
echo Servidor encerrado. Os dados temporarios da sessao foram limpos.
timeout /t 2 >nul
