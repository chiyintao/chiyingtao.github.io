// ===== 主应用入口 =====
const App = {
    state: {
        currentNotebookId: 1,
        currentChapterIndex: 0,
        currentPageRelative: 0
    },

    notebooks: [],
    chapters: [],

    // 初始化应用
    init() {
        console.log('应用初始化...');
        
        // 加载笔记本
        this.notebooks = Storage.loadNotebooks();
        
        // 加载默认章节数据（如果没有）
        this.loadDefaultChaptersIfNeeded();
        
        // 加载当前笔记本的章节
        this.chapters = Storage.loadChapters(this.state.currentNotebookId);
        
        // 初始化模块
        DragManager.init();
        
        // 绑定事件
        this.bindEvents();
        
        // 渲染初始内容
        this.renderNotebookList();
        this.renderChapterList();
        if (this.chapters.length > 0) {
            this.loadChapter(0);
        }
        this.setupAutoSave();
        
        console.log('应用初始化完成');
    },

    // 加载默认章节（如果需要）
    loadDefaultChaptersIfNeeded() {
        // 小王子笔记本
        const chapters1 = Storage.loadChapters(1);
        if (chapters1.length === 0) {
            const defaultChapters = SampleData.getLittlePrinceChapters();
            Storage.saveChapters(1, defaultChapters);
            
            // 保存示例装饰组件
            const annotations = SampleData.getLittlePrinceAnnotations();
            Object.keys(annotations).forEach(key => {
                // 键名格式: annotations_0_0
                const parts = key.split('_');
                const chapterIndex = parseInt(parts[1]);
                const pageIndex = parseInt(parts[2]);
                Storage.saveAnnotations(chapterIndex, pageIndex, annotations[key]);
            });
        }
    },

    // 绑定事件
    bindEvents() {
        // 监听组件变化事件
        window.addEventListener('annotationsChanged', () => {
            const data = AnnotationManager.collectAnnotationsData();
            Storage.saveAnnotations(this.state.currentChapterIndex, this.state.currentPageRelative, data);
        });
    },

    // 渲染笔记本列表
    renderNotebookList() {
        const container = document.querySelector('.sidebar-spine > div:nth-child(2)');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.notebooks.forEach(notebook => {
            const el = document.createElement('div');
            el.className = `notebook-item ${notebook.id === this.state.currentNotebookId ? 'active' : ''}`;
            el.style.position = 'relative';
            el.onclick = () => this.switchNotebook(notebook.id);
            el.oncontextmenu = (e) => {
                e.preventDefault();
                this.showNotebookContextMenu(e, notebook.id);
            };
            el.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                <span class="notebook-name">${notebook.name}</span>
                ${this.notebooks.length > 1 ? `
                <button onclick="event.stopPropagation(); App.deleteNotebook(${notebook.id})" 
                        style="position: absolute; right: 8px; width: 20px; height: 20px; border-radius: 4px; background: #ff6b6b; color: white; border: none; cursor: pointer; display: none; align-items: center; justify-content: center; font-size: 12px;"
                        class="delete-notebook-btn"
                        title="删除笔记本">×</button>
                ` : ''}
            `;
            
            // 鼠标悬停时显示删除按钮
            if (this.notebooks.length > 1) {
                el.onmouseenter = function() {
                    const btn = this.querySelector('.delete-notebook-btn');
                    if (btn) btn.style.display = 'flex';
                };
                el.onmouseleave = function() {
                    const btn = this.querySelector('.delete-notebook-btn');
                    if (btn) btn.style.display = 'none';
                };
            }
            
            container.appendChild(el);
        });
        
        // 添加"新建笔记本"按钮
        const addBtn = document.createElement('div');
        addBtn.className = 'notebook-item';
        addBtn.style.opacity = '0.6';
        addBtn.onclick = () => this.addNewNotebook();
        addBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            新建笔记本
        `;
        container.appendChild(addBtn);
    },

    // 切换笔记本
    switchNotebook(notebookId) {
        this.state.currentNotebookId = notebookId;
        this.state.currentChapterIndex = 0;
        this.state.currentPageRelative = 0;
        
        // 加载该笔记本的章节
        this.chapters = Storage.loadChapters(notebookId);
        if (this.chapters.length === 0) {
            this.chapters = [];
        }
        
        this.renderNotebookList();
        this.renderChapterList();
        
        if (this.chapters.length > 0) {
            this.loadChapter(0);
        } else {
            // 清空页面
            document.getElementById('pageContent').innerHTML = '<p class="handwritten-p">空笔记本。添加新章节开始使用。</p>';
            AnnotationManager.clearAll();
        }
    },

    // 添加新笔记本
    addNewNotebook() {
        const name = prompt('输入笔记本名称:', '新笔记本');
        if (name && name.trim()) {
            const newNotebook = {
                id: Date.now(),
                name: name.trim(),
                icon: '📖'
            };
            Storage.addNotebook(newNotebook);
            this.notebooks = Storage.loadNotebooks();
            this.renderNotebookList();
        }
    },

    // 删除笔记本
    deleteNotebook(id) {
        if (this.notebooks.length <= 1) {
            alert('至少需要保留一个笔记本！');
            return;
        }
        
        const notebook = this.notebooks.find(nb => nb.id === id);
        if (confirm(`确定要删除笔记本"${notebook.name}"吗？\n\n这将删除该笔记本下的所有章节和页面！`)) {
            Storage.deleteNotebook(id);
            this.notebooks = Storage.loadNotebooks();
            
            // 如果删除的是当前笔记本，切换到第一个
            if (this.state.currentNotebookId === id) {
                this.state.currentNotebookId = this.notebooks[0].id;
                this.state.currentChapterIndex = 0;
                this.state.currentPageRelative = 0;
                this.chapters = Storage.loadChapters(this.state.currentNotebookId);
                this.renderChapterList();
                if (this.chapters.length > 0) {
                    this.loadChapter(0);
                }
            }
            
            this.renderNotebookList();
        }
    },

    // 更新笔记本名称
    updateNotebookName(id, newName) {
        if (newName && newName.trim()) {
            Storage.updateNotebook(id, { name: newName.trim() });
            this.notebooks = Storage.loadNotebooks();
        } else {
            this.renderNotebookList();
        }
    },

    // 显示笔记本右键菜单
    showNotebookContextMenu(e, notebookId) {
        const newName = prompt('重命名笔记本:', this.notebooks.find(n => n.id === notebookId).name);
        if (newName && newName.trim()) {
            this.updateNotebookName(notebookId, newName.trim());
            this.renderNotebookList();
        }
    },

    // 渲染章节列表
    renderChapterList() {
        const chapterListEl = document.getElementById('chapterList');
        chapterListEl.innerHTML = '';
        
        this.chapters.forEach((chap, idx) => {
            const el = document.createElement('div');
            el.className = `chapter-card ${idx === this.state.currentChapterIndex ? 'active' : ''}`;
            el.style.position = 'relative';
            el.onclick = () => this.loadChapter(idx);
            el.oncontextmenu = (e) => {
                e.preventDefault();
                this.showChapterContextMenu(e, idx);
            };
            el.innerHTML = `
                <div class="chapter-title font-serif font-bold text-gray-800 text-lg">${chap.title}</div>
                ${this.chapters.length > 1 ? `
                <button onclick="event.stopPropagation(); App.deleteChapter(${idx})" 
                        style="position: absolute; top: 8px; right: 8px; width: 24px; height: 24px; border-radius: 4px; background: #ff6b6b; color: white; border: none; cursor: pointer; display: none; align-items: center; justify-content: center; font-size: 14px;"
                        class="delete-chapter-btn"
                        title="删除章节">×</button>
                ` : ''}
            `;
            
            // 鼠标悬停时显示删除按钮
            if (this.chapters.length > 1) {
                el.onmouseenter = function() {
                    const btn = this.querySelector('.delete-chapter-btn');
                    if (btn) btn.style.display = 'flex';
                };
                el.onmouseleave = function() {
                    const btn = this.querySelector('.delete-chapter-btn');
                    if (btn) btn.style.display = 'none';
                };
            }
            
            chapterListEl.appendChild(el);
        });
        
        // 添加"新建章节"按钮
        const addBtn = document.createElement('div');
        addBtn.className = 'chapter-card';
        addBtn.style.opacity = '0.6';
        addBtn.style.textAlign = 'center';
        addBtn.onclick = () => this.addNewChapter();
        addBtn.innerHTML = `
            <div class="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 8px;">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <div class="text-sm">添加新章节</div>
            </div>
        `;
        chapterListEl.appendChild(addBtn);
    },

    // 添加新章节
    addNewChapter() {
        const title = prompt('输入章节标题:', '新章节');
        if (title && title.trim()) {
            const newChapter = {
                id: Date.now(),
                title: title.trim(),
                subtitle: '副标题',
                date: new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }),
                pageCount: 1,
                content: ['<p class="handwritten-p">开始写作...</p>']
            };
            
            Storage.addChapter(this.state.currentNotebookId, newChapter);
            this.chapters = Storage.loadChapters(this.state.currentNotebookId);
            this.renderChapterList();
            
            // 自动切换到新章节
            this.loadChapter(this.chapters.length - 1);
        }
    },

    // 删除章节
    deleteChapter(index) {
        if (this.chapters.length <= 1) {
            alert('至少需要保留一个章节！');
            return;
        }
        
        const chapter = this.chapters[index];
        if (confirm(`确定要删除章节"${chapter.title}"吗？\n\n这将删除该章节下的所有页面！`)) {
            const chapterId = chapter.id;
            Storage.deleteChapter(this.state.currentNotebookId, chapterId);
            this.chapters = Storage.loadChapters(this.state.currentNotebookId);
            
            // 如果删除的是当前章节，切换到第一个
            if (this.state.currentChapterIndex === index) {
                this.state.currentChapterIndex = 0;
                this.state.currentPageRelative = 0;
                this.loadChapter(0);
            } else if (this.state.currentChapterIndex > index) {
                // 如果删除的章节在当前章节之前，调整索引
                this.state.currentChapterIndex--;
            }
            
            this.renderChapterList();
        }
    },

    // 更新章节标题
    updateChapterTitle(index, newTitle) {
        if (newTitle && newTitle.trim()) {
            this.chapters[index].title = newTitle.trim();
            Storage.saveChapters(this.state.currentNotebookId, this.chapters);
        } else {
            this.renderChapterList();
        }
    },

    // 显示章节右键菜单
    showChapterContextMenu(e, index) {
        const newTitle = prompt('重命名章节:', this.chapters[index].title);
        if (newTitle && newTitle.trim()) {
            this.updateChapterTitle(index, newTitle.trim());
            this.renderChapterList();
        }
    },

    // 加载章节
    loadChapter(index) {
        this.state.currentChapterIndex = index;
        this.state.currentPageRelative = 0;
        this.renderChapterList();
        this.renderPage();
    },

    // 渲染页面
    renderPage() {
        const chapter = this.chapters[this.state.currentChapterIndex];
        const content = chapter.content[this.state.currentPageRelative] || "<p>Empty Page</p>";
        
        const pageContentEl = document.getElementById('pageContent');
        const pageNumEl = document.getElementById('pageNum');
        
        // 加载保存的内容
        const savedContent = Storage.loadPageContent(this.state.currentChapterIndex, this.state.currentPageRelative);
        pageContentEl.innerHTML = savedContent || content;
        pageNumEl.innerText = `${this.state.currentChapterIndex + 1}.${this.state.currentPageRelative + 1}`;
        
        // 清除并加载组件
        AnnotationManager.clearAll();
        const annotationsData = Storage.loadAnnotations(this.state.currentChapterIndex, this.state.currentPageRelative);
        if (annotationsData.length > 0) {
            AnnotationManager.loadAnnotations(annotationsData);
        }
        
        // 更新页码信息
        this.updatePageInfo();
    },

    // 切换页面
    changePage(delta) {
        const chapter = this.chapters[this.state.currentChapterIndex];
        const newPage = this.state.currentPageRelative + delta;
        
        if (newPage >= 0 && newPage < chapter.pageCount) {
            this.state.currentPageRelative = newPage;
            this.renderPage();
        } else if (newPage < 0 && this.state.currentChapterIndex > 0) {
            this.state.currentChapterIndex--;
            this.state.currentPageRelative = this.chapters[this.state.currentChapterIndex].pageCount - 1;
            this.renderChapterList();
            this.renderPage();
        } else if (newPage >= chapter.pageCount && this.state.currentChapterIndex < this.chapters.length - 1) {
            this.state.currentChapterIndex++;
            this.state.currentPageRelative = 0;
            this.renderChapterList();
            this.renderPage();
        }
    },

    // 添加新页面
    addNewPage() {
        const chapter = this.chapters[this.state.currentChapterIndex];
        
        // 添加新页面内容
        if (!chapter.content) {
            chapter.content = [];
        }
        chapter.content.push('<p class="handwritten-p">New page...</p>');
        chapter.pageCount = chapter.content.length;
        
        // 保存章节
        Storage.saveChapters(this.state.currentNotebookId, this.chapters);
        
        // 切换到新页面
        this.state.currentPageRelative = chapter.pageCount - 1;
        this.renderPage();
        this.updatePageInfo();
    },

    // 删除当前页面
    deleteCurrentPage() {
        const chapter = this.chapters[this.state.currentChapterIndex];
        
        if (chapter.pageCount <= 1) {
            alert('不能删除最后一页！');
            return;
        }
        
        if (confirm('确定要删除这一页吗？')) {
            chapter.content.splice(this.state.currentPageRelative, 1);
            chapter.pageCount = chapter.content.length;
            
            // 调整当前页码
            if (this.state.currentPageRelative >= chapter.pageCount) {
                this.state.currentPageRelative = chapter.pageCount - 1;
            }
            
            // 保存章节
            Storage.saveChapters(this.state.currentNotebookId, this.chapters);
            
            this.renderPage();
            this.updatePageInfo();
        }
    },

    // 更新页码显示
    updatePageInfo() {
        const chapter = this.chapters[this.state.currentChapterIndex];
        const pageNumEl = document.getElementById('pageNum');
        if (pageNumEl) {
            pageNumEl.innerText = `${this.state.currentChapterIndex + 1}.${this.state.currentPageRelative + 1}`;
        }
        
        // 更新页数信息
        const pageInfoEl = document.getElementById('pageInfo');
        if (pageInfoEl) {
            pageInfoEl.innerText = `${this.state.currentPageRelative + 1} / ${chapter.pageCount}`;
        }
    },

    // 设置自动保存
    setupAutoSave() {
        const pageContentEl = document.getElementById('pageContent');
        let autoSaveTimer = null;
        
        pageContentEl.addEventListener('input', () => {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                const content = pageContentEl.innerHTML;
                Storage.savePageContent(this.state.currentChapterIndex, this.state.currentPageRelative, content);
            }, 1000);
        });
    },

    // 导出数据
    exportData() {
        try {
            const data = Storage.exportAllData();
            const jsonStr = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `笔记-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            alert('✅ 数据导出成功！');
        } catch (e) {
            console.error('导出失败:', e);
            alert('❌ 导出失败: ' + e.message);
        }
    },

    // 导入数据
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    // 确认导入
                    const message = `从 ${data.exportDate} 导入数据？\n\n` +
                                  `笔记本数量: ${data.notebooks.length}\n` +
                                  `这将替换所有现有数据！\n\n` +
                                  `是否继续？`;
                    
                    if (confirm(message)) {
                        Storage.importAllData(data);
                        alert('✅ 数据导入成功！\n\n正在重新加载页面...');
                        location.reload();
                    }
                } catch (e) {
                    console.error('导入失败:', e);
                    alert('❌ 导入失败: ' + e.message);
                }
            };
            
            reader.onerror = () => {
                alert('❌ 文件读取失败');
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    },

    // 清空所有数据
    clearAllData() {
        const message = '⚠️ 警告！\n\n' +
                      '这将删除所有数据：\n' +
                      '- 所有笔记本\n' +
                      '- 所有章节\n' +
                      '- 所有页面\n' +
                      '- 所有组件\n\n' +
                      '此操作无法撤销！\n\n' +
                      '输入"删除"确认:';
        
        const confirmation = prompt(message);
        if (confirmation === '删除') {
            Storage.clearAllData();
            alert('✅ 所有数据已清空！\n\n正在重新加载页面...');
            location.reload();
        } else {
            alert('❌ 已取消');
        }
    }
};

// 工具函数
function addStickyNote() {
    const content = '<div contenteditable="true" style="width:100%; height:100%; outline:none; line-height:1.6;">便签内容...</div>';
    AnnotationManager.createDraggableElement(150 + Math.random() * 100, 150 + Math.random() * 100, 'sticker-note', content);
}

function addTextBox() {
    const content = '<div contenteditable="true" style="width:100%; height:100%; outline:none; line-height:1.6;">输入文字...</div>';
    AnnotationManager.createDraggableElement(200, 200, 'sticker-textbox', content);
}

function addArrow() {
    const id = Date.now();
    const svg = `<svg width="100%" height="100%" viewBox="0 0 150 80" style="overflow:visible">
        <defs>
            <marker id="arrowhead${id}" markerWidth="12" markerHeight="10" refX="11" refY="5" orient="auto">
                <polygon points="0 0, 12 5, 0 10" fill="var(--neon-orange)" />
            </marker>
        </defs>
        <path d="M10,40 Q80,10 140,40" fill="none" stroke="var(--neon-orange)" stroke-width="2.5" stroke-dasharray="5,3" marker-end="url(#arrowhead${id})"/>
    </svg>`;
    AnnotationManager.createDraggableElement(250, 250, 'sticker-arrow', svg);
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const sizeInKB = file.size / 1024;
        const loadingMsg = ImageUtils.showLoading();
        
        if (sizeInKB > 500) {
            console.log(`图片较大 (${sizeInKB.toFixed(0)}KB)，开始自动压缩...`);
            ImageUtils.compressImage(file, 500)
                .then(compressedDataUrl => {
                    const content = `<img src="${compressedDataUrl}" alt="Uploaded image" />`;
                    AnnotationManager.createDraggableElement(200, 200, 'sticker-img', content);
                    ImageUtils.hideLoading();
                })
                .catch(error => {
                    console.error('图片压缩失败:', error);
                    alert('图片处理失败，请重试');
                    ImageUtils.hideLoading();
                });
        } else {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = `<img src="${e.target.result}" alt="Uploaded image" />`;
                AnnotationManager.createDraggableElement(200, 200, 'sticker-img', content);
                ImageUtils.hideLoading();
                console.log(`图片已添加 (${sizeInKB.toFixed(0)}KB，无需压缩)`);
            };
            reader.onerror = function() {
                alert('图片读取失败，请重试');
                ImageUtils.hideLoading();
            };
            reader.readAsDataURL(file);
        }
    }
    event.target.value = '';
}

function toggleChapters() {
    const chassis = document.querySelector('.notebook-chassis');
    const btn = document.getElementById('collapseBtn');
    const isCollapsed = chassis.classList.contains('chapters-collapsed') || chassis.classList.contains('all-collapsed');
    
    if (isCollapsed) {
        chassis.classList.remove('chapters-collapsed', 'all-collapsed');
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
    } else {
        chassis.classList.add('chapters-collapsed');
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
    }
}

function toggleFullscreen() {
    const chassis = document.querySelector('.notebook-chassis');
    chassis.classList.toggle('fullscreen');
}

function changePage(delta) {
    App.changePage(delta);
}

// 导出功能
function showExportDialog() {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10000;
        min-width: 400px;
    `;
    
    const currentNotebook = App.notebooks.find(nb => nb.id === App.state.currentNotebookId);
    const currentChapter = App.chapters[App.state.currentChapterIndex];
    
    dialog.innerHTML = `
        <h3 style="margin: 0 0 20px 0; color: #333;">导出笔记</h3>
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 10px;">
                <input type="radio" name="exportType" value="all" checked>
                导出所有笔记本
            </label>
            <label style="display: block; margin-bottom: 10px;">
                <input type="radio" name="exportType" value="notebook">
                导出当前笔记本：${currentNotebook ? currentNotebook.name : ''}
            </label>
            <label style="display: block; margin-bottom: 10px;">
                <input type="radio" name="exportType" value="chapter">
                导出当前章节：${currentChapter ? currentChapter.title : ''}
            </label>
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button onclick="closeExportDialog()" style="padding: 8px 20px; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer;">取消</button>
            <button onclick="doExport()" style="padding: 8px 20px; border: none; background: #4CAF50; color: white; border-radius: 6px; cursor: pointer;">导出</button>
        </div>
    `;
    
    const overlay = document.createElement('div');
    overlay.id = 'exportOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
    `;
    overlay.onclick = closeExportDialog;
    
    document.body.appendChild(overlay);
    document.body.appendChild(dialog);
    window.exportDialog = dialog;
}

function closeExportDialog() {
    const overlay = document.getElementById('exportOverlay');
    if (overlay) overlay.remove();
    if (window.exportDialog) window.exportDialog.remove();
}

function doExport() {
    const exportType = document.querySelector('input[name="exportType"]:checked').value;
    let data;
    let filename;
    
    try {
        switch (exportType) {
            case 'all':
                data = Storage.exportAllData();
                filename = `笔记-全部-${new Date().toISOString().split('T')[0]}.json`;
                break;
            case 'notebook':
                data = Storage.exportNotebook(App.state.currentNotebookId);
                const notebook = App.notebooks.find(nb => nb.id === App.state.currentNotebookId);
                filename = `笔记-${notebook.name}-${new Date().toISOString().split('T')[0]}.json`;
                break;
            case 'chapter':
                const chapter = App.chapters[App.state.currentChapterIndex];
                data = Storage.exportChapter(App.state.currentNotebookId, chapter.id);
                filename = `笔记-${chapter.title}-${new Date().toISOString().split('T')[0]}.json`;
                break;
        }
        
        // 下载文件
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        
        closeExportDialog();
        alert('导出成功！');
    } catch (error) {
        console.error('导出失败:', error);
        alert('导出失败：' + error.message);
    }
}

// 导入功能
function showImportDialog() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    if (confirm('导入数据将覆盖现有数据，是否继续？')) {
                        Storage.importAllData(data);
                        alert('导入成功！页面将刷新。');
                        location.reload();
                    }
                } catch (error) {
                    console.error('导入失败:', error);
                    alert('导入失败：' + error.message);
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
