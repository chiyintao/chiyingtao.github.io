// ===== 组件管理模块 =====
const AnnotationManager = {
    annotations: [],
    saveTimer: null,

    // 创建可拖拽元素
    createDraggableElement(x, y, typeClass, contentHTML, width, height) {
        const el = document.createElement('div');
        el.className = `draggable-element ${typeClass}`;
        el.style.position = 'absolute';
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.transform = 'rotate(0deg)';
        el.dataset.rotation = '0';
        el.dataset.id = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // 设置固定宽高（如果提供）
        if (width) {
            el.style.width = width + 'px';
        }
        if (height) {
            el.style.height = height + 'px';
        }
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'draggable-content';
        contentDiv.innerHTML = contentHTML;
        
        el.appendChild(contentDiv);
        
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        el.appendChild(resizeHandle);
        
        const rotateHandle = document.createElement('div');
        rotateHandle.className = 'rotate-handle';
        el.appendChild(rotateHandle);
        
        this.bindEvents(el);
        
        const activePaperEl = document.getElementById('activePaper');
        activePaperEl.appendChild(el);
        this.annotations.push(el);
        
        this.scheduleSave();
        return el;
    },

    // 绑定事件
    bindEvents(el) {
        el.addEventListener('mousedown', (e) => {
            const target = e.target;
            const activePaperEl = document.getElementById('activePaper');
            
            if (target.classList.contains('resize-handle')) {
                e.preventDefault();
                e.stopPropagation();
                DragManager.state.activeElement = el;
                DragManager.state.type = 'resize';
                DragManager.state.startX = e.clientX;
                DragManager.state.startY = e.clientY;
                DragManager.state.startWidth = el.offsetWidth;
                DragManager.state.startHeight = el.offsetHeight;
                DragManager.selectElement(el);
                return;
            }
            
            if (target.classList.contains('rotate-handle')) {
                e.preventDefault();
                e.stopPropagation();
                DragManager.state.activeElement = el;
                DragManager.state.type = 'rotate';
                DragManager.state.startX = e.clientX;
                DragManager.state.startY = e.clientY;
                DragManager.state.startRotation = DragManager.getRotationDegrees(el);
                DragManager.selectElement(el);
                return;
            }
            
            if (target.hasAttribute('contenteditable') || target.closest('[contenteditable]')) {
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            DragManager.state.activeElement = el;
            DragManager.state.type = 'drag';
            DragManager.state.startX = e.clientX;
            DragManager.state.startY = e.clientY;
            
            const rect = el.getBoundingClientRect();
            const paperRect = activePaperEl.getBoundingClientRect();
            DragManager.state.startTop = rect.top - paperRect.top;
            DragManager.state.startLeft = rect.left - paperRect.left;
            
            el.classList.add('dragging');
            DragManager.selectElement(el);
            document.getElementById('trashZone').classList.add('active');
        });
        
        el.addEventListener('click', (e) => {
            if (!e.target.classList.contains('resize-handle') && 
                !e.target.classList.contains('rotate-handle')) {
                DragManager.selectElement(el);
            }
        });
        
        const editableEl = el.querySelector('[contenteditable]');
        if (editableEl) {
            editableEl.addEventListener('input', () => {
                this.scheduleSave();
            });
        }
    },

    // 计划保存
    scheduleSave() {
        clearTimeout(this.saveTimer);
        this.saveTimer = setTimeout(() => {
            window.dispatchEvent(new CustomEvent('annotationsChanged'));
        }, 500);
    },

    // 收集组件数据
    collectAnnotationsData() {
        const annotationsData = [];
        document.querySelectorAll('.draggable-element').forEach(el => {
            const data = {
                id: el.dataset.id,
                className: el.className,
                left: el.style.left,
                top: el.style.top,
                width: el.style.width,
                height: el.style.height,
                transform: el.style.transform,
                rotation: el.dataset.rotation,
                content: el.querySelector('.draggable-content').innerHTML
            };
            annotationsData.push(data);
        });
        return annotationsData;
    },

    // 加载组件
    loadAnnotations(annotationsData) {
        console.log(`加载 ${annotationsData.length} 个组件`);
        
        annotationsData.forEach(data => {
            const el = document.createElement('div');
            el.className = data.className;
            el.style.position = 'absolute';
            el.style.left = data.left;
            el.style.top = data.top;
            el.style.width = data.width || '';
            el.style.height = data.height || '';
            el.style.transform = data.transform;
            el.dataset.rotation = data.rotation;
            el.dataset.id = data.id;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'draggable-content';
            contentDiv.innerHTML = data.content;
            
            el.appendChild(contentDiv);
            
            const resizeHandle = document.createElement('div');
            resizeHandle.className = 'resize-handle';
            el.appendChild(resizeHandle);
            
            const rotateHandle = document.createElement('div');
            rotateHandle.className = 'rotate-handle';
            el.appendChild(rotateHandle);
            
            this.bindEvents(el);
            
            const activePaperEl = document.getElementById('activePaper');
            activePaperEl.appendChild(el);
            this.annotations.push(el);
        });
    },

    // 清除所有组件
    clearAll() {
        document.querySelectorAll('.draggable-element').forEach(el => el.remove());
        this.annotations = [];
    }
};
