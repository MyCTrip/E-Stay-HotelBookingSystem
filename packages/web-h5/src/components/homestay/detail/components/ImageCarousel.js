import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 沉浸式图片轮播区
 */
import { useState } from 'react';
import styles from './ImageCarousel.module.scss';
const ImageCarousel = ({ images, onFullscreen }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };
    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };
    const handleTouchStart = (e) => {
        setTouchStart(e.touches[0].clientX);
    };
    const handleTouchEnd = (e) => {
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;
        if (Math.abs(diff) > 50) {
            // 向左滑动 - 下一张
            if (diff > 0) {
                handleNext();
            }
            else {
                // 向右滑动 - 上一张
                handlePrev();
            }
        }
    };
    return (_jsxs("div", { className: styles.carouselWrapper, children: [_jsxs("div", { className: styles.carousel, onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd, children: [_jsx("div", { className: styles.imageContainer, children: _jsx("img", { src: images[currentIndex], alt: `Slide ${currentIndex + 1}`, className: styles.image, onClick: onFullscreen }) }), _jsx("button", { className: `${styles.arrow} ${styles.prev}`, onClick: handlePrev, children: "\u2039" }), _jsx("button", { className: `${styles.arrow} ${styles.next}`, onClick: handleNext, children: "\u203A" }), _jsxs("div", { className: styles.counter, children: [_jsx("span", { children: currentIndex + 1 }), "/", _jsx("span", { children: images.length })] }), _jsx("button", { className: styles.vrButton, title: "VR\u5168\u666F", children: "VR" })] }), _jsx("div", { className: styles.indicators, children: images.map((_, idx) => (_jsx("button", { className: `${styles.indicator} ${idx === currentIndex ? styles.active : ''}`, onClick: () => setCurrentIndex(idx) }, idx))) })] }));
};
export default ImageCarousel;
//# sourceMappingURL=ImageCarousel.js.map