import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 设施区模块 - 点击全部设施打开详情抽屉
 */
import { useState, useRef } from 'react';
import RoomDetailDrawer from '../../../../pages/RoomDetail/homeStay';
import { CheckIcon, CrossIcon } from '../../../homestay/icons/FacilityIcons';
import { FACILITY_CATEGORIES } from '../../../../constants/facilities';
import styles from './index.module.scss';
const FacilitiesSection = ({ data, onOpenFullFacilities, }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const sectionRef = useRef(null);
    // 创建虚拟room对象用于显示设施信息
    const facilitiesRoom = {
        id: 'facilities',
        name: '所有设施',
        area: '',
        beds: '',
        guests: '',
        image: data?.images?.[0] || '',
        price: 0,
        priceNote: '',
        benefits: [],
        packageCount: 0,
    };
    const handleOpenAllFacilities = () => {
        setIsDrawerOpen(true);
        onOpenFullFacilities?.();
    };
    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };
    // 只显示服务、基础、卫浴三个类别，并优先显示有的设施，最多两行（6个）
    const displayCategories = FACILITY_CATEGORIES.filter((c) => ['service', 'basic', 'bathroom'].includes(c.id)).map((category) => {
        const sortedFacilities = [
            ...category.facilities.filter((f) => f.available),
            ...category.facilities.filter((f) => !f.available),
        ];
        return {
            ...category,
            facilities: sortedFacilities.slice(0, 6), // 每个分类最多显示 6 个设施
        };
    });
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: styles.facilitiesSection, ref: sectionRef, children: [_jsxs("div", { className: styles.header, children: [_jsx("h3", { className: styles.title, children: "\u670D\u52A1/\u8BBE\u65BD" }), _jsxs("button", { className: styles.viewAllBtn, onClick: handleOpenAllFacilities, children: ["\u5168\u90E8\u8BBE\u65BD ", _jsx("span", { className: styles.arrow, children: "\u203A" })] })] }), _jsx("div", { className: styles.content, children: _jsx("div", { className: styles.facilitiesList, children: displayCategories.map((category) => (_jsxs("div", { className: styles.categoryBlock, children: [_jsx("div", { className: styles.categoryName, children: category.name }), _jsx("div", { className: styles.itemsGrid, children: category.facilities.map((facility) => (_jsxs("div", { className: styles.facilityItem, children: [facility.available ? (_jsx(CheckIcon, { width: 18, height: 18, color: "#43ae4a" })) : (_jsx(CrossIcon, { width: 18, height: 18, color: "#d3d3d3" })), _jsx("span", { className: styles.itemName, children: facility.name })] }, facility.id))) })] }, category.id))) }) })] }), _jsx(RoomDetailDrawer, { room: isDrawerOpen ? facilitiesRoom : null, isOpen: isDrawerOpen, onClose: handleCloseDrawer, scrollToFacilities: true, facilitiesExpanded: true })] }));
};
export default FacilitiesSection;
//# sourceMappingURL=index.js.map