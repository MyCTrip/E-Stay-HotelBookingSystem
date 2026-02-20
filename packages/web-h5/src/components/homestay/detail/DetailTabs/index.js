import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './index.module.scss';
const tabs = [
    { key: 'rooms', label: '房型' },
    { key: 'facilities', label: '设施' },
    { key: 'reviews', label: '评价' },
    { key: 'policies', label: '政策' },
    { key: 'nearby', label: '周边' },
];
const DetailTabs = ({ activeTab, onChange }) => {
    return (_jsx("div", { className: styles.tabsWrapper, children: _jsx("div", { className: styles.tabs, children: tabs.map((tab) => (_jsxs("button", { className: `${styles.tab} ${activeTab === tab.key ? styles.active : ''}`, onClick: () => onChange(tab.key), children: [_jsx("span", { className: styles.label, children: tab.label }), activeTab === tab.key && _jsx("div", { className: styles.underline })] }, tab.key))) }) }));
};
export default DetailTabs;
//# sourceMappingURL=index.js.map