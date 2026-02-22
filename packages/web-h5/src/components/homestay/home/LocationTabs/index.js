import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 地点分类tabs组件 - Web H5版本
 * 国内 / 海外 / 周租·旅居
 */
import React, { useState } from 'react';
import styles from './index.module.scss';
const TABS = [
    { id: 'domestic', label: '国内' },
    { id: 'overseas', label: '海外' },
    { id: 'weekly', label: '周租·旅居' },
];
const LocationTabs = ({ activeTab = 'domestic', onChange }) => {
    const [active, setActive] = useState(activeTab);
    const handleTabClick = (tab) => {
        setActive(tab);
        onChange?.(tab);
    };
    return (_jsx("div", { className: styles.container, children: _jsx("div", { className: styles.tabsWrapper, children: TABS.map((tab) => (_jsxs("div", { className: `${styles.tab} ${active === tab.id ? styles.active : ''}`, onClick: () => handleTabClick(tab.id), children: [_jsx("span", { className: styles.label, children: tab.label }), active === tab.id && _jsx("div", { className: styles.underline })] }, tab.id))) }) }));
};
export default React.memo(LocationTabs);
//# sourceMappingURL=index.js.map