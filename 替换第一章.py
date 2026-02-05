#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
替换第一章的数据
使用单章节导出的 JSON 替换默认数据中的第一章
"""

import json
import os
import re

def main():
    print("=" * 40)
    print("  替换第一章数据")
    print("=" * 40)
    print()
    
    # 读取单章节 JSON
    print("[1/5] 读取单章节 JSON...")
    chapter_file = "笔记-我画的第一只羊-2026-02-05.json"
    
    if not os.path.exists(chapter_file):
        print(f"错误：找不到 {chapter_file} 文件！")
        input("按回车键退出...")
        return
    
    with open(chapter_file, 'r', encoding='utf-8') as f:
        chapter_data = json.load(f)
    
    # 读取完整笔记本 JSON
    print()
    print("[2/5] 读取完整笔记本 JSON...")
    full_file = "笔记-2026-02-05 (3).json"
    
    with open(full_file, 'r', encoding='utf-8') as f:
        full_data = json.load(f)
    
    # 替换第一章
    print()
    print("[3/5] 替换第一章数据...")
    chapters = full_data.get('chapters', {}).get('1', [])
    
    if len(chapters) > 0:
        # 保留原章节的 ID，只替换内容
        new_chapter = chapter_data['chapter']
        chapters[0] = new_chapter
        print(f"  已替换第一章: {new_chapter['title']}")
    else:
        print("  错误：没有找到章节数据")
        input("按回车键退出...")
        return
    
    # 提取单章节的装饰数据
    print()
    print("[4/5] 提取装饰数据...")
    chapter_annotations = {}
    
    # 从单章节 JSON 中提取 annotations
    if 'annotations' in chapter_data:
        for key, value in chapter_data['annotations'].items():
            # 键名已经是 annotations_0_0 格式，直接使用
            if isinstance(value, str):
                try:
                    chapter_annotations[key] = json.loads(value)
                except:
                    chapter_annotations[key] = value
            else:
                chapter_annotations[key] = value
            print(f"  提取: {key}")
    
    # 清理完整数据中的 annotations
    print()
    print("[5/5] 合并装饰数据...")
    annotations = full_data.get('annotations', {})
    cleaned_annotations = {}
    
    # 保留其他章节的装饰数据（索引 1, 2, 3）
    for key, value in annotations.items():
        if re.match(r'^annotations_[1-3]_\d+$', key):
            if isinstance(value, str):
                try:
                    cleaned_annotations[key] = json.loads(value)
                except:
                    cleaned_annotations[key] = value
            else:
                cleaned_annotations[key] = value
            print(f"  保留: {key}")
    
    # 添加第一章的新装饰数据
    for key, value in chapter_annotations.items():
        cleaned_annotations[key] = value
        print(f"  添加: {key}")
    
    # 生成新的 sampleData.js
    print()
    print("生成新的 sampleData.js...")
    
    js_content = f"""// ===== 示例数据模块 =====
// 使用用户的小王子笔记作为默认数据

const SampleData = {{
    // 小王子示例章节（用户真实数据）
    getLittlePrinceChapters() {{
        return {json.dumps(chapters, ensure_ascii=False, indent=8)};
    }},

    // 获取示例页面的装饰组件数据
    getLittlePrinceAnnotations() {{
        return {json.dumps(cleaned_annotations, ensure_ascii=False, indent=8)};
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
    print("  替换完成！")
    print("=" * 40)
    print()
    print("已完成以下操作：")
    print("1. 替换了第一章的内容")
    print("2. 更新了第一章的装饰数据")
    print("3. 保留了其他章节的数据")
    print()
    print("现在需要：")
    print("1. 打开 清除旧数据.html 清除缓存")
    print("2. 打开 index.html 测试")
    print()
    input("按回车键退出...")

if __name__ == '__main__':
    main()
