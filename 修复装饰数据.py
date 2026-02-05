#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复装饰数据的键名
删除所有 annotations_NaN_* 的错误键名，只保留正确的 annotations_数字_数字 格式
"""

import json
import os
import re

def main():
    print("=" * 40)
    print("  修复装饰数据键名")
    print("=" * 40)
    print()
    
    # 读取原始 JSON
    print("[1/4] 读取原始 JSON...")
    json_file = "笔记-2026-02-05 (3).json"
    
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 清理 annotations
    print()
    print("[2/4] 清理错误的 annotations 键名...")
    annotations = data.get('annotations', {})
    cleaned_annotations = {}
    
    for key, value in annotations.items():
        # 只保留格式正确的键名（annotations_数字_数字）
        if re.match(r'^annotations_\d+_\d+$', key):
            cleaned_annotations[key] = value
            print(f"  保留: {key}")
        else:
            print(f"  删除: {key}")
    
    # 解析 annotations 中的 JSON 字符串
    print()
    print("[3/4] 解析 annotations 数据...")
    parsed_annotations = {}
    for key, value in cleaned_annotations.items():
        if isinstance(value, str):
            try:
                parsed_annotations[key] = json.loads(value)
            except:
                parsed_annotations[key] = value
        else:
            parsed_annotations[key] = value
    
    # 生成新的 sampleData.js
    print()
    print("[4/4] 生成新的 sampleData.js...")
    
    chapters = data.get('chapters', {}).get('1', [])
    
    js_content = f"""// ===== 示例数据模块 =====
// 使用用户的小王子笔记作为默认数据

const SampleData = {{
    // 小王子示例章节（用户真实数据）
    getLittlePrinceChapters() {{
        return {json.dumps(chapters, ensure_ascii=False, indent=8)};
    }},

    // 获取示例页面的装饰组件数据
    getLittlePrinceAnnotations() {{
        return {json.dumps(parsed_annotations, ensure_ascii=False, indent=8)};
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
    print("=" * 40)
    print("  修复完成！")
    print("=" * 40)
    print()
    print(f"已清理 {len(annotations) - len(cleaned_annotations)} 个错误的键名")
    print(f"保留 {len(cleaned_annotations)} 个正确的键名")
    print()
    print("现在可以打开 index.html 测试")
    print()
    input("按回车键退出...")

if __name__ == '__main__':
    main()
