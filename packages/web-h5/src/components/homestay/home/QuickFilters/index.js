import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 快捷筛选标签组件 - Web H5版本
 */
import React, { useState, useRef, useEffect } from 'react';
import { QUICK_FILTER_TAGS } from '@estay/shared';
import styles from './index.module.scss';
const QuickFilters = ({ tags = QUICK_FILTER_TAGS, selectedTags = [], onTagSelect, maxSelect, }) => {
    const [selected, setSelected] = useState(new Set(selectedTags));
    const scrollWrapperRef = useRef(null);
    const sliderTrackRef = useRef(null);
    const dragStartRef = useRef({
        startX: 0,
        startScrollLeft: 0,
    });
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isDraggingSlider, setIsDraggingSlider] = useState(false);
    const handleTagClick = (tagId) => {
        const newSelected = new Set(selected);
        const isCurrentlySelected = newSelected.has(tagId);
        // 如果已选且达到最大数量，不允许添加
        if (!isCurrentlySelected && maxSelect && newSelected.size >= maxSelect) {
            return;
        }
        if (isCurrentlySelected) {
            newSelected.delete(tagId);
        }
        else {
            newSelected.add(tagId);
        }
        setSelected(newSelected);
        onTagSelect?.(tagId, !isCurrentlySelected);
    };
    const handleScroll = () => {
        if (scrollWrapperRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollWrapperRef.current;
            const progress = scrollWidth > clientWidth ? (scrollLeft / (scrollWidth - clientWidth)) * 100 : 0;
            setScrollProgress(progress);
        }
    };
    // Slider 拖动逻辑 - 鼠标按下时记录初始位置
    const handleSliderTrackMouseDown = (e) => {
        if (!scrollWrapperRef.current)
            return;
        dragStartRef.current = {
            startX: e.clientX,
            startScrollLeft: scrollWrapperRef.current.scrollLeft,
        };
        setIsDraggingSlider(true);
    };
    // 全局鼠标移动和松开事件
    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            if (!isDraggingSlider || !sliderTrackRef.current || !scrollWrapperRef.current)
                return;
            const trackRect = sliderTrackRef.current.getBoundingClientRect();
            const deltaX = e.clientX - dragStartRef.current.startX;
            // 计算相对于 track 宽度的移动比例，转换为 scroll 距离
            const scrollDistance = (deltaX / trackRect.width) * (scrollWrapperRef.current.scrollWidth - scrollWrapperRef.current.clientWidth);
            scrollWrapperRef.current.scrollLeft = Math.max(0, Math.min(scrollWrapperRef.current.scrollWidth - scrollWrapperRef.current.clientWidth, dragStartRef.current.startScrollLeft + scrollDistance));
        };
        const handleGlobalMouseUp = () => {
            setIsDraggingSlider(false);
        };
        if (isDraggingSlider) {
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDraggingSlider]);
    return (_jsxs("div", { className: styles.container, children: [_jsx("div", { ref: scrollWrapperRef, className: styles.scrollWrapper, onScroll: handleScroll, children: tags.map((tag) => {
                    const isSelected = selected.has(tag.id);
                    return (_jsx("div", { className: `${styles.tag} ${isSelected ? styles.selected : ''}`, onClick: () => handleTagClick(tag.id), children: _jsx("span", { className: styles.label, children: tag.label }) }, tag.id));
                }) }), _jsx("div", { ref: sliderTrackRef, className: styles.sliderTrack, onMouseDown: handleSliderTrackMouseDown, children: _jsx("div", { className: styles.sliderThumb, style: {
                        width: `${Math.max(20, (100 / tags.length) * 3)}%`,
                        left: `${scrollProgress}%`,
                    } }) })] }));
};
export default React.memo(QuickFilters);
//# sourceMappingURL=index.js.map