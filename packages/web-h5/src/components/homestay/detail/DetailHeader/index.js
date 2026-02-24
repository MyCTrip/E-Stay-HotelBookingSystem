import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 详情页顶部操作栏 - 固定吸顶
 * 初始透明，滚动超过图片区时变为不透明白色
 */
import React, { forwardRef } from 'react';
import styles from './index.module.scss';
const DetailHeader = forwardRef(({ opacity = 0, onCollectionChange, onShare, onContactHost }, ref) => {
    const [isCollected, setIsCollected] = React.useState(false);
    const handleCollect = () => {
        setIsCollected(!isCollected);
        onCollectionChange?.();
    };
    const handleContactHost = () => {
        onContactHost?.();
    };
    // 图标颜色：opacity小时为白色，大时为深灰
    const iconColor = opacity > 0.5 ? '#333' : '#fff';
    const bgOpacity = Math.min(opacity, 1);
    return (_jsxs("div", { ref: ref, className: styles.header, style: {
            backgroundColor: `rgba(255, 255, 255, ${bgOpacity})`,
            borderBottomColor: `rgba(240, 240, 240, ${bgOpacity})`,
        }, children: [_jsx("button", { className: styles.iconBtn, onClick: () => window.history.back(), title: "\u8FD4\u56DE", children: _jsx("span", { style: { color: iconColor }, children: "\u2039" }) }), _jsxs("div", { className: styles.actionGroup, children: [_jsx("button", { className: styles.iconBtn, onClick: handleContactHost, title: "\u4E0E\u623F\u4E1C\u8054\u7CFB", children: _jsx("span", { style: { color: iconColor }, children: "\uD83D\uDCAC" }) }), _jsx("button", { className: styles.iconBtn, onClick: onShare, title: "\u5206\u4EAB", children: _jsx("span", { style: { color: iconColor }, children: "\u2934" }) }), _jsx("button", { className: `${styles.iconBtn} ${isCollected ? styles.collected : ''}`, onClick: handleCollect, title: isCollected ? '已收藏' : '收藏', children: _jsx("span", { style: { color: isCollected ? '#FF6B6B' : iconColor }, children: isCollected ? '♥' : '♡' }) })] })] }));
});
DetailHeader.displayName = 'DetailHeader';
export default DetailHeader;
//# sourceMappingURL=index.js.map