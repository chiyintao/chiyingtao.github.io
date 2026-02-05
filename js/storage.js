// ===== 数据存储模块 =====
const Storage = {
    // 保存笔记本列表
    saveNotebooks(notebooks) {
        localStorage.setItem('notebooks', JSON.stringify(notebooks));
    },

    // 加载笔记本列表
    loadNotebooks() {
        const saved = localStorage.getItem('notebooks');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('加载笔记本失败:', e);
            }
        }
        return [
            { id: 1, name: "小王子", icon: "📖" }
        ];
    },

    // 添加笔记本
    addNotebook(notebook) {
        const notebooks = this.loadNotebooks();
        notebooks.push(notebook);
        this.saveNotebooks(notebooks);
        return notebook;
    },

    // 更新笔记本
    updateNotebook(id, updates) {
        const notebooks = this.loadNotebooks();
        const index = notebooks.findIndex(nb => nb.id === id);
        if (index !== -1) {
            notebooks[index] = { ...notebooks[index], ...updates };
            this.saveNotebooks(notebooks);
            return notebooks[index];
        }
        return null;
    },

    // 删除笔记本
    deleteNotebook(id) {
        const notebooks = this.loadNotebooks();
        const filtered = notebooks.filter(nb => nb.id !== id);
        this.saveNotebooks(filtered);
        return filtered;
    },

    // 保存章节数据
    saveChapters(notebookId, chapters) {
        localStorage.setItem(`chapters_${notebookId}`, JSON.stringify(chapters));
    },

    // 加载章节数据
    loadChapters(notebookId) {
        const saved = localStorage.getItem(`chapters_${notebookId}`);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('加载章节失败:', e);
            }
        }
        return [];
    },

    // 添加章节
    addChapter(notebookId, chapter) {
        const chapters = this.loadChapters(notebookId);
        chapters.push(chapter);
        this.saveChapters(notebookId, chapters);
        return chapter;
    },

    // 更新章节
    updateChapter(notebookId, chapterId, updates) {
        const chapters = this.loadChapters(notebookId);
        const index = chapters.findIndex(ch => ch.id === chapterId);
        if (index !== -1) {
            chapters[index] = { ...chapters[index], ...updates };
            this.saveChapters(notebookId, chapters);
            return chapters[index];
        }
        return null;
    },

    // 删除章节
    deleteChapter(notebookId, chapterId) {
        const chapters = this.loadChapters(notebookId);
        const filtered = chapters.filter(ch => ch.id !== chapterId);
        this.saveChapters(notebookId, filtered);
        return filtered;
    },

    // 保存页面内容
    savePageContent(chapterIndex, pageIndex, content) {
        localStorage.setItem(`page_${chapterIndex}_${pageIndex}`, content);
    },

    // 加载页面内容
    loadPageContent(chapterIndex, pageIndex) {
        return localStorage.getItem(`page_${chapterIndex}_${pageIndex}`);
    },

    // 保存组件数据
    saveAnnotations(chapterIndex, pageIndex, annotations) {
        const pageKey = `annotations_${chapterIndex}_${pageIndex}`;
        try {
            const jsonString = JSON.stringify(annotations);
            const sizeInMB = new Blob([jsonString]).size / 1024 / 1024;
            
            if (sizeInMB > 4) {
                console.warn(`数据过大 (${sizeInMB.toFixed(2)}MB)，可能无法保存`);
                alert('图片数据过大，建议使用较小的图片（建议小于 500KB）');
                return false;
            }
            
            localStorage.setItem(pageKey, jsonString);
            console.log(`已保存 ${annotations.length} 个组件 (${sizeInMB.toFixed(2)}MB)`);
            return true;
        } catch (e) {
            console.error('保存失败:', e);
            if (e.name === 'QuotaExceededError') {
                alert('存储空间已满，请删除一些组件或使用较小的图片');
            }
            return false;
        }
    },

    // 加载组件数据
    loadAnnotations(chapterIndex, pageIndex) {
        const pageKey = `annotations_${chapterIndex}_${pageIndex}`;
        const saved = localStorage.getItem(pageKey);
        
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('加载组件失败:', e);
                alert('加载组件失败，数据可能已损坏');
            }
        }
        return [];
    },

    // 导出所有数据
    exportAllData() {
        const data = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            appName: '笔记',
            notebooks: this.loadNotebooks(),
            chapters: {},
            pages: {},
            annotations: {}
        };
        
        // 收集所有章节数据
        data.notebooks.forEach(nb => {
            data.chapters[nb.id] = this.loadChapters(nb.id);
        });
        
        // 收集所有页面和组件数据
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('page_')) {
                data.pages[key] = localStorage.getItem(key);
            }
            if (key.startsWith('annotations_')) {
                data.annotations[key] = localStorage.getItem(key);
            }
        });
        
        return data;
    },

    // 导出单个笔记本
    exportNotebook(notebookId) {
        const notebooks = this.loadNotebooks();
        const notebook = notebooks.find(nb => nb.id === notebookId);
        
        if (!notebook) {
            throw new Error('笔记本不存在');
        }
        
        const data = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            appName: '笔记',
            exportType: 'notebook',
            notebooks: [notebook],
            chapters: {},
            pages: {},
            annotations: {}
        };
        
        // 收集该笔记本的章节数据
        data.chapters[notebookId] = this.loadChapters(notebookId);
        
        // 收集该笔记本的页面和组件数据
        const chapters = data.chapters[notebookId];
        chapters.forEach((chapter, chapterIndex) => {
            for (let pageIndex = 0; pageIndex < chapter.pageCount; pageIndex++) {
                const pageKey = `page_${chapterIndex}_${pageIndex}`;
                const annotKey = `annotations_${chapterIndex}_${pageIndex}`;
                
                const pageContent = localStorage.getItem(pageKey);
                const annotContent = localStorage.getItem(annotKey);
                
                if (pageContent) data.pages[pageKey] = pageContent;
                if (annotContent) data.annotations[annotKey] = annotContent;
            }
        });
        
        return data;
    },

    // 导出单个章节
    exportChapter(notebookId, chapterId) {
        const chapters = this.loadChapters(notebookId);
        const chapterIndex = chapters.findIndex(ch => ch.id === chapterId);
        
        if (chapterIndex === -1) {
            throw new Error('章节不存在');
        }
        
        const chapter = chapters[chapterIndex];
        const notebooks = this.loadNotebooks();
        const notebook = notebooks.find(nb => nb.id === notebookId);
        
        const data = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            appName: '笔记',
            exportType: 'chapter',
            notebookInfo: notebook,
            chapter: chapter,
            pages: {},
            annotations: {}
        };
        
        // 收集该章节的页面和组件数据
        for (let pageIndex = 0; pageIndex < chapter.pageCount; pageIndex++) {
            const pageKey = `page_${chapterIndex}_${pageIndex}`;
            const annotKey = `annotations_${chapterIndex}_${pageIndex}`;
            
            const pageContent = localStorage.getItem(pageKey);
            const annotContent = localStorage.getItem(annotKey);
            
            if (pageContent) data.pages[pageKey] = pageContent;
            if (annotContent) data.annotations[annotKey] = annotContent;
        }
        
        return data;
    },

    // 导入所有数据
    importAllData(data) {
        try {
            // 验证数据格式
            if (!data.version || !data.notebooks) {
                throw new Error('无效的数据格式');
            }
            
            if (data.version !== '1.0') {
                throw new Error('不支持的版本: ' + data.version);
            }
            
            // 导入笔记本
            this.saveNotebooks(data.notebooks);
            
            // 导入章节
            Object.keys(data.chapters).forEach(nbId => {
                this.saveChapters(nbId, data.chapters[nbId]);
            });
            
            // 导入页面和组件
            Object.keys(data.pages).forEach(key => {
                localStorage.setItem(key, data.pages[key]);
            });
            Object.keys(data.annotations).forEach(key => {
                localStorage.setItem(key, data.annotations[key]);
            });
            
            return true;
        } catch (e) {
            console.error('导入失败:', e);
            throw e;
        }
    },

    // 清空所有数据
    clearAllData() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('notebooks') || 
                key.startsWith('chapters_') || 
                key.startsWith('page_') || 
                key.startsWith('annotations_')) {
                localStorage.removeItem(key);
            }
        });
    }
};
