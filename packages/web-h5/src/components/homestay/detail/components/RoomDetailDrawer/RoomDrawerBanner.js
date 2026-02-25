import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 房型图片轮播区 - 抽屉顶部banner
 */
import { useState } from 'react';
import styles from './RoomDrawerBanner.module.scss';
const RoomDrawerBanner = ({ room }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    // 模拟多张房型图片
    const images = [
        room.image,
        'https://picsum.photos/400/300?random=room_1',
        'https://picsum.photos/400/300?random=room_2',
        'https://picsum.photos/400/300?random=room_3',
        'https://picsum.photos/400/300?random=room_4',
    ];
    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };
    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };
    return (_jsxs("div", { className: styles.banner, children: [_jsxs("div", { className: styles.imageWrapper, children: [_jsx("img", { src: images[currentImageIndex], alt: room.name, className: styles.image }), _jsxs("div", { className: styles.imageCounter, children: [currentImageIndex + 1, "/", images.length] }), images.length > 1 && (_jsxs(_Fragment, { children: [_jsx("button", { className: styles.navPrev, onClick: handlePrevImage, children: "\u2039" }), _jsx("button", { className: styles.navNext, onClick: handleNextImage, children: "\u203A" })] }))] }), images.length > 1 && (_jsx("div", { className: styles.indicators, children: images.map((_, index) => (_jsx("div", { className: `${styles.dot} ${index === currentImageIndex ? styles.active : ''}`, onClick: () => setCurrentImageIndex(index) }, index))) }))] }));
};
export default RoomDrawerBanner;
//# sourceMappingURL=RoomDrawerBanner.js.map