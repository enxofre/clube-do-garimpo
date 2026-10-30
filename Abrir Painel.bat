@echo off
cd /d "%~dp0"
echo Abrindo o painel do Clube do Garimpo... (feche esta janela para encerrar)
start "" http://127.0.0.1:4173
node tools\panel.mjs
pause
