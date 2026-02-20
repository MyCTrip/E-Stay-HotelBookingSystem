import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import styles from './index.module.css';
/**
 * 404 页面
 */
export default function NotFoundPage() {
    return (_jsx("div", { className: styles.container, children: _jsxs("div", { className: styles.content, children: [_jsx("h1", { className: styles.code, children: "404" }), _jsx("h2", { children: "\u9875\u9762\u672A\u627E\u5230" }), _jsx("p", { children: "\u62B1\u6B49\uFF0C\u60A8\u8981\u67E5\u627E\u7684\u9875\u9762\u4E0D\u5B58\u5728" }), _jsx(Link, { to: "/", className: styles.button, children: "\u8FD4\u56DE\u9996\u9875" })] }) }));
}
//# sourceMappingURL=index.js.map