import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './FacilitiesSection.module.scss';
const facilities = [
    { name: '停车位', icon: '🅿️' },
    { name: '冷藏空调', icon: '❄️' },
    { name: '电梯', icon: '🛗' },
    { name: '卧室', icon: '🛏️' },
    { name: '厨房', icon: '🍳' },
    { name: '冰箱', icon: '❄️' },
    { name: '洗衣机', icon: '🧺' },
    { name: '行李寄存', icon: '🧳' },
    { name: '大客厅', icon: '🛋️' },
    { name: '热水', icon: '🚿' },
    { name: '麻将机', icon: '🎰' },
    { name: '一次性毛巾', icon: '🧴' },
];
const FacilitiesSection = ({ data }) => {
    return (_jsxs("div", { className: styles.section, children: [_jsx("h2", { className: styles.title, children: "\u8BBE\u65BD&\u670D\u52A1" }), _jsx("p", { className: styles.total, children: "\u517147\u9879\u8BBE\u65BD" }), _jsx("div", { className: styles.grid, children: facilities.map((fac, idx) => (_jsxs("div", { className: styles.item, children: [_jsx("span", { className: styles.icon, children: fac.icon }), _jsx("span", { className: styles.name, children: fac.name })] }, idx))) }), _jsx("button", { className: styles.viewAll, children: "\u67E5\u770B\u5168\u90E847\u9879\u8BBE\u65BD" })] }));
};
export default FacilitiesSection;
//# sourceMappingURL=FacilitiesSection.js.map