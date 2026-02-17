import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rate, Tag } from '@nutui/nutui-react';
import styles from './index.module.css';
/**
 * 民宿推荐卡片组件
 * 左图右文布局，显示民宿基本信息
 * 遵循规范：
 * - 卡片圆角8-12pt，内边距8-12pt
 * - 图片1:1比例，左侧100x100pt
 * - 评分、标签、价格显示
 * - 点击热区≥44*44pt
 */
export default function RecommendCard({ homestay, onClick, }) {
    const navigate = useNavigate();
    // 计算最低房价
    const minPrice = useMemo(() => {
        if (!homestay.images || homestay.images.length === 0) {
            return 299; // 默认价格
        }
        // 这是简化版本，实际应该从rooms中获取
        return 299;
    }, [homestay.images]);
    const handleClick = () => {
        if (onClick) {
            onClick(homestay);
        }
        else {
            navigate(`/hotel/${homestay._id}/homestay`);
        }
    };
    return (_jsxs("div", { className: styles.card, children: [_jsx("div", { className: styles.imageWrapper, children: _jsx("img", { src: homestay.images?.[0] || 'https://via.placeholder.com/100x100', alt: homestay.baseInfo?.nameCn, className: styles.image, onClick: handleClick }) }), _jsxs("div", { className: styles.content, children: [_jsxs("div", { className: styles.header, children: [_jsxs("div", { className: styles.titleRow, children: [_jsx("h3", { className: styles.title, children: homestay.baseInfo?.nameCn }), _jsx("span", { className: styles.starIcon, children: "\u2B50" })] }), _jsxs("div", { className: styles.ratingRow, children: [_jsx(Rate, { value: homestay.baseInfo?.star || 0, readOnly: true }), _jsxs("span", { className: styles.ratingText, children: ["(", homestay.baseInfo?.star || 0, ")"] })] })] }), _jsxs("div", { className: styles.location, children: [_jsx("span", { children: "\uD83D\uDCCD" }), _jsx("span", { className: styles.locationText, children: homestay.baseInfo?.address })] }), _jsxs("div", { className: styles.tags, children: [homestay.typeConfig?.instantBooking && (_jsx(Tag, { round: true, type: "primary", className: styles.tag, children: "\u7ACB\u5373\u9884\u8BA2" })), homestay.auditInfo?.status === 'approved' && (_jsx(Tag, { round: true, type: "success", className: styles.tag, children: "\u5DF2\u8BA4\u8BC1" }))] }), _jsxs("div", { className: styles.footer, children: [_jsxs("div", { className: styles.priceInfo, children: [_jsx("span", { className: styles.priceSymbol, children: "\u00A5" }), _jsx("span", { className: styles.price, children: minPrice }), _jsx("span", { className: styles.priceUnit, children: "/\u665A" })] }), _jsxs("div", { className: styles.hostInfo, children: [_jsx("span", { className: styles.userIcon, children: "\uD83D\uDC64" }), _jsx("span", { className: styles.hostName, children: homestay.typeConfig?.hostName || '民宿主人' })] })] })] }), _jsx("button", { className: styles.clickZone, onClick: handleClick, "aria-label": `查看 ${homestay.baseInfo?.nameCn} 详情` })] }));
}
//# sourceMappingURL=index.js.map