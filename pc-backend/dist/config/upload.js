"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLOAD_URL_PATH = exports.UPLOAD_DIR = exports.upload = void 0;
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const UPLOAD_DIR = process.env.UPLOAD_DIR || path_1.default.resolve(process.cwd(), 'uploads');
exports.UPLOAD_DIR = UPLOAD_DIR;
const UPLOAD_URL_PATH = process.env.UPLOAD_URL_PATH || '/uploads';
exports.UPLOAD_URL_PATH = UPLOAD_URL_PATH;
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const name = `${Date.now()}-${Math.random().toString(16).slice(2, 10)}${ext}`;
        cb(null, name);
    }
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (/image\/(jpeg|png|gif|webp)/.test(file.mimetype))
            cb(null, true);
        else
            cb(new Error('Unsupported file type'), false);
    }
});
//# sourceMappingURL=upload.js.map