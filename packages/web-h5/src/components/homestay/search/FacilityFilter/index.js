import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 设施筛选组件 - 内容only
 */
import { useState } from 'react';
import styles from './index.module.scss';
const facilityCategories = [
    {
        category: '热门筛选',
        facilities: [
            { label: '免费wifi', icon: '📶' },
            { label: '大床', icon: '🛏️' },
            { label: '付费停车位', icon: '🅿️' },
        ],
    },
    {
        category: '城市特色',
        facilities: [{ label: '城市特色', icon: '🏙️' }],
    },
    {
        category: '特色推荐',
        facilities: [{ label: '特色推荐', icon: '⭐' }],
    },
    {
        category: '服务',
        facilities: [
            { label: '无线网络', icon: '📡' },
            { label: '停车位', icon: '🅿️' },
        ],
    },
    {
        category: '点评',
        facilities: [{ label: '评价好', icon: '👍' }],
    },
    {
        category: '设施',
        facilities: [
            { label: '私家泳池', icon: '🏊' },
            { label: '观景浴缸', icon: '🛁️' },
            { label: '休闲庭院', icon: '🌳' },
            { label: '私汤', icon: '♨️' },
            { label: '温泉', icon: '🌊' },
            { label: '落地圆', icon: '⭕' },
            { label: '麻将机', icon: '🎰' },
            { label: '可做饭', icon: '🍳' },
        ],
    },
    {
        category: '房型',
        facilities: [{ label: '基础房型', icon: '🏠' }],
    },
];
const FacilityFilter = ({ selectedFacilities = [], onFacilitiesChange, onConfirm, }) => {
    const [selected, setSelected] = useState(new Set(selectedFacilities));
    const handleToggle = (facilityLabel) => {
        const newSelected = new Set(selected);
        if (newSelected.has(facilityLabel)) {
            newSelected.delete(facilityLabel);
        }
        else {
            newSelected.add(facilityLabel);
        }
        setSelected(newSelected);
        onFacilitiesChange?.(Array.from(newSelected));
    };
    const handleReset = () => {
        setSelected(new Set());
        onFacilitiesChange?.([]);
    };
    return (_jsxs("div", { className: styles.facilityFilter, children: [_jsx("div", { className: styles.facilities, children: facilityCategories.map((cat) => (_jsxs("div", { className: styles.facilityGroup, children: [_jsx("div", { className: styles.categoryLabel, children: cat.category }), _jsx("div", { className: styles.facilityGrid, children: cat.facilities.map((fac) => (_jsxs("button", { className: `${styles.facilityBtn} ${selected.has(fac.label) ? styles.selected : ''}`, onClick: () => handleToggle(fac.label), children: [_jsx("span", { className: styles.icon, children: fac.icon }), _jsx("span", { className: styles.label, children: fac.label })] }, fac.label))) })] }, cat.category))) }), _jsxs("div", { className: styles.footer, children: [_jsx("button", { className: styles.resetBtn, onClick: handleReset, children: "\u6E05\u7A7A" }), _jsx("button", { className: styles.confirmBtn, onClick: onConfirm, children: "\u786E\u8BA4" })] })] }));
};
export default FacilityFilter;
//# sourceMappingURL=index.js.map