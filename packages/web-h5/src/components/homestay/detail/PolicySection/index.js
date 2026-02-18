import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 酒店政策区
 */
import { useState } from 'react';
import styles from './index.module.scss';
const policies = [
    { title: '入住/退房规则', content: '入住时间：15:00以后\n退房时间：12:00前' },
    { title: '取消政策', content: '提前7天预订可获得最佳价格\n提前24小时可免费取消' },
    { title: '儿童政策', content: '12岁以下儿童需额外支付¥100/晚\n可免费提供婴儿床' },
];
const PolicySection = ({ data }) => {
    const [expanded, setExpanded] = useState(0);
    return (_jsxs("div", { className: styles.section, children: [_jsx("h2", { className: styles.title, children: "\u9884\u8BA2\u987B\u77E5" }), _jsx("div", { className: styles.policyList, children: policies.map((policy, idx) => (_jsxs("div", { className: styles.policyItem, children: [_jsxs("div", { className: styles.header, onClick: () => setExpanded(expanded === idx ? null : idx), children: [_jsx("span", { className: styles.title2, children: policy.title }), _jsx("span", { className: styles.icon, children: expanded === idx ? '▲' : '▼' })] }), expanded === idx && (_jsx("div", { className: styles.content, children: policy.content.split('\n').map((line, i) => (_jsx("p", { children: line }, i))) }))] }, idx))) })] }));
};
export default PolicySection;
//# sourceMappingURL=index.js.map