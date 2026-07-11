@echo off
title Atrium Digital Museum - Dev Server
echo ==================================================
echo      ATRIUM DIGITAL MUSEUM - LOCAL DEV SERVER
echo ==================================================
echo.
echo [1/3] Dong bo hoa cau truc database toi Neon...
call bun run db:push
if %ERRORLEVEL% neq 0 (
    echo [Loi] Khong the ket noi toi database. Vui lau kiem tra lai mang va file .env!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] Tu dong mo trinh duyet...
start http://localhost:3000

echo.
echo [3/3] Dang khoi chay Next.js dev server tren port 3000...
echo Nhan Ctrl+C de dung server.
call bun run next dev -p 3000
pause
