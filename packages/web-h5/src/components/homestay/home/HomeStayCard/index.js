import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 民宿卡片组件 - 瀑布流布局专用
 * 支持收藏、价格对比、用户评价等功能
 */
import React, { useState } from 'react';
import styles from './index.module.scss';
import { HeartIcon } from '../../../icons/HeartIcon';
import { PositionIcon, StarIcon } from '../../icons';
const HomeStayCard = ({ data, onClick, onFavorite, showStar = true, isFavorited = false, }) => {
    const [imageError, setImageError] = useState(false);
    const [favorited, setFavorited] = useState(isFavorited);
    const primaryImage = data.images?.[0] || null;
    const roomPrice = data.rooms?.[0]?.price?.currentPrice || data.rooms?.[0]?.price?.originPrice || 358;
    const originalPrice = Math.ceil(roomPrice * 1.5);
    const discount = Math.round(((originalPrice - roomPrice) / originalPrice) * 100);
    const reviewCount = data.baseInfo.reviewCount || 500;
    const handleCardClick = () => {
        onClick?.(data._id);
    };
    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        setFavorited(!favorited);
        onFavorite?.(data._id, !favorited);
    };
    const handleImageError = () => {
        setImageError(true);
    };
    return (_jsxs("div", { className: styles.waterlineCard, onClick: handleCardClick, children: [_jsxs("div", { className: styles.imageContainer, children: [primaryImage && !imageError ? (_jsx("img", { src: primaryImage, alt: data.baseInfo.name, className: styles.image, loading: "lazy", onError: handleImageError })) : (_jsx("div", { className: styles.imagePlaceholder })), _jsx("button", { className: `${styles.favoriteBtn} ${favorited ? styles.favorited : ''}`, onClick: handleFavoriteClick, title: favorited ? '取消收藏' : '收藏', children: _jsx(HeartIcon, { size: 28, fillColor: favorited ? 'rgba(255, 107, 107, 0.9)' : 'rgba(68, 70, 72, 0.3)', strokeColor: favorited ? 'rgba(255, 107, 107, 0.9)' : 'rgba(255, 255, 255, 0.9)', strokeWidth: 2 }) }), discount > 0 && _jsx("div", { className: styles.hotBadge, children: "\u4E25\u9009\u6C11\u5BBF" })] }), _jsxs("div", { className: styles.infoContainer, children: [_jsxs("div", { className: styles.locationRow, children: [_jsx("span", { className: styles.locationIcon, children: _jsx(PositionIcon, { width: 12, height: 12, color: '#8da5cd' }) }), _jsxs("span", { className: styles.locationText, children: [data.baseInfo.city, " \u00B7 ", data.baseInfo.address.substring(0, 15)] })] }), _jsx("h3", { className: styles.title, children: data.baseInfo.name }), _jsxs("div", { style: { display: "flex" }, children: [_jsx("div", { className: styles.priceRow, children: _jsxs("div", { className: styles.priceBlock, children: [_jsxs("span", { className: styles.currentPrice, children: ["\u00A5", roomPrice] }), originalPrice > roomPrice && (_jsxs("span", { className: styles.originalPrice, children: ["\u00A5", originalPrice] }))] }) }), _jsxs("div", { className: styles.ratingRow, children: [_jsx(StarIcon, { width: 14, height: 14, color: '#eec50f' }), showStar && (data.baseInfo.star ?? 0) > 0 && (_jsx("span", { className: styles.rating, children: data.baseInfo.star })), _jsxs("span", { className: styles.reviewCount, children: [reviewCount, "+ \u4EBA\u8D5E\u540C"] })] })] })] })] }));
};
export default React.memo(HomeStayCard);
//# sourceMappingURL=index.js.map