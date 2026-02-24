import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import PropertyCardContainer from '../PropertyCardContainer';
import { AreaIcon, BedIcon, UserIcon, MapIcon, HouseIcon, StarIcon, PositionIcon } from '../../icons';
import styles from './index.module.scss';
/**
 * HotelInfo 内容组件 - 不包含容器样式
 */
const HotelInfoContent = ({ data }) => {
    // 安全处理 data 为 undefined 的情况
    if (!data) {
        return null;
    }
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: styles.headerRow, children: [_jsxs("div", { className: styles.left, children: [_jsx("h1", { className: styles.name, children: data.name }), _jsxs("div", { className: styles.badges, children: [_jsx("span", { className: styles.brand, children: data.brand }), _jsxs("span", { className: styles.stars, children: [_jsx(StarIcon, { width: 16, height: 16, color: "#fa7b1f" }), _jsx(StarIcon, { width: 16, height: 16, color: "#fa7b1f" }), _jsx(StarIcon, { width: 16, height: 16, color: "#fa7b1f" }), _jsx(StarIcon, { width: 16, height: 16, color: "#fa7b1f" })] })] })] }), _jsxs("div", { className: styles.right, children: [_jsx("div", { className: styles.rating, children: data.rating }), _jsx("div", { className: styles.ratingLabel, children: "\u5F88\u597D" }), _jsxs("div", { className: styles.reviewCount, children: [data.reviewCount, "\u6761\u8BC4\u4EF7"] })] })] }), _jsxs("div", { className: styles.locationRow, children: [_jsxs("div", { className: styles.address, children: [_jsx(PositionIcon, { width: 14, height: 14, color: "#8da5cd" }), _jsx("span", { children: data.address })] }), _jsxs("button", { className: styles.mapBtn, title: "\u67E5\u770B\u5730\u56FE", children: [_jsx(MapIcon, { width: 14, height: 14, color: "#333333" }), " \u5730\u56FE"] })] }), _jsxs("div", { className: styles.coreParamsCard, children: [_jsxs("div", { className: styles.paramItem, children: [_jsx("span", { className: styles.paramIcon, children: _jsx(AreaIcon, { width: 20, height: 20, color: "#333333" }) }), _jsx("span", { className: styles.paramValue, children: data.area })] }), _jsx("div", { className: styles.divider }), _jsxs("div", { className: styles.paramItem, children: [_jsx("span", { className: styles.paramIcon, children: _jsx(HouseIcon, { width: 20, height: 20, color: "#333333" }) }), _jsx("span", { className: styles.paramValue, children: data.room })] }), _jsx("div", { className: styles.divider }), _jsxs("div", { className: styles.paramItem, children: [_jsx("span", { className: styles.paramIcon, children: _jsx(BedIcon, { width: 20, height: 20, color: "#333333" }) }), _jsxs("span", { className: styles.paramValue, children: [data.bed, "\u5E8A"] })] }), _jsx("div", { className: styles.divider }), _jsxs("div", { className: styles.paramItem, children: [_jsx("span", { className: styles.paramIcon, children: _jsx(UserIcon, { width: 20, height: 20, color: "#333333" }) }), _jsxs("span", { className: styles.paramValue, children: [data.guests, "\u4EBA\u5165\u4F4F"] })] })] }), _jsx("div", { className: styles.highlightsRow, children: _jsx("div", { className: styles.highlights, children: data.tags?.map((tag, idx) => (_jsx("span", { className: styles.tag, children: tag }, idx))) }) })] }));
};
const HotelInfo = ({ data }) => {
    return (_jsx("div", { style: { position: 'relative', top: '-140px', zIndex: 10 }, children: _jsx(PropertyCardContainer, { headerConfig: {
                show: false, // HotelInfo 不使用 Header
            }, children: _jsx(HotelInfoContent, { data: data }) }) }));
};
export default HotelInfo;
//# sourceMappingURL=index.js.map