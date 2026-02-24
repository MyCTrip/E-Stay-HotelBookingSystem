import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 设施区模块 - 点击全部设施打开详情抽屉
 */
import { useState } from 'react';
import PropertyCardContainer from '../PropertyCardContainer';
import RoomDetailDrawer from '../../../../pages/RoomDetail/homeStay';
import { CheckIcon, CrossIcon } from '../../../homestay/icons/FacilityIcons';
import styles from './index.module.scss';
/**
 * FacilitiesSection 内容组件
 */
const FacilitiesSectionContent = ({ facilities = [] }) => {
    // 安全处理 facilities，如果为 undefined 则使用空数组
    const safelyFacilities = Array.isArray(facilities) ? facilities : [];
    // 只显示服务、基础、卫浴三个类别，并优先显示有的设施，最多两行（6个）
    const displayCategories = safelyFacilities.filter((c) => ['service', 'basic', 'bathroom'].includes(c.id)).map((category) => {
        const sortedFacilities = [
            ...category.facilities.filter((f) => f.available),
            ...category.facilities.filter((f) => !f.available),
        ];
        return {
            ...category,
            facilities: sortedFacilities.slice(0, 6), // 每个分类最多显示 6 个设施
        };
    });
    return (_jsx("div", { className: styles.facilitiesList, children: displayCategories.map((category) => (_jsxs("div", { className: styles.categoryBlock, children: [_jsx("div", { className: styles.categoryName, children: category.name }), _jsx("div", { className: styles.itemsGrid, children: category.facilities.map((facility) => (_jsxs("div", { className: styles.facilityItem, children: [facility.available ? (_jsx(CheckIcon, { width: 18, height: 18, color: "#43ae4a" })) : (_jsx(CrossIcon, { width: 18, height: 18, color: "#d3d3d3" })), _jsx("span", { className: styles.itemName, children: facility.name })] }, facility.id))) })] }, category.id))) }));
};
const FacilitiesSection = ({ facilities, policiesData, feeInfoData }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const handleOpenAllFacilities = () => {
        setIsDrawerOpen(true);
    };
    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };
    return (_jsxs(_Fragment, { children: [_jsx(PropertyCardContainer, { headerConfig: {
                    show: true,
                    title: {
                        text: '服务/设施',
                        show: true,
                    },
                    textButton: {
                        text: '全部设施',
                        show: true,
                        onClick: handleOpenAllFacilities,
                    },
                }, children: _jsx(FacilitiesSectionContent, { facilities: facilities }) }), _jsx(RoomDetailDrawer, { room: isDrawerOpen ? { id: 'facilities', name: '所有设施', area: '', beds: '', guests: '', image: '', priceList: [], priceNote: '', benefits: [], packageCount: 0 } : null, isOpen: isDrawerOpen, onClose: handleCloseDrawer, scrollToFacilities: true, facilitiesExpanded: true, policiesData: policiesData, feeInfoData: feeInfoData })] }));
};
export default FacilitiesSection;
//# sourceMappingURL=index.js.map