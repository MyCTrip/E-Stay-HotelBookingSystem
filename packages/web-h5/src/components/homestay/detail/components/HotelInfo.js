import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './HotelInfo.module.scss';
const HotelInfo = ({ data }) => {
    // 模拟品牌/星级
    const brand = '精选';
    const highlights = ['复式loft房', '可带宠物', '有停车位', '24小时前台'];
    const promotions = ['新用户立减¥100', '会员优惠20%'];
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
    const price = data?.price || 1280;
    return (_jsxs("div", { className: styles.infoCard, children: [_jsxs("div", { className: styles.headerRow, children: [_jsxs("div", { className: styles.left, children: [_jsx("h1", { className: styles.name, children: name }), _jsxs("div", { className: styles.badges, children: [_jsx("span", { className: styles.brand, children: brand }), _jsx("span", { className: styles.stars, children: "\u2B50\u2B50\u2B50\u2B50" })] })] }), _jsxs("div", { className: styles.right, children: [_jsx("div", { className: styles.rating, children: rating }), _jsx("div", { className: styles.ratingLabel, children: "\u5F88\u597D" }), _jsxs("div", { className: styles.reviewCount, children: [reviewCount, "\u6761\u8BC4\u4EF7"] })] })] }), _jsxs("div", { className: styles.locationRow, children: [_jsxs("span", { className: styles.address, children: ["\uD83D\uDCCD ", location] }), _jsx("button", { className: styles.mapBtn, title: "\u67E5\u770B\u5730\u56FE", children: "\uD83D\uDDFA\uFE0F \u5730\u56FE" })] }), _jsxs("div", { className: styles.coreParamsCard, children: [_jsxs("div", { className: styles.paramItem, children: [_jsx("span", { className: styles.paramIcon, children: "\uD83D\uDCD0" }), _jsx("span", { className: styles.paramValue, children: coreParams.area }), _jsx("span", { className: styles.paramLabel, children: "\u9762\u79EF" })] }), _jsx("div", { className: styles.divider }), _jsxs("div", { className: styles.paramItem, children: [_jsx("span", { className: styles.paramIcon, children: "\uD83D\uDEAA" }), _jsx("span", { className: styles.paramValue, children: coreParams.rooms }), _jsx("span", { className: styles.paramLabel, children: "\u623F\u95F4" })] }), _jsx("div", { className: styles.divider }), _jsxs("div", { className: styles.paramItem, children: [_jsx("span", { className: styles.paramIcon, children: "\uD83D\uDECF\uFE0F" }), _jsx("span", { className: styles.paramValue, children: coreParams.beds }), _jsx("span", { className: styles.paramLabel, children: "\u5E8A\u4F4D" })] }), _jsx("div", { className: styles.divider }), _jsxs("div", { className: styles.paramItem, children: [_jsx("span", { className: styles.paramIcon, children: "\uD83D\uDC65" }), _jsx("span", { className: styles.paramValue, children: coreParams.guests }), _jsx("span", { className: styles.paramLabel, children: "\u4EBA\u6570" })] })] }), _jsxs("div", { className: styles.priceRow, children: [_jsx("span", { className: styles.priceLabel, children: "\u8D77\u4EF7" }), _jsxs("div", { className: styles.priceBlock, children: [_jsxs("span", { className: styles.price, children: ["\u00A5", price] }), _jsx("span", { className: styles.unit, children: "/\u665A" })] })] }), _jsx("div", { className: styles.highlightsRow, children: _jsx("div", { className: styles.highlights, children: highlights.map((highlight, idx) => (_jsx("span", { className: styles.tag, children: highlight }, idx))) }) }), _jsx("div", { className: styles.promoRow, children: promotions.map((promo, idx) => (_jsxs("div", { className: styles.promoItem, children: [_jsx("span", { className: styles.promoIcon, children: "\uD83C\uDF89" }), _jsx("span", { className: styles.promoText, children: promo }), idx === 0 && _jsx("button", { className: styles.detailBtn, children: "\u8BE6\u60C5" })] }, idx))) })] }));
};
export default HotelInfo;
//# sourceMappingURL=HotelInfo.js.map