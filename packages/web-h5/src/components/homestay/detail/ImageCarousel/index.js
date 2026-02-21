import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 沉浸式图片轮播区 - 支持平滑拖动交互
 */
import { useState, useRef, useEffect } from 'react';
import styles from './index.module.scss';
const ImageCarousel = ({ images, onFullscreen }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState(0);
    const startXRef = useRef(0);
    const startOffsetRef = useRef(0);
    const trackRef = useRef(null);
    // 计算正常位置
    const calculateOffset = (index) => -index * 100;
    // 鼠标/触摸开始
    const handleMouseDown = (e) => {
        if (e.target.tagName === 'BUTTON')
            return;
        setIsDragging(true);
        startXRef.current = e.clientX;
        startOffsetRef.current = offset;
    };
    // 鼠标/触摸移动和释放
    useEffect(() => {
        if (!isDragging)
            return;
        const handleMouseMove = (e) => {
            const diff = e.clientX - startXRef.current;
            const percentage = (diff / window.innerWidth) * 100;
            setOffset(startOffsetRef.current + percentage);
        };
        const handleMouseUp = (e) => {
            const diff = e.clientX - startXRef.current;
            // 分晓逻辑：拖动超过50px就切换
            if (Math.abs(diff) > 50) {
                const direction = diff > 0 ? 1 : -1;
                const newIndex = Math.max(0, Math.min(currentIndex - direction, images.length - 1));
                setCurrentIndex(newIndex);
                setOffset(calculateOffset(newIndex));
            }
            else {
                // 拖动不足，会弹回原位置
                setOffset(calculateOffset(currentIndex));
            }
            setIsDragging(false);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, currentIndex, images.length]);
    // 触摸事件
    const handleTouchStart = (e) => {
        startXRef.current = e.touches[0].clientX;
        startOffsetRef.current = offset;
        setIsDragging(true);
    };
    const handleTouchMove = (e) => {
        if (!isDragging)
            return;
        const diff = e.touches[0].clientX - startXRef.current;
        const percentage = (diff / window.innerWidth) * 100;
        setOffset(startOffsetRef.current + percentage);
    };
    const handleTouchEnd = (e) => {
        const diff = e.changedTouches[0].clientX - startXRef.current;
        if (Math.abs(diff) > 50) {
            const direction = diff > 0 ? 1 : -1;
            const newIndex = Math.max(0, Math.min(currentIndex - direction, images.length - 1));
            setCurrentIndex(newIndex);
            setOffset(calculateOffset(newIndex));
        }
        else {
            setOffset(calculateOffset(currentIndex));
        }
        setIsDragging(false);
    };
    const handlePrev = () => {
        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
        setOffset(calculateOffset(newIndex));
    };
    const handleNext = () => {
        const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
        setOffset(calculateOffset(newIndex));
    };
    return (_jsx("div", { className: styles.carouselWrapper, children: _jsxs("div", { className: styles.carousel, onMouseDown: handleMouseDown, onTouchStart: handleTouchStart, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd, children: [_jsx("div", { ref: trackRef, className: styles.imageTrack, style: {
                        transform: `translateX(${offset}%)`,
                        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                    }, children: images.map((image, idx) => (_jsx("div", { className: styles.imageWrapper, children: _jsx("img", { src: image, alt: `Slide ${idx + 1}`, className: styles.image, onClick: onFullscreen, draggable: false }) }, idx))) }), _jsx("div", { className: styles.imageContainer }), _jsx("button", { className: `${styles.arrow} ${styles.prev}`, onClick: handlePrev, children: "\u2039" }), _jsx("button", { className: `${styles.arrow} ${styles.next}`, onClick: handleNext, children: "\u203A" }), _jsxs("div", { className: styles.counter, children: [_jsx("span", { children: currentIndex + 1 }), "/", _jsx("span", { children: images.length })] }), _jsx("button", { className: styles.vrButton, title: "VR\u5168\u666F", children: "VR" })] }) }));
};
export default ImageCarousel;
//# sourceMappingURL=index.js.map