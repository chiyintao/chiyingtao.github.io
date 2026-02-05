// ===== 图片处理模块 =====
const ImageUtils = {
    // 压缩图片
    compressImage(file, maxSizeKB = 500) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const img = new Image();
                
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // 计算压缩后的尺寸（保持宽高比）
                    let width = img.width;
                    let height = img.height;
                    const maxDimension = 1200;
                    
                    if (width > maxDimension || height > maxDimension) {
                        if (width > height) {
                            height = (height / width) * maxDimension;
                            width = maxDimension;
                        } else {
                            width = (width / height) * maxDimension;
                            height = maxDimension;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // 尝试不同的质量级别
                    let quality = 0.9;
                    let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                    let sizeKB = (compressedDataUrl.length * 0.75) / 1024;
                    
                    while (sizeKB > maxSizeKB && quality > 0.1) {
                        quality -= 0.1;
                        compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                        sizeKB = (compressedDataUrl.length * 0.75) / 1024;
                    }
                    
                    console.log(`图片压缩: ${(file.size / 1024).toFixed(0)}KB → ${sizeKB.toFixed(0)}KB (质量: ${(quality * 100).toFixed(0)}%)`);
                    resolve(compressedDataUrl);
                };
                
                img.onerror = () => reject(new Error('图片加载失败'));
                img.src = e.target.result;
            };
            
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsDataURL(file);
        });
    },

    // 显示加载提示
    showLoading(message = '正在处理图片...') {
        const loadingMsg = document.createElement('div');
        loadingMsg.id = 'imageLoading';
        loadingMsg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.8);color:white;padding:20px 40px;border-radius:10px;z-index:10000;font-family:var(--font-ui);';
        loadingMsg.textContent = message;
        document.body.appendChild(loadingMsg);
        return loadingMsg;
    },

    // 隐藏加载提示
    hideLoading() {
        const loadingMsg = document.getElementById('imageLoading');
        if (loadingMsg) {
            document.body.removeChild(loadingMsg);
        }
    }
};
