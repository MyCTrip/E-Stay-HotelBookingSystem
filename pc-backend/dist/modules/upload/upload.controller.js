"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const upload_1 = require("../../config/upload");
const uploadImage = async (req, res) => {
    if (!req.file)
        return res.status(400).json({ message: '未收到文件' });
    const url = `${upload_1.UPLOAD_URL_PATH}/${req.file.filename}`;
    res.json({ url, filename: req.file.filename, size: req.file.size });
};
exports.uploadImage = uploadImage;
//# sourceMappingURL=upload.controller.js.map