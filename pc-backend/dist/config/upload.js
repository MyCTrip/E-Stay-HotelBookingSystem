"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLOAD_DIR = exports.upload = void 0;
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
// 构建上传目录的绝对路径
const UPLOAD_DIR = path_1.default.resolve(__dirname, '../../uploads');
exports.UPLOAD_DIR = UPLOAD_DIR;
// 确保上传目录存在
if (!fs_1.default.existsSync(UPLOAD_DIR)) {
    fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const filename = `${timestamp}-${random}${ext}`;
        cb(null, filename);
    }
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const mimeType = file.mimetype;
        if (/^image\/(jpeg|png|gif|webp)$/.test(mimeType)) {
            cb(null, true);
        }
        else {
            cb(new Error(`不支持的文件类型: ${mimeType}`));
        }
    }
});
//# sourceMappingURL=upload.js.map