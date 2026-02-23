import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './index.module.scss';
const sortOptions = [
    { label: '欢迎度排序', value: 'smart' },
    { label: '好评优先', value: 'ratingDesc' },
    { label: '点评数多一少', value: 'distanceAsc' },
    { label: '低价优先', value: 'priceAsc' },
    { label: '高价优先', value: 'priceDesc' },
];
const SortFilter = ({ sortBy, onSortChange }) => {
    return (_jsx("div", { className: styles.sortFilter, children: sortOptions.map((option) => (_jsxs("div", { className: `${styles.option} ${sortBy === option.value ? styles.selected : ''}`, onClick: () => onSortChange(option.value), children: [_jsx("span", { className: styles.label, children: option.label }), sortBy === option.value && (_jsx("svg", { className: styles.checkmark, viewBox: "0 0 24 24", width: "24", height: "24", fill: "none", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M5 13l4 4L19 7" }) }))] }, option.value))) }));
};
export default SortFilter;
//# sourceMappingURL=index.js.map