import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 民宿推荐卡片组件
 * 左图右文布局，显示民宿基本信息
 * 遵循规范：
 * - 卡片圆角8-12pt，内边距8-12pt
 * - 图片自适应高度
 * - 不显示评分
 */
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocationIcon } from './icons';
import styles from './index.module.scss';
const RecommendCard = ({ homestay, onClick }) => {
    const navigate = useNavigate();
    // 计算最低房价
    const minPrice = useMemo(() => {
        if (!homestay.rooms || homestay.rooms.length === 0) {
            return 299; // 默认价格
        }
        return Math.min(...homestay.rooms.map((room) => room.price?.currentPrice || room.price?.originPrice || 299));
    }, [homestay.rooms]);
    const handleClick = () => {
        if (onClick) {
            onClick(homestay);
        }
        else {
            navigate(`/hotel-detail/homestay/${homestay._id}`);
        }
    };
    return (_jsxs("div", { className: styles.card, onClick: handleClick, children: [_jsx("div", { className: styles.imageWrapper, children: _jsx("img", { src: homestay.images?.[0] || 'https://via.placeholder.com/160x280', alt: homestay.baseInfo?.name, className: styles.image }) }), _jsxs("div", { className: styles.content, children: [_jsx("h3", { className: styles.title, children: homestay.baseInfo?.name }), _jsxs("div", { className: styles.location, children: [_jsx(LocationIcon, {}), _jsx("span", { className: styles.locationText, children: homestay.baseInfo?.address })] }), homestay.facilities && homestay.facilities.length > 0 && (_jsx("div", { className: styles.tags, children: homestay.facilities.slice(0, 2).map((facility, index) => {
                            let facilityName = '设施';
                            if (typeof facility === 'object' && facility !== null) {
                                const f = facility;
                                facilityName = f.name || '设施';
                            }
                            return (_jsx("span", { className: styles.tag, children: facilityName }, index));
                        }) })), _jsx("div", { className: styles.footer, children: _jsxs("div", { className: styles.priceInfo, children: [_jsx("span", { className: styles.priceSymbol, children: "\u00A5" }), _jsx("span", { className: styles.price, children: minPrice }), _jsx("span", { className: styles.priceUnit, children: "/\u665A" })] }) })] }), _jsx("button", { className: styles.clickZone, onClick: handleClick, "aria-label": `查看 ${homestay.baseInfo?.name} 详情` })] }));
};
export default React.memo(RecommendCard);
//# sourceMappingURL=index.js.map