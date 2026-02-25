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
                const ext = path_1.default.extname(fileName).toLowerCase();
                const baseName = path_1.default.basename(fileName, ext);
                const uploadsDir = path_1.default.dirname(originalPath);
                const compressedPath = path_1.default.join(uploadsDir, `${baseName}-compressed${ext}`);
                console.log(`Starting compression: ${fileName}`);
                console.log(`Original path: ${originalPath}`);
                console.log(`Compressed path: ${compressedPath}`);
                // 检查原文件是否存在
                try {
                    await promises_1.default.access(originalPath);
                }
                catch (accessError) {
                    console.error(`File access error: ${originalPath}`, accessError);
                    throw new Error(`无法访问上传的文件: ${originalPath}`);
                }
                // 确定输出格式
                const formatMap = {
                    '.jpg': 'jpeg',
                    '.jpeg': 'jpeg',
                    '.png': 'png',
                    '.gif': 'jpeg', // gif转为jpeg
                    '.webp': 'webp'
                };
                const outputFormat = formatMap[ext] || 'jpeg';
                // 压缩图片，最大宽度1920px，质量80%
                await image_service_1.imageService.compressImage(originalPath, compressedPath, {
                    width: 1920,
                    quality: 80,
                    format: outputFormat
                });
                // 删除原文件，使用压缩后的文件
                try {
                    await promises_1.default.unlink(originalPath);
                    console.log(`Original file deleted: ${fileName}`);
                }
                catch (unlinkError) {
                    console.warn(`Failed to delete original file: ${originalPath}`, unlinkError);
                }
                // 更新文件信息
                req.file.path = compressedPath;
                req.file.filename = `${baseName}-compressed${ext}`;
                req.file.size = (await promises_1.default.stat(compressedPath)).size;
                console.log(`Image compressed successfully: ${baseName}-compressed${ext}`);
            }
            catch (error) {
                console.error('Image compression error:', error);
                console.error('Error details:', error.message);
                // 压缩失败不影响上传，继续使用原文件
                console.log(`Compression failed, using original file: ${req.file.filename}`);
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