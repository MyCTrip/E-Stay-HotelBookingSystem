import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 搜索栏组件 - Web H5版本
 */
import React from 'react';
import styles from './index.module.scss';
const SearchBar = ({ location = '上海', onSearch, onClick, fixed = true, scrollTop = 0, }) => {
    // 计算透明度：滚动超过100px时变为不透明
    const opacity = Math.min(scrollTop / 100, 1);
    const backgroundColor = `rgba(255, 255, 255, ${0.5 + opacity * 0.5})`;
    const handleClick = () => {
        onClick?.();
    };
    const handleSearchClick = (e) => {
        e.stopPropagation();
        onSearch?.();
    };
    const containerStyle = {
        position: fixed ? 'fixed' : 'static',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor,
        backdropFilter: 'blur(8px)',
        transition: 'background-color 0.3s ease',
    };
    return (_jsx("div", { style: containerStyle, className: styles.container, children: _jsx("div", { className: styles.wrapper, children: _jsxs("div", { className: styles.searchBox, onClick: handleClick, children: [_jsxs("div", { className: styles.locationInfo, children: ["\uD83D\uDCCD", _jsx("span", { className: styles.location, children: location })] }), _jsx("div", { className: styles.placeholder, children: _jsx("span", { children: "\u4F4D\u7F6E/\u6C11\u5BBF/\u7F16\u53F7" }) }), _jsx("div", { className: styles.searchIcon, onClick: handleSearchClick, children: "\uD83D\uDD0D" })] }) }) }));
};
export default React.memo(SearchBar);
//# sourceMappingURL=index.js.map