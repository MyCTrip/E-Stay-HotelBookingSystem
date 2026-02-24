import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 搜索结果单列卡片 - 响应式布局
 * PC端（>768px）: 左图右文水平布局
 * 移动端（≤768px）: 纵向竖卡片布局
 */
import { useState } from 'react';
import { HeartIcon } from '../../../icons/HeartIcon';
import styles from './index.module.scss';
import { StarIcon, PositionIcon } from '../../icons';
const SearchResultCard = ({ data, onClick, onFavorite, isFavorited = false, }) => {
    const [imageError, setImageError] = useState(false);
    const [favorited, setFavorited] = useState(isFavorited);
    const primaryImage = data.images?.[0] || null;
    const roomPrice = data.rooms?.[0]?.price?.currentPrice || data.rooms?.[0]?.price?.originPrice || 358;
    const tags = ['含双早', '免费取消', '热门'];
    const handleCardClick = () => {
        onClick?.(data._id);
    };
    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        setFavorited(!favorited);
        onFavorite?.(data._id, !favorited);
    };
    return (_jsxs("div", { className: styles.card, onClick: handleCardClick, children: [_jsxs("div", { className: styles.imageSection, children: [primaryImage && !imageError ? (_jsx("img", { src: primaryImage, alt: data.baseInfo.name, className: styles.image, loading: "lazy", onError: () => setImageError(true) })) : (_jsx("div", { className: styles.imagePlaceholder })), _jsx("button", { className: `${styles.favoriteBtn} ${favorited ? styles.favorited : ''}`, onClick: handleFavoriteClick, "aria-label": "\u6536\u85CF", children: _jsx(HeartIcon, { size: 28, fillColor: favorited ? 'rgba(255, 107, 107, 0.9)' : 'rgba(68, 70, 72, 0.3)', strokeColor: favorited ? 'rgba(255, 107, 107, 0.9)' : 'rgba(255, 255, 255, 0.9)', strokeWidth: 2 }) }), _jsxs("div", { className: styles.ratingBadge, children: [_jsx(StarIcon, { width: 12, height: 12, color: '#eec50f' }), _jsx("span", { className: styles.ratingBadgeText, children: data.baseInfo.star }), _jsx(PositionIcon, { width: 10, height: 10, color: '#8da5cd' }), _jsxs("span", { className: styles.location, children: [data.baseInfo.city, " \u00B7 \u8DDD\u60A8 3.2km"] })] }), _jsxs("div", { className: styles.photoCount, children: ["\uD83D\uDCF7 ", data.images?.length || 1] })] }), _jsxs("div", { className: styles.infoSection, children: [_jsx("h3", { className: styles.name, children: data.baseInfo.name }), _jsx("div", { className: styles.tags, children: tags.slice(0, 3).map((tag, index) => (_jsx("span", { className: styles.tag, children: tag }, index))) }), _jsxs("div", { className: styles.roomInfo, children: ["1\u5C451\u5E8A2\u4EBA \u00B7 \u6574\u595740\u33A1 \u00B7 \u8FD1", data.baseInfo.city, "\u8DEF\u6B65\u884C\u8857"] }), _jsxs("div", { className: styles.priceSection, children: [_jsxs("span", { className: styles.price, children: ["\u00A5", roomPrice] }), _jsx("span", { className: styles.unit, children: "/\u665A\u8D77" })] })] })] }));
};
export default SearchResultCard;
//# sourceMappingURL=index.js.map