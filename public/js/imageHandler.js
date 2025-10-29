// Image upload and handling functionality

class ImageHandler {
    constructor() {
        this.selectedImage = null;
        this.imagePreview = null;
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    }

    // Convert image to base64
    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Validate image file
    validateImage(file) {
        if (!file) {
            return { valid: false, error: 'No file selected' };
        }

        if (!this.allowedTypes.includes(file.type)) {
            return { valid: false, error: 'Invalid file type. Please upload JPG, PNG, GIF, or WebP' };
        }

        if (file.size > this.maxFileSize) {
            return { valid: false, error: 'File too large. Maximum size is 5MB' };
        }

        return { valid: true };
    }

    // Create image preview element
    createPreview(imageUrl, fileName) {
        const preview = document.createElement('div');
        preview.className = 'image-preview';
        preview.innerHTML = `
            <div class="preview-container">
                <img src="${imageUrl}" alt="${fileName}">
                <button class="remove-image" title="Remove image">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <div class="image-name">${fileName}</div>
            </div>
        `;
        return preview;
    }

    // Handle image selection
    async handleImageSelect(file, onSuccess, onError) {
        const validation = this.validateImage(file);
        
        if (!validation.valid) {
            if (onError) onError(validation.error);
            return null;
        }

        try {
            const base64 = await this.fileToBase64(file);
            this.selectedImage = {
                file: file,
                base64: base64,
                name: file.name,
                type: file.type,
                size: file.size
            };

            if (onSuccess) onSuccess(this.selectedImage);
            return this.selectedImage;
        } catch (error) {
            console.error('Error reading file:', error);
            if (onError) onError('Failed to read image file');
            return null;
        }
    }

    // Clear selected image
    clearImage() {
        this.selectedImage = null;
        this.imagePreview = null;
    }

    // Get selected image data
    getImageData() {
        return this.selectedImage;
    }

    // Check if image is selected
    hasImage() {
        return this.selectedImage !== null;
    }
}

// Add CSS for image preview
const imageStyles = document.createElement('style');
imageStyles.textContent = `
    .image-preview {
        margin: 10px 0;
        animation: fadeIn 0.3s ease;
    }

    .preview-container {
        position: relative;
        display: inline-block;
        max-width: 300px;
        border-radius: 12px;
        overflow: hidden;
        border: 2px solid #e0e0e0;
        background: #f9f9f9;
    }

    .preview-container img {
        width: 100%;
        height: auto;
        display: block;
        max-height: 200px;
        object-fit: cover;
    }

    .remove-image {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    .remove-image:hover {
        background: #ff4444;
        color: white;
        transform: scale(1.1);
    }

    .image-name {
        padding: 8px 12px;
        font-size: 12px;
        color: #666;
        background: white;
        border-top: 1px solid #e0e0e0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .image-upload-btn {
        width: 40px;
        height: 40px;
        border: 2px solid #e0e0e0;
        background: white;
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        color: #667eea;
    }

    .image-upload-btn:hover {
        border-color: #667eea;
        background: #f0f0ff;
        transform: translateY(-2px);
    }

    .image-upload-btn.has-image {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-color: #667eea;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Dark mode support */
    .dark-mode .preview-container {
        background: #0f3460;
        border-color: #2a3f5f;
    }

    .dark-mode .image-name {
        background: #16213e;
        color: #aaa;
        border-color: #2a3f5f;
    }

    .dark-mode .image-upload-btn {
        background: #0f3460;
        border-color: #2a3f5f;
    }

    .dark-mode .image-upload-btn:hover {
        background: #16213e;
    }
`;
document.head.appendChild(imageStyles);

export default ImageHandler;
