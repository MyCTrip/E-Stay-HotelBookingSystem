"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeObject = exports.sanitizeHtml = void 0;
const dompurify_1 = __importDefault(require("dompurify"));
const jsdom_1 = require("jsdom");
// 创建一个虚拟的DOM环境，因为DOMPurify需要DOM API
const { window } = new jsdom_1.JSDOM('<!DOCTYPE html><html><body></body></html>');
const purify = (0, dompurify_1.default)(window);
// 定义允许的HTML标签和属性
const allowedTags = [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'div', 'span', 'blockquote', 'hr', 'table', 'thead', 'tbody',
    'tr', 'td', 'th', 'a'
];
// 净化HTML内容的函数
const sanitizeHtml = (html) => {
    if (!html || typeof html !== 'string') {
        return '';
    }
    return purify.sanitize(html, {
        ALLOWED_TAGS: allowedTags,
        ALLOWED_URI_REGEXP: /^(https?:\/\/|mailto:|tel:)/,
        FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
        FORBID_ATTR: ['on*'] // 禁止所有on事件属性
    });
};
exports.sanitizeHtml = sanitizeHtml;
// 递归净化包含HTML内容的对象
const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(item => (0, exports.sanitizeObject)(item));
    }
    const sanitizedObj = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            if (key === 'content' && typeof value === 'string') {
                // 净化HTML内容字段
                sanitizedObj[key] = (0, exports.sanitizeHtml)(value);
            }
            else if (typeof value === 'object') {
                // 递归处理嵌套对象
                sanitizedObj[key] = (0, exports.sanitizeObject)(value);
            }
            else {
                // 其他类型保持不变
                sanitizedObj[key] = value;
            }
        }
    }
    return sanitizedObj;
};
exports.sanitizeObject = sanitizeObject;
//# sourceMappingURL=htmlSanitizer.js.map