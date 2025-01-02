@echo off
REM Change to the project directory
cd /d C:\Users\Muhammad Najam\OneDrive\Desktop\AMZ_ST_new\ARMS-INVENTORY\armz-steel-ims

REM Start the Next.js development server in a new terminal window
start cmd /k "npm install && npm run dev"

REM Wait for 15 seconds before opening the browser
timeout /t 15 /nobreak > nul

REM Open the default web browser with the Next.js app URL
start http://localhost:3000
