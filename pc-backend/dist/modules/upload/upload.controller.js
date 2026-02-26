"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const uploadImage = async (req, res) => {
    try {
        console.log('[uploadImage] Processing request...');
        if (!req.file) {
            console.warn('[uploadImage] No file received');
            return res.status(400).json({
                success: false,
                message: '未收到文件'
            });
        }
        // 返回相对路径，让前端通过 Vite 代理访问，避免 CORS 问题
        const filename = req.file.filename;
        const url = `/api/uploads/${filename}`;
        console.log('[uploadImage] Upload success:', {
            filename,
            size: req.file.size,
            url
        });
        // 返回上传结果
        res.status(200).json({
            success: true,
            message: '上传成功',
            data: {
                url,
                filename,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    }
    catch (error) {
        console.error('[uploadImage] Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '上传失败'
        });
    }
};
exports.uploadImage = uploadImage;
//# sourceMappingURL=upload.controller.js.map