"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeObject = exports.sanitizeHtml = void 0;
const dompurify_1 = __importDefault(require("dompurify"));
const jsdom_1 = require("jsdom");
// 创建一个虚拟的DOM环境，用于DOMPurify
const { window } = new jsdom_1.JSDOM('<!DOCTYPE html><html><body></body></html>');
globalThis.window = window;
globalThis.document = window.document;
globalThis.navigator = window.navigator;
// 配置DOMPurify，只允许安全的HTML标签和属性
const purify = (0, dompurify_1.default)(window);
/**
 * 净化HTML富文本内容，防止XSS攻击
 * @param html 原始HTML内容
 * @returns 净化后的HTML内容
 */
const sanitizeHtml = (html) => {
    if (!html || typeof html !== 'string') {
        return '';
    }
    return purify.sanitize(html, {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'hr',
            'span', 'div', 'table', 'thead', 'tbody', 'tr', 'td', 'th'
        ],
        ALLOWED_ATTR: [
            'class', 'id', 'title', 'alt', 'src', 'href',
            'colspan', 'rowspan', 'align', 'valign'
        ],
        FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'link', 'meta'],
        FORBID_ATTR: ['on*']
    });
};
exports.sanitizeHtml = sanitizeHtml;
/**
 * 净化整个对象中的HTML内容
 * @param obj 包含HTML内容的对象
 * @returns 净化后的对象
 */
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
            if (typeof value === 'string') {
                // 检查是否包含HTML标签
                if (/<[^>]+>/g.test(value)) {
                    sanitizedObj[key] = (0, exports.sanitizeHtml)(value);
                }
                else {
                    sanitizedObj[key] = value;
                }
            }
            else if (typeof value === 'object') {
                sanitizedObj[key] = (0, exports.sanitizeObject)(value);
            }
            else {
                sanitizedObj[key] = value;
            }
        }
    }
    return sanitizedObj;
};
exports.sanitizeObject = sanitizeObject;
//# sourceMappingURL=xss.js.map