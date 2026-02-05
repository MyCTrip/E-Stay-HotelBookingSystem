"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizePolicies = exports.sanitizeFacilities = exports.sanitizeHTML = void 0;
const dompurify_1 = __importDefault(require("dompurify"));
const jsdom_1 = require("jsdom");
// Create a DOMPurify instance with JSDOM
const window = new jsdom_1.JSDOM('').window;
const DOMPurify = (0, dompurify_1.default)(window);
// Configure DOMPurify options
const sanitizeOptions = {
    ALLOWED_TAGS: [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'hr', 'a', 'img', 'div', 'span'
    ],
    ALLOWED_ATTR: [
        'href', 'title', 'alt', 'src', 'width', 'height', 'class'
    ],
    ALLOWED_PROTOCOLS: ['http', 'https'],
    KEEP_CONTENT: true
};
/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - The HTML content to sanitize
 * @returns The sanitized HTML content
 */
const sanitizeHTML = (html) => {
    if (!html || typeof html !== 'string') {
        return '';
    }
    return DOMPurify.sanitize(html, sanitizeOptions);
};
exports.sanitizeHTML = sanitizeHTML;
/**
 * Sanitizes an array of facility objects
 * @param facilities - The facilities array to sanitize
 * @returns The sanitized facilities array
 */
const sanitizeFacilities = (facilities) => {
    if (!Array.isArray(facilities)) {
        return [];
    }
    return facilities.map(facility => ({
        ...facility,
        content: (0, exports.sanitizeHTML)(facility.content || ''),
        items: facility.items ? facility.items.map((item) => ({
            ...item,
            description: (0, exports.sanitizeHTML)(item.description || '')
        })) : []
    }));
};
exports.sanitizeFacilities = sanitizeFacilities;
/**
 * Sanitizes an array of policy objects
 * @param policies - The policies array to sanitize
 * @returns The sanitized policies array
 */
const sanitizePolicies = (policies) => {
    if (!Array.isArray(policies)) {
        return [];
    }
    return policies.map(policy => ({
        ...policy,
        content: (0, exports.sanitizeHTML)(policy.content || ''),
        summary: (0, exports.sanitizeHTML)(policy.summary || '')
    }));
};
exports.sanitizePolicies = sanitizePolicies;
//# sourceMappingURL=sanitize.js.map