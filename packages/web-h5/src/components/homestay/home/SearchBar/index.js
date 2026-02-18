import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 搜索栏组件 - Web H5版本
 * 复刻携程民宿搜索栏样式
 */
import React from 'react';
import styles from './index.module.scss';
const SearchBar = ({ location = '上海', checkIn = '2月17', onFieldClick, scrollTop = 0, isTransparent = false, }) => {
    // 根据滚动位置调整背景透明度
    const opacity = isTransparent ? 0 : Math.min(scrollTop / 80, 1);
    const hasBlur = opacity > 0.3;
    const containerStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: `rgba(255, 255, 255, ${0.8 + opacity * 0.2})`,
        backdropFilter: hasBlur ? 'blur(10px)' : 'none',
        borderBottom: opacity > 0.5 ? '1px solid #f0f0f0' : 'none',
        transition: 'all 0.3s ease',
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
    };
    return (_jsx("div", { style: containerStyle, className: styles.container, children: _jsxs("div", { className: styles.inner, children: [_jsxs("div", { className: styles.citySection, onClick: () => onFieldClick?.('location'), children: [_jsx("div", { className: styles.cityLabel, children: "\u76EE\u7684\u5730" }), _jsx("div", { className: styles.cityValue, children: location })] }), _jsxs("div", { className: styles.dateSection, onClick: () => onFieldClick?.('date'), children: [_jsx("div", { className: styles.dateLabel, children: "\u5165\u4F4F" }), _jsx("div", { className: styles.dateValue, children: checkIn })] }), _jsx("button", { className: styles.searchBtn, onClick: () => onFieldClick?.('location'), children: _jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("circle", { cx: "11", cy: "11", r: "8" }), _jsx("path", { d: "m21 21-4.35-4.35" })] }) })] }) }));
};
export default React.memo(SearchBar);
//# sourceMappingURL=index.js.map