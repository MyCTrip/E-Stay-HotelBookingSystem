import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 民宿卡片组件 - 瀑布流布局专用
 * 支持收藏、价格对比、用户评价等功能
 */
import React, { useState } from 'react';
import styles from './index.module.scss';
const HomeStayCard = ({ data, onClick, onFavorite, showStar = true, isFavorited = false, }) => {
    const [imageError, setImageError] = useState(false);
    const [favorited, setFavorited] = useState(isFavorited);
    const primaryImage = data.images?.[0] || null;
    const roomPrice = data.rooms?.[0]?.baseInfo?.price || 358; // 模拟价格
    const originalPrice = Math.ceil(roomPrice * 1.5); // 模拟原价
    const discount = Math.round(((originalPrice - roomPrice) / originalPrice) * 100);
    const reviewCount = Math.floor(Math.random() * 5000) + 500; // 模拟评论数
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
    return (_jsxs("div", { className: styles.waterlineCard, onClick: handleCardClick, children: [_jsxs("div", { className: styles.imageContainer, children: [primaryImage && !imageError ? (_jsx("img", { src: primaryImage, alt: data.baseInfo.nameCn, className: styles.image, loading: "lazy", onError: handleImageError })) : (_jsx("div", { className: styles.imagePlaceholder })), _jsx("button", { className: `${styles.favoriteBtn} ${favorited ? styles.favorited : ''}`, onClick: handleFavoriteClick, title: favorited ? '取消收藏' : '收藏', children: "\u2661" }), discount > 0 && (_jsx("div", { className: styles.hotBadge, children: "\u7F51\u7EA2\u70ED\u9152" }))] }), _jsxs("div", { className: styles.infoContainer, children: [_jsxs("div", { className: styles.locationRow, children: [_jsx("span", { className: styles.locationIcon, children: "\uD83D\uDCCD" }), _jsxs("span", { className: styles.locationText, children: [data.baseInfo.city, " \u00B7 ", data.baseInfo.address.substring(0, 15)] })] }), _jsx("h3", { className: styles.title, children: data.baseInfo.nameCn }), _jsx("div", { className: styles.priceRow, children: _jsxs("div", { className: styles.priceBlock, children: [_jsxs("span", { className: styles.currentPrice, children: ["\u00A5", roomPrice] }), originalPrice > roomPrice && (_jsxs("span", { className: styles.originalPrice, children: ["\u00A5", originalPrice] }))] }) }), _jsxs("div", { className: styles.ratingRow, children: [showStar && data.baseInfo.star > 0 && (_jsxs("span", { className: styles.rating, children: ["\u2B50 ", data.baseInfo.star] })), _jsxs("span", { className: styles.reviewCount, children: [reviewCount, "+ \u4EBA\u8D5E\u540C"] })] })] })] }));
};
export default React.memo(HomeStayCard);
//# sourceMappingURL=index.js.map