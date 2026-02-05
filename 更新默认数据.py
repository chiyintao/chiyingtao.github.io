#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
更新笔记应用默认数据
使用用户的小王子笔记替换示例数据
"""

import json
import os

def main():
    print("=" * 40)
    print("  更新笔记应用默认数据")
    print("=" * 40)
    print()
    
    # 读取用户笔记数据
    print("[1/3] 读取用户笔记数据...")
    json_file = "笔记-2026-02-05 (3).json"
    
    if not os.path.exists(json_file):
        print(f"错误：找不到 {json_file} 文件！")
        input("按回车键退出...")
        return
    
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 生成新的 sampleData.js
    print()
    print("[2/3] 生成新的 sampleData.js...")
    
    chapters = data.get('chapters', {}).get('1', [])
    annotations_raw = data.get('annotations', {})
    
    # 解析annotations中的JSON字符串
    annotations = {}
    for key, value in annotations_raw.items():
        if isinstance(value, str):
            try:
                annotations[key] = json.loads(value)
            except:
                annotations[key] = value
        else:
            annotations[key] = value
    
    js_content = f"""// ===== 示例数据模块 =====
// 使用用户的小王子笔记作为默认数据

const SampleData = {{
    // 小王子示例章节（用户真实数据）
    getLittlePrinceChapters() {{
        return {json.dumps(chapters, ensure_ascii=False, indent=8)};
    }},

    // 获取示例页面的装饰组件数据
    getLittlePrinceAnnotations() {{
        return {json.dumps(annotations, ensure_ascii=False, indent=8)};
    }},

    // 窗边的小豆豆已删除
    getTotoChapters() {{
        return [];
    }},

    getTotoAnnotations() {{
        return {{}};
    }}
}};

// 导出模块
if (typeof module !== "undefined" && module.exports) {{
    module.exports = SampleData;
}}
"""
    
    # 写入文件
    output_file = os.path.join('js', 'sampleData.js')
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print()
    print("[3/3] 更新完成！")
    print()
    print("=" * 40)
    print("  更新成功！")
    print("=" * 40)
    print()
    print("已完成以下更新：")
    print("1. 使用你的小王子笔记作为默认数据")
    print("2. 删除窗边的小豆豆笔记")
    print("3. 保留所有装饰组件和图片")
    print()
    print("现在可以：")
    print("1. 打开 index.html 测试")
    print("2. 运行 一键部署到GitHub.bat 上传到网站")
    print()
    input("按回车键退出...")

if __name__ == '__main__':
    main()
