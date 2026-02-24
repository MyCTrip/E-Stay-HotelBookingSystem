import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 悬浮操作按钮 - 回到顶部、地图切换
 */
import { useState, useEffect } from 'react';
import styles from './index.module.scss';
const FloatingActionButtons = ({ scrollTop, containerHeight, containerScrollHeight, onScrollToTop, onToggleMap, showMapButton = false, }) => {
    const [showScrollTop, setShowScrollTop] = useState(false);
    // 滚动超过2屏时显示回到顶部按钮
    useEffect(() => {
        const twoScreenHeight = containerHeight * 2;
        setShowScrollTop(scrollTop > twoScreenHeight);
    }, [scrollTop, containerHeight]);
    if (!showScrollTop && !showMapButton)
        return null;
    return (_jsxs("div", { className: styles.floatingContainer, children: [showMapButton && (_jsx("button", { className: styles.floatingBtn, onClick: onToggleMap, title: "\u5207\u6362\u5730\u56FE", children: "\uD83D\uDDFA\uFE0F" })), showScrollTop && (_jsx("button", { className: styles.floatingBtn, onClick: onScrollToTop, title: "\u56DE\u5230\u9876\u90E8", children: "\u2191" }))] }));
};
export default FloatingActionButtons;
//# sourceMappingURL=index.js.map