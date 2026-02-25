import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './FacilityFilter.module.scss';
const FACILITY_OPTIONS = [
    { id: 'wifi', label: '🛜 WiFi' },
    { id: 'kitchen', label: '🍳 厨房' },
    { id: 'parking', label: '🅿️ 停车位' },
    { id: 'washer', label: '🧺 洗衣机' },
    { id: 'ac', label: '❄️ 空调' },
    { id: 'heating', label: '🔥 暖气' },
    { id: 'tv', label: '📺 电视' },
    { id: 'elevator', label: '🛗 电梯' },
    { id: 'balcony', label: '🪟 阳台' },
    { id: 'pet', label: '🐕 宠物友好' },
    { id: 'smoking', label: '🚭 无烟' },
    { id: 'air_purifier', label: '💨 空气净化器' },
];
const FacilityFilter = ({ selectedFacilities = [], onChange, }) => {
    const handleFacilityChange = (id) => {
        let newFacilities;
        if (selectedFacilities.includes(id)) {
            newFacilities = selectedFacilities.filter(f => f !== id);
        }
        else {
            newFacilities = [...selectedFacilities, id];
        }
        onChange?.(newFacilities);
    };
    const handleReset = () => {
        onChange?.([]);
    };
    return (_jsxs("div", { className: styles.facilityFilter, children: [_jsxs("div", { className: styles.header, children: [_jsx("h4", { className: styles.title, children: "\u8BBE\u65BD\u548C\u670D\u52A1" }), selectedFacilities.length > 0 && (_jsx("button", { className: styles.resetBtn, onClick: handleReset, children: "\u91CD\u7F6E" }))] }), _jsx("div", { className: styles.facilityGrid, children: FACILITY_OPTIONS.map((facility) => (_jsxs("button", { className: `${styles.facilityItem} ${selectedFacilities.includes(facility.id) ? styles.selected : ''}`, onClick: () => handleFacilityChange(facility.id), children: [_jsx("span", { className: styles.label, children: facility.label }), selectedFacilities.includes(facility.id) && (_jsx("span", { className: styles.checkmark, children: "\u2713" }))] }, facility.id))) })] }));
};
export default FacilityFilter;
//# sourceMappingURL=FacilityFilter.js.map