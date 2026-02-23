import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import PropertyCardContainer from '../PropertyCardContainer';
import { AreaIcon, BedIcon, UserIcon, MapIcon, HouseIcon, StarIcon, PositionIcon } from '../../icons';
import styles from './index.module.scss';
/**
 * HotelInfo 内容组件 - 不包含容器样式
 */
const HotelInfoContent = ({ data }) => {
    // 模拟品牌/星级
    const brand = '精选';
    const highlights = ['复式loft房', '可带宠物', '有停车位', '24小时前台'];
    // 核心参数（规范化展示）
    const coreParams = {
        area: '190㎡',
        rooms: '3间卧室',
        beds: '5张床',
        guests: '12人',
    };
    // 获取基础信息
    const name = data?.baseInfo?.nameCn || '民宿名称';
    const rating = data?.baseInfo?.star || 4.9;
    const reviewCount = data?.baseInfo?.reviewCount || 128;
    const location = data?.baseInfo?.address || '城市位置';
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: styles.headerRow, children: [_jsxs("div", { className: styles.left, children: [_jsx("h1", { className: styles.name, children: name }), _jsxs("div", { className: styles.badges, children: [_jsx("span", { className: styles.brand, children: brand }), _jsxs("span", { className: styles.stars, children: [_jsx(StarIcon, { width: 16, height: 16, color: "#fa7b1f" }), _jsx(StarIcon, { width: 16, height: 16, color: "#fa7b1f" }), _jsx(StarIcon, { width: 16, height: 16, color: "#fa7b1f" }), _jsx(StarIcon, { width: 16, height: 16, color: "#fa7b1f" })] })] })] }), _jsxs("div", { className: styles.right, children: [_jsx("div", { className: styles.rating, children: rating }), _jsx("div", { className: styles.ratingLabel, children: "\u5F88\u597D" }), _jsxs("div", { className: styles.reviewCount, children: [reviewCount, "\u6761\u8BC4\u4EF7"] })] })] }), _jsxs("div", { className: styles.locationRow, children: [_jsxs("div", { className: styles.address, children: [_jsx(PositionIcon, { width: 14, height: 14, color: "#8da5cd" }), _jsx("span", { children: location })] }), _jsxs("button", { className: styles.mapBtn, title: "\u67E5\u770B\u5730\u56FE", children: [_jsx(MapIcon, { width: 14, height: 14, color: "#333333" }), " \u5730\u56FE"] })] }), _jsxs("div", { className: styles.coreParamsCard, children: [_jsxs("div", { className: styles.paramItem, children: [_jsx("span", { className: styles.paramIcon, children: _jsx(AreaIcon, { width: 20, height: 20, color: "#333333" }) }), _jsx("span", { className: styles.paramValue, children: coreParams.area })] }), _jsx("div", { className: styles.divider }), _jsxs("div", { className: styles.paramItem, children: [_jsx("span", { className: styles.paramIcon, children: _jsx(HouseIcon, { width: 20, height: 20, color: "#333333" }) }), _jsx("span", { className: styles.paramValue, children: coreParams.rooms })] }), _jsx("div", { className: styles.divider }), _jsxs("div", { className: styles.paramItem, children: [_jsx("span", { className: styles.paramIcon, children: _jsx(BedIcon, { width: 20, height: 20, color: "#333333" }) }), _jsx("span", { className: styles.paramValue, children: coreParams.beds })] }), _jsx("div", { className: styles.divider }), _jsxs("div", { className: styles.paramItem, children: [_jsx("span", { className: styles.paramIcon, children: _jsx(UserIcon, { width: 20, height: 20, color: "#333333" }) }), _jsx("span", { className: styles.paramValue, children: coreParams.guests })] })] }), _jsx("div", { className: styles.highlightsRow, children: _jsx("div", { className: styles.highlights, children: highlights.map((highlight, idx) => (_jsx("span", { className: styles.tag, children: highlight }, idx))) }) })] }));
};
const HotelInfo = ({ data }) => {
    return (_jsx("div", { style: { position: 'relative', top: '-140px', zIndex: 10 }, children: _jsx(PropertyCardContainer, { headerConfig: {
                show: false, // HotelInfo 不使用 Header
            }, children: _jsx(HotelInfoContent, { data: data }) }) }));
};
export default HotelInfo;
//# sourceMappingURL=index.js.map