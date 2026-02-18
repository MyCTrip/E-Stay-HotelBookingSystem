import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './index.module.scss';
const BookingBar = ({ data, onBook }) => {
    // 获取价格信息
    const price = data?.baseInfo?.price || 1280;
    return (_jsxs("div", { className: styles.bookingBar, children: [_jsxs("div", { className: styles.priceArea, children: [_jsx("span", { className: styles.currency, children: "\u00A5" }), _jsx("span", { className: styles.price, children: price }), _jsx("span", { className: styles.unit, children: "/\u665A" }), _jsx("div", { className: styles.avgHint, children: "\u5E73\u5747\u4EF7" })] }), _jsx("button", { className: styles.bookBtn, onClick: onBook, children: "\u7ACB\u5373\u9884\u8BA2" })] }));
};
export default BookingBar;
//# sourceMappingURL=index.js.map