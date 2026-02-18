import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './index.module.scss';
const HostInfo = ({ data }) => {
    const hostData = {
        name: '逸可民宿',
        avatar: 'https://picsum.photos/80/80?random=host',
        badge: '超赞房东',
        responseRate: 92,
        responseTime: '平均2分钟回复',
        totalReviews: 90,
        overallRating: 4.9,
        tags: [
            '女 90后',
            '白羊座',
            '上海',
            '汉族',
            '大学本科',
            'ENFP',
        ],
        introduction: '喜欢挑战、探索未知、人生无限！',
        work: '室内设计师',
        canOffer: '本地人提供全方位景点和美食攻略',
        vlog: '走过20几个国家',
        skills: '旅游规划大师',
        hottestTime: '住 02-16',
        closestTime: '离 02-17',
        hotPrice: '¥990 ¥1800',
    };
    return (_jsxs("div", { className: styles.hostInfo, children: [_jsxs("div", { className: styles.hostCard, children: [_jsxs("div", { className: styles.hostHeader, children: [_jsxs("div", { className: styles.avatarSection, children: [_jsx("img", { src: hostData.avatar, alt: hostData.name, className: styles.avatar }), _jsxs("div", { className: styles.badgeSection, children: [_jsx("h3", { className: styles.name, children: hostData.name }), _jsx("span", { className: styles.badge, children: hostData.badge })] })] }), _jsx("button", { className: styles.aboutBtn, children: "\u5173\u4E8E\u623F\u4E1C \u203A" })] }), _jsxs("div", { className: styles.statsRow, children: [_jsxs("div", { className: styles.stat, children: [_jsx("div", { className: styles.label, children: "\u6574\u4F53\u8BC4\u5206" }), _jsxs("div", { className: styles.value, children: [_jsx("span", { className: styles.rating, children: hostData.overallRating }), _jsxs("span", { className: styles.totalReviews, children: ["\u5171", hostData.totalReviews, "\u6761\u70B9\u8BC4"] })] })] }), _jsxs("div", { className: styles.stat, children: [_jsx("div", { className: styles.label, children: "\u804A\u5929\u56DE\u590D\u7387" }), _jsxs("div", { className: styles.value, children: [hostData.responseRate, "%"] })] }), _jsxs("div", { className: styles.stat, children: [_jsx("div", { className: styles.label, children: "\u8BA2\u5355\u8BA4\u8BC1\u7387" }), _jsx("div", { className: styles.value, children: "100%" })] })] }), _jsx("div", { className: styles.tagsRow, children: hostData.tags.map((tag, idx) => (_jsx("span", { className: styles.tag, children: tag }, idx))) }), _jsxs("div", { className: styles.infoList, children: [_jsxs("div", { className: styles.infoItem, children: [_jsx("span", { className: styles.emoji, children: "\u270F\uFE0F" }), _jsx("span", { className: styles.text, children: hostData.introduction })] }), _jsxs("div", { className: styles.infoItem, children: [_jsx("span", { className: styles.emoji, children: "\uD83D\uDCBC" }), _jsxs("span", { className: styles.text, children: ["\u6211\u7684\u5DE5\u4F5C: ", hostData.work] })] }), _jsxs("div", { className: styles.infoItem, children: [_jsx("span", { className: styles.emoji, children: "\u2764\uFE0F" }), _jsxs("span", { className: styles.text, children: ["\u6211\u80FD: ", hostData.canOffer] })] }), _jsxs("div", { className: styles.infoItem, children: [_jsx("span", { className: styles.emoji, children: "\u2B50" }), _jsxs("span", { className: styles.text, children: ["\u9AD8\u5149\u65F6\u523B: ", hostData.vlog] })] }), _jsxs("div", { className: styles.infoItem, children: [_jsx("span", { className: styles.emoji, children: "\uD83C\uDFAF" }), _jsxs("span", { className: styles.text, children: ["\u6280\u80FD: ", hostData.skills] })] })] }), _jsxs("div", { className: styles.bookingInfo, children: [_jsxs("div", { className: styles.timeSlot, children: [_jsx("span", { className: styles.label, children: "+1\u5206\u949F\u5185\u56DE\u590D" }), _jsxs("span", { className: styles.text, children: ["\u4F4F ", hostData.hottestTime] })] }), _jsxs("div", { className: styles.timeSlot, children: [_jsx("span", { className: styles.label }), _jsxs("span", { className: styles.text, children: ["\u79BB ", hostData.closestTime] })] })] })] }), _jsxs("div", { className: styles.priceInfo, children: [_jsx("div", { className: styles.priceLeft, children: _jsx("span", { className: styles.hot, children: "\uD83D\uDD25 \u70ED\u9500\u623F\u6E90\uFF0C\u4EC5\u52691\u5957" }) }), _jsx("div", { className: styles.priceRight, children: _jsxs("button", { className: styles.bookMonthBtn, children: [_jsx("span", { className: styles.hotPrice, children: hostData.hotPrice }), _jsx("span", { className: styles.action, children: "\u6284\u5E95\u4EF7\u62A2\u8BA2" })] }) })] })] }));
};
export default HostInfo;
//# sourceMappingURL=index.js.map