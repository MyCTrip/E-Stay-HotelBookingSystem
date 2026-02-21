import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AreaIcon, BedIcon, UserIcon, MapIcon, HouseIcon, StarIcon } from '../../icons';
import styles from './index.module.scss';
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
    return (_jsxs("div", { className: styles.infoCard, children: [_jsxs("div", { className: styles.headerRow, children: [_jsxs("div", { className: styles.left, children: [_jsx("h1", { className: styles.name, children: name }), _jsxs("div", { className: styles.badges, children: [_jsx("span", { className: styles.brand, children: brand }), _jsxs("span", { className: styles.stars, children: [_jsx(StarIcon, { width: 16, height: 16, color: "#fa7b1f" }), _jsx(StarIcon, { width: 16, height: 16, color: "#fa7b1f" }), _jsx(StarIcon, { width: 16, height: 16, color: "#fa7b1f" }), _jsx(StarIcon, { width: 16, height: 16, color: "#fa7b1f" })] })] })] }), _jsxs("div", { className: styles.right, children: [_jsx("div", { className: styles.rating, children: rating }), _jsx("div", { className: styles.ratingLabel, children: "\u5F88\u597D" }), _jsxs("div", { className: styles.reviewCount, children: [reviewCount, "\u6761\u8BC4\u4EF7"] })] })] }), _jsxs("div", { className: styles.locationRow, children: [_jsxs("div", { className: styles.address, children: [_jsx("svg", { viewBox: "0 0 1024 1024", version: "1.1", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", width: "14", height: "14", children: _jsx("path", { d: "M513.024 1024h-1.024c-17.92 0-34.816-7.168-47.104-20.48-9.728-10.24-97.28-102.912-184.832-219.648C162.304 625.664 102.4 499.2 102.4 409.088 102.4 183.296 286.208 0 512 0s409.6 183.296 409.6 409.088c0 54.784-20.992 121.856-62.976 199.68-39.936 74.752-100.352 161.792-179.712 258.048l-0.512 0.512-117.76 134.144c-11.776 14.336-29.184 22.528-47.616 22.528z m-1.024-423.936c105.984 0 191.488-86.016 191.488-191.488S617.984 217.6 512 217.6 320 303.104 320 409.088s86.016 190.976 192 190.976z", fill: "#333333" }) }), _jsx("span", { children: location })] }), _jsxs("button", { className: styles.mapBtn, title: "\u67E5\u770B\u5730\u56FE", children: [_jsx(MapIcon, { width: 14, height: 14, color: "#333333" }), " \u5730\u56FE"] })] }), _jsxs("div", { className: styles.coreParamsCard, children: [_jsxs("div", { className: styles.paramItem, children: [_jsx("span", { className: styles.paramIcon, children: _jsx(AreaIcon, { width: 20, height: 20, color: "#333333" }) }), _jsx("span", { className: styles.paramValue, children: coreParams.area }), _jsx("span", { className: styles.paramLabel, children: "\u9762\u79EF" })] }), _jsx("div", { className: styles.divider }), _jsxs("div", { className: styles.paramItem, children: [_jsx("span", { className: styles.paramIcon, children: _jsx(HouseIcon, { width: 20, height: 20, color: "#333333" }) }), _jsx("span", { className: styles.paramValue, children: coreParams.rooms }), _jsx("span", { className: styles.paramLabel, children: "\u623F\u95F4" })] }), _jsx("div", { className: styles.divider }), _jsxs("div", { className: styles.paramItem, children: [_jsx("span", { className: styles.paramIcon, children: _jsx(BedIcon, { width: 20, height: 20, color: "#333333" }) }), _jsx("span", { className: styles.paramValue, children: coreParams.beds }), _jsx("span", { className: styles.paramLabel, children: "\u5E8A\u4F4D" })] }), _jsx("div", { className: styles.divider }), _jsxs("div", { className: styles.paramItem, children: [_jsx("span", { className: styles.paramIcon, children: _jsx(UserIcon, { width: 20, height: 20, color: "#333333" }) }), _jsx("span", { className: styles.paramValue, children: coreParams.guests }), _jsx("span", { className: styles.paramLabel, children: "\u4EBA\u6570" })] })] }), _jsx("div", { className: styles.highlightsRow, children: _jsx("div", { className: styles.highlights, children: highlights.map((highlight, idx) => (_jsx("span", { className: styles.tag, children: highlight }, idx))) }) })] }));
};
export default HotelInfo;
//# sourceMappingURL=index.js.map