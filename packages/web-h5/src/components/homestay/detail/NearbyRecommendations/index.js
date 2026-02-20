import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './index.module.scss';
const NearbyRecommendations = ({ location = '上海市黄浦区中福城三期北楼', }) => {
    const locationData = {
        fullAddress: '上海市黄浦区中福城三期北楼-正门',
        detailAddress: '上海黄浦区中福城三期北楼-正门(广西北路汉口路...',
        community: '中福城',
        belongsTo: '人民广场地区',
        buildAge: '2002-2005年',
        buildType: '住宅',
    };
    const transportations = [
        {
            name: '人民广场地铁站',
            distance: { value: 235, unit: 'm' },
            rating: 4.8,
            type: '交通',
            icon: '🚇',
        },
        {
            name: '南京东路地铁站',
            distance: { value: 697, unit: 'm' },
            rating: 4.6,
            type: '交通',
            icon: '🚇',
        },
        {
            name: '上海火车站',
            distance: { value: 2.7, unit: 'km' },
            rating: 4.5,
            type: '交通',
            icon: '🚄',
        },
        {
            name: '上海虹桥国际机场',
            distance: { value: 14, unit: 'km' },
            rating: 4.7,
            type: '交通',
            icon: '✈️',
        },
    ];
    const attractions = [
        {
            name: '东方明珠',
            distance: { value: 1.5, unit: 'km' },
            rating: 4.9,
            type: '景点',
            icon: '🏛️',
        },
        {
            name: '外滩',
            distance: { value: 2.2, unit: 'km' },
            rating: 4.8,
            type: '景点',
            icon: '🏛️',
        },
    ];
    const restaurants = [
        {
            name: '上海波特曼丽思卡尔顿',
            distance: { value: 2.6, unit: 'km' },
            rating: 4.7,
            type: '美食',
            icon: '🍽️',
        },
        {
            name: '上海浦福土广场',
            distance: { value: 190, unit: 'm' },
            rating: 4.5,
            type: '美食',
            icon: '🍽️',
        },
    ];
    const formatDistance = (dist) => {
        return `${dist.value}${dist.unit}`;
    };
    return (_jsxs("div", { className: styles.section, children: [_jsxs("div", { className: styles.header, children: [_jsx("h2", { className: styles.title, children: "\u4F4D\u7F6E\u5468\u8FB9" }), _jsx("a", { href: "#", className: styles.mapLink, children: "\u5730\u56FE/\u5468\u8FB9 \u203A" })] }), _jsxs("div", { className: styles.addressBlock, children: [_jsxs("div", { className: styles.addressItem, children: [_jsx("span", { className: styles.label, children: "\u5B8C\u6574\u5730\u5740" }), _jsx("span", { className: styles.address, children: locationData.fullAddress })] }), _jsx("p", { className: styles.detailAddress, children: locationData.detailAddress }), _jsxs("div", { className: styles.detailsGrid, children: [_jsxs("div", { className: styles.detailItem, children: [_jsx("span", { className: styles.label, children: "\u5C0F\u533A\u540D\u79F0" }), _jsx("span", { className: styles.value, children: locationData.community })] }), _jsxs("div", { className: styles.detailItem, children: [_jsx("span", { className: styles.label, children: "\u6240\u5C5E\u5546\u5708" }), _jsx("span", { className: styles.value, children: locationData.belongsTo })] }), _jsxs("div", { className: styles.detailItem, children: [_jsx("span", { className: styles.label, children: "\u5EFA\u7B51\u5E74\u4EE3" }), _jsx("span", { className: styles.value, children: locationData.buildAge })] }), _jsxs("div", { className: styles.detailItem, children: [_jsx("span", { className: styles.label, children: "\u5C0F\u533A\u7C7B\u578B" }), _jsx("span", { className: styles.value, children: locationData.buildType })] })] }), _jsx("div", { className: styles.mapContainer, children: _jsx("div", { className: styles.mapPlaceholder, children: "\uD83D\uDCCD \u5730\u56FE\u52A0\u8F7D\u4E2D..." }) })] }), _jsxs("div", { className: styles.transportSection, children: [_jsx("h3", { className: styles.sectionTitle, children: "\u4EA4\u901A" }), _jsx("div", { className: styles.itemList, children: transportations.map((item, idx) => (_jsxs("div", { className: styles.listItem, children: [_jsx("span", { className: styles.icon, children: item.icon }), _jsxs("div", { className: styles.itemInfo, children: [_jsx("h4", { className: styles.itemName, children: item.name }), _jsxs("div", { className: styles.meta, children: [_jsxs("span", { className: styles.distance, children: ["\u76F4\u7EBF\u8DDD\u79BB ", formatDistance(item.distance)] }), _jsx("span", { className: styles.separator, children: "\u2022" }), _jsxs("span", { className: styles.rating, children: ["\u2B50 ", item.rating] })] })] })] }, idx))) })] }), _jsxs("div", { className: styles.attractionsSection, children: [_jsx("h3", { className: styles.sectionTitle, children: "\u666F\u70B9" }), _jsx("div", { className: styles.itemList, children: attractions.map((item, idx) => (_jsxs("div", { className: styles.listItem, children: [_jsx("span", { className: styles.icon, children: item.icon }), _jsxs("div", { className: styles.itemInfo, children: [_jsx("h4", { className: styles.itemName, children: item.name }), _jsxs("div", { className: styles.meta, children: [_jsxs("span", { className: styles.distance, children: ["\u76F4\u7EBF ", formatDistance(item.distance)] }), _jsx("span", { className: styles.separator, children: "\u2022" }), _jsxs("span", { className: styles.rating, children: ["\u2B50 ", item.rating] })] })] })] }, idx))) })] }), _jsxs("div", { className: styles.foodSection, children: [_jsx("h3", { className: styles.sectionTitle, children: "\u901B\u5403" }), _jsx("div", { className: styles.itemList, children: restaurants.map((item, idx) => (_jsxs("div", { className: styles.listItem, children: [_jsx("span", { className: styles.icon, children: item.icon }), _jsxs("div", { className: styles.itemInfo, children: [_jsx("h4", { className: styles.itemName, children: item.name }), _jsxs("div", { className: styles.meta, children: [_jsxs("span", { className: styles.distance, children: ["\u76F4\u7EBF ", formatDistance(item.distance)] }), _jsx("span", { className: styles.separator, children: "\u2022" }), _jsxs("span", { className: styles.rating, children: ["\u2B50 ", item.rating] })] })] })] }, idx))) })] })] }));
};
export default NearbyRecommendations;
//# sourceMappingURL=index.js.map