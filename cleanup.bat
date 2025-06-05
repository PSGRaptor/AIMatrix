@echo off
REM AIMatrix: Clean, build, and run the Electron+Vite app

echo ===========================
echo 1. Deleting old build files
echo ===========================
rmdir /s /q dist
rmdir /s /q .vite
REM Delete JS files from renderer if present (rare)
for /r app\renderer %%f in (*.js) do del "%%f"

echo ===========================
echo 2. Rebuilding Electron main process
echo ===========================
npx tsc

echo ===========================
echo 3. Installing dependencies
echo ===========================
npm install

echo ===========================
echo 4. Starting development server and Electron
echo ===========================
npm run dev

pause
