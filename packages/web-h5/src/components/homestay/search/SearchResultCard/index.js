import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 搜索结果单列卡片 - 响应式布局
 * PC端（>768px）: 左图右文水平布局
 * 移动端（≤768px）: 纵向竖卡片布局
 */
import { useState } from 'react';
import styles from './index.module.scss';
const SearchResultCard = ({ data, onClick, onFavorite, isFavorited = false, }) => {
    const [imageError, setImageError] = useState(false);
    const [favorited, setFavorited] = useState(isFavorited);
    const primaryImage = data.images?.[0] || null;
    const roomPrice = data.rooms?.[0]?.baseInfo?.price || 358;
    const originalPrice = Math.ceil(roomPrice * 1.5);
    const reviewCount = Math.floor(Math.random() * 5000) + 100;
    const discountAmount = Math.floor(Math.random() * 100) + 20;
    const tags = ['含双早', '免费取消', '热门'];
    const features = ['无忧保障', '实拍看房', '免费取消', '近地铁'];
    const handleCardClick = () => {
        onClick?.(data._id);
    };
    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        setFavorited(!favorited);
        onFavorite?.(data._id, !favorited);
    };
    return (_jsxs("div", { className: styles.card, onClick: handleCardClick, children: [_jsxs("div", { className: styles.imageSection, children: [primaryImage && !imageError ? (_jsx("img", { src: primaryImage, alt: data.baseInfo.nameCn, className: styles.image, loading: "lazy", onError: () => setImageError(true) })) : (_jsx("div", { className: styles.imagePlaceholder })), _jsx("button", { className: `${styles.favoriteBtn} ${favorited ? styles.favorited : ''}`, onClick: handleFavoriteClick, children: "\u2661" }), _jsxs("div", { className: styles.photoCount, children: ["\uD83D\uDCF7 ", data.images?.length || 1] })] }), _jsxs("div", { className: styles.infoSection, children: [_jsx("h3", { className: styles.name, children: data.baseInfo.nameCn }), _jsxs("div", { className: styles.ratingRow, children: [_jsxs("span", { className: styles.rating, children: ["\u2B50 ", data.baseInfo.star] }), _jsx("span", { className: styles.ratingText, children: "\u8D85\u68D2" }), _jsxs("span", { className: styles.location, children: [data.baseInfo.city, " \u00B7 \u8DDD\u60A8 3.2km"] })] }), _jsx("div", { className: styles.tags, children: tags.slice(0, 3).map((tag, index) => (_jsx("span", { className: styles.tag, children: tag }, index))) }), _jsxs("div", { className: styles.discount, children: ["\uD83D\uDD25 \u4ECA\u65E5\u7279\u4EF7\uFF0C\u6BD4\u539F\u4EF7\u4F4E \u00A5", discountAmount] }), _jsx("div", { className: styles.features, children: features.slice(0, 4).map((feature, index) => (_jsx("span", { className: styles.feature, children: feature }, index))) }), _jsxs("div", { className: styles.roomInfo, children: ["1\u5C451\u5E8A2\u4EBA \u00B7 \u6574\u595740\u33A1 \u00B7 \u8FD1", data.baseInfo.city, "\u8DEF\u6B65\u884C\u8857"] }), _jsxs("div", { className: styles.priceSection, children: [_jsxs("span", { className: styles.price, children: ["\u00A5", roomPrice] }), _jsx("span", { className: styles.unit, children: "/\u665A\u8D77" }), _jsxs("span", { className: styles.sold, children: ["\u5DF2\u552E ", reviewCount] })] })] })] }));
};
export default SearchResultCard;
//# sourceMappingURL=index.js.map