import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 房型详情 - 设施与服务信息
 */
import { useState, useEffect, forwardRef } from 'react';
import { CheckIcon, CrossIcon } from '../../../icons/FacilityIcons';
import { FACILITY_CATEGORIES } from '../../../../../constants/facilities';
import styles from './index.module.scss';
const RoomDrawerFacilities = forwardRef(({ expandedInitially = false, onClose, }, ref) => {
    const [isExpanded, setIsExpanded] = useState(expandedInitially);
    // 同步 expandedInitially 的变化
    useEffect(() => {
        setIsExpanded(expandedInitially);
    }, [expandedInitially]);
    // 展开时显示所有分类，收起时只显示基础、卫浴、厨房
    const visibleCategories = isExpanded
        ? FACILITY_CATEGORIES
        : FACILITY_CATEGORIES.filter((c) => ['basic', 'bathroom', 'kitchen'].includes(c.id));
    return (_jsxs("div", { className: styles.facilitiesContainer, ref: ref, children: [_jsx("h3", { className: styles.title, children: "\u8BBE\u65BD/\u670D\u52A1" }), _jsx("div", { className: styles.facilitiesList, children: visibleCategories.map((category) => (_jsxs("div", { className: styles.categoryBlock, children: [_jsx("div", { className: styles.categoryName, children: category.name }), _jsx("div", { className: styles.itemsGrid, children: category.facilities.map((facility) => (_jsxs("div", { className: styles.facilityItem, children: [facility.available ? (_jsx(CheckIcon, { width: 18, height: 18, color: "#43ae4a" })) : (_jsx(CrossIcon, { width: 18, height: 18, color: "#d3d3d3" })), _jsx("span", { className: styles.itemName, children: facility.name })] }, facility.id))) })] }, category.id))) }), _jsx("div", { className: styles.expandFooter, children: _jsxs("button", { className: styles.expandBtn, onClick: () => setIsExpanded(!isExpanded), children: [isExpanded ? '收起全部设施' : '展开全部设施', " ", _jsx("span", { className: styles.arrow, children: "\u203A" })] }) })] }));
});
RoomDrawerFacilities.displayName = 'RoomDrawerFacilities';
export default RoomDrawerFacilities;
//# sourceMappingURL=index.js.map