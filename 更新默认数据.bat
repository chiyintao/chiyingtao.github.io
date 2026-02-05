@echo off
chcp 65001 >nul
echo ========================================
echo   更新笔记应用默认数据
echo ========================================
echo.

echo [1/3] 读取用户笔记数据...
if not exist "笔记-2026-02-05 (3).json" (
    echo 错误：找不到 笔记-2026-02-05 (3).json 文件！
    pause
    exit /b 1
)

echo.
echo [2/3] 生成新的 sampleData.js...
node -e "const fs=require('fs');const data=JSON.parse(fs.readFileSync('笔记-2026-02-05 (3).json','utf8'));const js='// ===== 示例数据模块 =====\n// 使用用户的小王子笔记作为默认数据\n\nconst SampleData = {\n    // 小王子示例章节（用户真实数据）\n    getLittlePrinceChapters() {\n        return '+JSON.stringify(data.chapters['1'],null,8).replace(/^/gm,'        ')+';\n    },\n\n    // 获取示例页面的装饰组件数据\n    getLittlePrinceAnnotations() {\n        return '+JSON.stringify(data.annotations,null,8).replace(/^/gm,'        ')+';\n    },\n\n    // 窗边的小豆豆已删除\n    getTotoChapters() {\n        return [];\n    },\n\n    getTotoAnnotations() {\n        return {};\n    }\n};\n\n// 导出模块\nif (typeof module !== \"undefined\" && module.exports) {\n    module.exports = SampleData;\n}';fs.writeFileSync('js/sampleData.js',js,'utf8');"

if errorlevel 1 (
    echo 错误：生成失败！请确保已安装 Node.js
    echo 你可以手动修改 js/sampleData.js 文件
    pause
    exit /b 1
)

echo.
echo [3/3] 更新完成！
echo.
echo ========================================
echo   更新成功！
echo ========================================
echo.
echo 已完成以下更新：
echo 1. 使用你的小王子笔记作为默认数据
echo 2. 删除窗边的小豆豆笔记
echo 3. 保留所有装饰组件和图片
echo.
echo 现在可以：
echo 1. 打开 index.html 测试
echo 2. 运行 一键部署到GitHub.bat 上传到网站
echo.
pause
