@echo off
chcp 65001 >nul
echo ========================================
echo   部署笔记应用到 GitHub Pages
echo ========================================
echo.

echo [1/5] 初始化 Git 仓库...
git init
if errorlevel 1 (
    echo 错误：Git 初始化失败！请确保已安装 Git。
    pause
    exit /b 1
)

echo.
echo [2/5] 添加所有文件...
git add .
if errorlevel 1 (
    echo 错误：添加文件失败！
    pause
    exit /b 1
)

echo.
echo [3/5] 创建首次提交...
git commit -m "Initial commit: 手写风格笔记应用"
if errorlevel 1 (
    echo 错误：提交失败！
    pause
    exit /b 1
)

echo.
echo [4/5] 设置主分支名称...
git branch -M main

echo.
echo [5/5] 关联远程仓库并推送...
git remote add origin https://github.com/chiyintao/notebook-app.git
git push -u origin main

echo.
echo ========================================
echo   部署完成！
echo ========================================
echo.
echo 接下来请按照以下步骤启用 GitHub Pages：
echo.
echo 1. 访问 https://github.com/chiyintao/notebook-app/settings/pages
echo 2. 在 "Source" 下选择 "Deploy from a branch"
echo 3. 在 "Branch" 下选择 "main" 和 "/ (root)"
echo 4. 点击 "Save"
echo 5. 等待几分钟后访问：https://chiyintao.github.io/notebook-app/
echo.
pause
