@echo off
chcp 65001 >nul
echo 正在修复中文乱码...

powershell -Command "$content = Get-Content 'little-prince-journal-modular.html' -Raw -Encoding UTF8; $content = $content -replace 'TOOLS', '工具'; $content = $content -replace 'title=\"渚跨\"', 'title=\"便签\"'; $content = $content -replace 'title=\"鍥剧墖\"', 'title=\"图片\"'; $content = $content -replace 'title=\"绠ご\"', 'title=\"箭头\"'; $content = $content -replace 'title=\"鏂囧瓧妗?\"', 'title=\"文字框\"'; $content = $content -replace '<!-- 鍏ㄥ睆鎸夐挳 -->', '<!-- 全屏按钮 -->'; $content = $content -replace 'title=\"鍏ㄥ睆棰勮\"', 'title=\"全屏预览\"'; [System.IO.File]::WriteAllText('little-prince-journal-modular.html', $content, [System.Text.Encoding]::UTF8)"

echo 修复完成！
pause
