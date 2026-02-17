import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './RoomDrawerFacilities.module.scss';
// 分类设施数据
const facilitiesData = [
    {
        category: '服务和便利',
        icon: '🛎️',
        items: [
            { name: '门房/传达', icon: '🚪' },
            { name: '电梯', icon: '🛗' },
            { name: '行李寄存', icon: '💼' },
        ],
    },
    {
        category: '房间与服务',
        icon: '🛏️',
        items: [
            { name: '提供早餐', icon: '🥐' },
            { name: '咖啡机/茶套装', icon: '☕' },
            { name: '吹风机', icon: '💨' },
        ],
    },
    {
        category: '厨房与餐饮',
        icon: '🍳',
        items: [
            { name: '厨房', icon: '🍳' },
            { name: '洗碗机', icon: '🍽️' },
            { name: '微波炉', icon: '📻' },
        ],
    },
    {
        category: '安全',
        icon: '🔒',
        items: [
            { name: '灭火器', icon: '🧯' },
            { name: '警报器', icon: '🔔' },
            { name: '一氧化碳报警器', icon: '⚠️' },
        ],
    },
    {
        category: '其他',
        icon: '✨',
        items: [
            { name: '烟雾报警器', icon: '💨' },
            { name: '无线网', icon: '📶' },
            { name: '电视', icon: '📺' },
        ],
    },
];
const RoomDrawerFacilities = ({ room }) => {
    return (_jsxs("div", { className: styles.facilitiesSection, children: [_jsx("h3", { className: styles.sectionTitle, children: "\u8BBE\u65BD\u4E0E\u670D\u52A1" }), _jsx("div", { className: styles.facilitiesList, children: facilitiesData.map((group, groupIdx) => (_jsxs("div", { className: styles.facilityGroup, children: [_jsxs("h4", { className: styles.groupTitle, children: [_jsx("span", { className: styles.groupIcon, children: group.icon }), group.category] }), _jsx("div", { className: styles.itemsGrid, children: group.items.map((item, itemIdx) => (_jsxs("div", { className: styles.facilityItem, children: [_jsx("span", { className: styles.itemIcon, children: item.icon }), _jsx("span", { className: styles.itemName, children: item.name })] }, itemIdx))) })] }, groupIdx))) })] }));
};
export default RoomDrawerFacilities;
//# sourceMappingURL=RoomDrawerFacilities.js.map