"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multipleImageUpload = exports.singleImageUpload = void 0;
const upload_1 = require("../config/upload");
const singleImageUpload = (fieldName) => (req, res, next) => {
    upload_1.upload.single(fieldName)(req, res, (err) => {
        if (err) {
            console.error('[Upload Error] Type:', err.code || err.message);
            if (err.message.includes('Unsupported file type') || err.code === 'UNSUPPORTED_MIME') {
                return res.status(415).json({
                    success: false,
                    message: '仅支持图片类型 (jpg/png/gif/webp)'
                });
            }
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({
                    success: false,
                    message: '图片大小不能超过 10MB'
                });
            }
            return res.status(400).json({
                success: false,
                message: err.message || '上传失败'
            });
        }
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '未收到文件'
            });
        }
        console.log('[Upload Success] File:', {
            fieldName,
            fileName: req.file.filename,
            size: req.file.size,
            mimetype: req.file.mimetype
        });
        next();
    });
};
exports.singleImageUpload = singleImageUpload;
const multipleImageUpload = (fieldName, maxCount = 10) => (req, res, next) => {
    upload_1.upload.array(fieldName, maxCount)(req, res, (err) => {
        if (err) {
            console.error('[Upload Error] Type:', err.code || err.message);
            if (err.message.includes('Unsupported file type')) {
                return res.status(415).json({
                    success: false,
                    message: '仅支持图片类型 (jpg/png/gif/webp)'
                });
            }
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({
                    success: false,
                    message: '图片大小不能超过 10MB'
                });
            }
            return res.status(400).json({
                success: false,
                message: err.message || '上传失败'
            });
        }
        next();
    });
};
exports.multipleImageUpload = multipleImageUpload;
//# sourceMappingURL=upload.middleware.js.map