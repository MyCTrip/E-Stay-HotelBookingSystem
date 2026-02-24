import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropertyCardContainer from '../PropertyCardContainer';
import styles from './index.module.scss';
/**
 * HostInfo 内容组件
 */
const HostInfoContent = ({ data }) => {
    const hostData = {
        name: '逸可民宿',
        avatar: 'https://picsum.photos/80/80?random=host',
        badge: '超赞房东',
        responseRate: 92,
        responseTime: '平均2分钟回复',
        totalReviews: 90,
        overallRating: 4.9,
        tags: ['自然人房东', '实名验证', '14套房屋'],
        introduction: '喜欢挑战、探索未知、人生无限！',
        work: '室内设计师',
        canOffer: '本地人提供全方位景点和美食攻略',
        vlog: '走过20几个国家',
        skills: '旅游规划大师',
        hottestTime: '住 02-16',
        closestTime: '离 02-17',
        hotPrice: '¥990 ¥1800',
    };
    return (_jsx("div", { className: styles.hostInfo, children: _jsxs("div", { className: styles.hostCard, children: [_jsxs("div", { className: styles.hostHeader, children: [_jsxs("div", { className: styles.avatarSection, children: [_jsx("img", { src: hostData.avatar, alt: hostData.name, className: styles.avatar }), _jsxs("div", { className: styles.badgeSection, children: [_jsx("h2", { className: styles.name, children: hostData.name }), _jsx("div", { className: styles.tagsRow, children: hostData.tags.map((tag, idx) => (_jsx("span", { className: styles.tag, children: tag }, idx))) })] })] }), _jsx("button", { className: styles.aboutBtn, children: "\u8054\u7CFB\u623F\u4E1C" })] }), _jsxs("div", { className: styles.statsRow, children: [_jsxs("div", { className: styles.stat, children: [_jsx("div", { className: styles.label, children: "\u6574\u4F53\u8BC4\u5206" }), _jsxs("div", { className: styles.value, children: [_jsx("span", { className: styles.rating, children: hostData.overallRating }), _jsxs("span", { className: styles.totalReviews, children: ["\u5171", hostData.totalReviews, "\u6761\u70B9\u8BC4"] })] })] }), _jsxs("div", { className: styles.stat, children: [_jsx("div", { className: styles.label, children: "\u56DE\u590D\u7387" }), _jsxs("div", { className: styles.value, children: [hostData.responseRate, "%"] })] }), _jsxs("div", { className: styles.stat, children: [_jsx("div", { className: styles.label, children: "\u8BA2\u5355\u786E\u8BA4\u7387" }), _jsx("div", { className: styles.value, children: "100%" })] })] })] }) }));
};
const HostInfo = ({ data }) => {
    return (_jsx(PropertyCardContainer, { headerConfig: {
            show: true,
            title: {
                show: true,
                text: '房东介绍',
            },
            textButton: {
                show: true,
                text: '房东主页',
                onClick: () => { }
            }
        }, children: _jsx(HostInfoContent, { data: data }) }));
};
export default HostInfo;
//# sourceMappingURL=index.js.map