// ===== 拖拽管理模块 =====
const DragManager = {
    state: {
        activeElement: null,
        type: null,
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0,
        startRotation: 0,
        startTop: 0,
        startLeft: 0
    },

    // 初始化
    init() {
        document.addEventListener('mousemove', (e) => this.onDrag(e));
        document.addEventListener('mouseup', (e) => this.stopDrag(e));
    },

    // 获取旋转角度
    getRotationDegrees(el) {
        const transform = el.style.transform || '';
        const match = transform.match(/rotate\(([^)]+)deg\)/);
        return match ? parseFloat(match[1]) : 0;
    },

    // 选中元素
    selectElement(el) {
        document.querySelectorAll('.draggable-element').forEach(d => d.classList.remove('selected'));
        el.classList.add('selected');
        this.state.activeElement = el;
    },

    // 取消选中
    deselectAll() {
        document.querySelectorAll('.draggable-element').forEach(el => {
            el.classList.remove('selected');
        });
        this.state.activeElement = null;
        this.state.type = null;
    },

    // 拖拽移动
    onDrag(e) {
        if (!this.state.activeElement || !this.state.type) return;
        e.preventDefault();
        
        const activePaperEl = document.getElementById('activePaper');
        const paperRect = activePaperEl.getBoundingClientRect();
        const dx = e.clientX - this.state.startX;
        const dy = e.clientY - this.state.startY;
        
        if (this.state.type === 'drag') {
            const newTop = this.state.startTop + dy;
            const newLeft = this.state.startLeft + dx;
            
            this.state.activeElement.style.top = `${newTop}px`;
            this.state.activeElement.style.left = `${newLeft}px`;
            
            // 检查垃圾桶
            const trashZone = document.getElementById('trashZone');
            const trashRect = trashZone.getBoundingClientRect();
            const dragRect = this.state.activeElement.getBoundingClientRect();
            
            if (this.isOverlapping(dragRect, trashRect)) {
                trashZone.classList.add('hover');
            } else {
                trashZone.classList.remove('hover');
            }
        }
        else if (this.state.type === 'resize') {
            const scaleX = (this.state.startWidth + dx) / this.state.startWidth;
            const scaleY = (this.state.startHeight + dy) / this.state.startHeight;
            const scale = Math.max(scaleX, scaleY, 0.3);
            
            const newWidth = this.state.startWidth * scale;
            const newHeight = this.state.startHeight * scale;
            
            this.state.activeElement.style.width = `${newWidth}px`;
            this.state.activeElement.style.height = `${newHeight}px`;
        }
        else if (this.state.type === 'rotate') {
            const rect = this.state.activeElement.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
            this.state.activeElement.style.transform = `rotate(${angle}deg)`;
            this.state.activeElement.dataset.rotation = angle;
        }
    },

    // 停止拖拽
    stopDrag(e) {
        if (this.state.activeElement && this.state.type === 'drag') {
            const trashZone = document.getElementById('trashZone');
            const trashRect = trashZone.getBoundingClientRect();
            const dragRect = this.state.activeElement.getBoundingClientRect();
            
            if (this.isOverlapping(dragRect, trashRect)) {
                this.state.activeElement.remove();
                // 触发保存事件
                window.dispatchEvent(new CustomEvent('annotationsChanged'));
            }
            
            this.state.activeElement.classList.remove('dragging');
            trashZone.classList.remove('active', 'hover');
        }
        
        if (this.state.type) {
            // 触发保存事件
            window.dispatchEvent(new CustomEvent('annotationsChanged'));
        }
        
        this.state.type = null;
    },

    // 检查重叠
    isOverlapping(rect1, rect2) {
        return !(rect1.right < rect2.left || 
                 rect1.left > rect2.right || 
                 rect1.bottom < rect2.top || 
                 rect1.top > rect2.bottom);
    }
};
