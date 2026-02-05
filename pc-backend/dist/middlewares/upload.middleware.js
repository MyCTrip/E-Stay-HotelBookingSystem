"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleImageUpload = void 0;
const upload_1 = require("../config/upload");
const singleImageUpload = (fieldName) => (req, res, next) => {
    upload_1.upload.single(fieldName)(req, res, (err) => {
        if (err) {
            if (err.message === 'Unsupported file type') {
                return res.status(415).json({ message: '仅支持图片类型 (jpg/png/gif/webp)' });
            }
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({ message: '图片大小不能超过 5MB' });
            }
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};
exports.singleImageUpload = singleImageUpload;
//# sourceMappingURL=upload.middleware.js.map