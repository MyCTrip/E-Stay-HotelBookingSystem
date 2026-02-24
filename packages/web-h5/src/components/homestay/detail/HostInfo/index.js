import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropertyCardContainer from '../PropertyCardContainer';
import styles from './index.module.scss';
/**
 * HostInfo 内容组件
 */
const HostInfoContent = ({ hostInfo }) => {
    // 安全处理 hostInfo 为 undefined 的情况
    if (!hostInfo) {
        return _jsx("div", { className: styles.hostInfo });
    }
    return (_jsx("div", { className: styles.hostInfo, children: _jsxs("div", { className: styles.hostCard, children: [_jsxs("div", { className: styles.hostHeader, children: [_jsxs("div", { className: styles.avatarSection, children: [_jsx("img", { src: hostInfo.avatar, alt: hostInfo.name, className: styles.avatar }), _jsxs("div", { className: styles.badgeSection, children: [_jsx("h2", { className: styles.name, children: hostInfo.name }), _jsx("div", { className: styles.tagsRow, children: hostInfo.tags?.map((tag, idx) => (_jsx("span", { className: styles.tag, children: tag }, idx))) })] })] }), _jsx("button", { className: styles.aboutBtn, children: "\u8054\u7CFB\u623F\u4E1C" })] }), _jsxs("div", { className: styles.statsRow, children: [_jsxs("div", { className: styles.stat, children: [_jsx("div", { className: styles.label, children: "\u6574\u4F53\u8BC4\u5206" }), _jsxs("div", { className: styles.value, children: [_jsx("span", { className: styles.rating, children: hostInfo.overallRating }), _jsxs("span", { className: styles.totalReviews, children: ["\u5171", hostInfo.totalReviews, "\u6761\u70B9\u8BC4"] })] })] }), _jsxs("div", { className: styles.stat, children: [_jsx("div", { className: styles.label, children: "\u56DE\u590D\u7387" }), _jsxs("div", { className: styles.value, children: [hostInfo.responseRate, "%"] })] }), _jsxs("div", { className: styles.stat, children: [_jsx("div", { className: styles.label, children: "\u8BA2\u5355\u786E\u8BA4\u7387" }), _jsxs("div", { className: styles.value, children: [hostInfo.orderConfirmationRate, "%"] })] })] })] }) }));
};
const HostInfo = ({ data, hostInfo }) => {
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
        }, children: _jsx(HostInfoContent, { data: data, hostInfo: hostInfo }) }));
};
export default HostInfo;
//# sourceMappingURL=index.js.map