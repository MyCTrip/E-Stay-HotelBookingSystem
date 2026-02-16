"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multipleImageUpload = exports.singleImageUpload = void 0;
const upload_1 = require("../config/upload");
const image_service_1 = require("../services/image.service");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const singleImageUpload = (fieldName) => (req, res, next) => {
    upload_1.upload.single(fieldName)(req, res, async (err) => {
        if (err) {
            if (err.message === 'Unsupported file type') {
                return res.status(415).json({ message: '仅支持图片类型 (jpg/png/gif/webp)' });
            }
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({ message: '图片大小不能超过 5MB' });
            }
            return res.status(400).json({ message: err.message });
        }
        // 如果有上传的文件，进行压缩处理
        if (req.file) {
            try {
                const originalPath = req.file.path;
                const fileName = req.file.filename;
                const ext = path_1.default.extname(fileName);
                const baseName = path_1.default.basename(fileName, ext);
                const compressedPath = path_1.default.join(path_1.default.dirname(originalPath), `${baseName}-compressed${ext}`);
                // 压缩图片，最大宽度1920px，质量80%
                await image_service_1.imageService.compressImage(originalPath, compressedPath, {
                    width: 1920,
                    quality: 80
                });
                // 删除原文件，使用压缩后的文件
                await promises_1.default.unlink(originalPath);
                // 更新文件信息
                req.file.path = compressedPath;
                req.file.filename = `${baseName}-compressed${ext}`;
                console.log(`Image compressed: ${fileName} -> ${req.file.filename}`);
            }
            catch (error) {
                console.error('Image compression error:', error);
                // 压缩失败不影响上传，继续使用原文件
            }
        }
        next();
    });
};
exports.singleImageUpload = singleImageUpload;
/**
 * 多图片上传中间件，支持图片压缩
 */
const multipleImageUpload = (fieldName, maxCount = 10) => (req, res, next) => {
    upload_1.upload.array(fieldName, maxCount)(req, res, async (err) => {
        if (err) {
            if (err.message === 'Unsupported file type') {
                return res.status(415).json({ message: '仅支持图片类型 (jpg/png/gif/webp)' });
            }
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({ message: '图片大小不能超过 5MB' });
            }
            return res.status(400).json({ message: err.message });
        }
        // 如果有上传的文件，进行压缩处理
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                try {
                    const originalPath = file.path;
                    const fileName = file.filename;
                    const ext = path_1.default.extname(fileName);
                    const baseName = path_1.default.basename(fileName, ext);
                    const compressedPath = path_1.default.join(path_1.default.dirname(originalPath), `${baseName}-compressed${ext}`);
                    // 压缩图片，最大宽度1920px，质量80%
                    await image_service_1.imageService.compressImage(originalPath, compressedPath, {
                        width: 1920,
                        quality: 80
                    });
                    // 删除原文件，使用压缩后的文件
                    await promises_1.default.unlink(originalPath);
                    // 更新文件信息
                    file.path = compressedPath;
                    file.filename = `${baseName}-compressed${ext}`;
                    console.log(`Image compressed: ${fileName} -> ${file.filename}`);
                }
                catch (error) {
                    console.error('Image compression error:', error);
                    // 压缩失败不影响上传，继续使用原文件
                }
            }
        }
        next();
    });
};
exports.multipleImageUpload = multipleImageUpload;
//# sourceMappingURL=upload.middleware.js.map