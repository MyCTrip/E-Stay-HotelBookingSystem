import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 已选条件标签栏
 */
import { useRef, useState, useEffect } from 'react';
import styles from './index.module.scss';
const SelectedTagsBar = ({ tags, onTagRemove, onResetAll }) => {
    const tagsListRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [thumbWidth, setThumbWidth] = useState(0);
    const [isScrollable, setIsScrollable] = useState(false);
    // 监听滚动事件并计算进度
    useEffect(() => {
        const tagsList = tagsListRef.current;
        if (!tagsList)
            return;
        const handleScroll = () => {
            const scrollLeft = tagsList.scrollLeft;
            const scrollWidth = tagsList.scrollWidth;
            const clientWidth = tagsList.clientWidth;
            const maxScroll = scrollWidth - clientWidth;
            // 检查是否可滚动
            const canScroll = scrollWidth > clientWidth;
            setIsScrollable(canScroll);
            if (canScroll) {
                // 计算滑动条宽度比例（内容可见的比例）
                const thumbWidthPercent = (clientWidth / scrollWidth) * 100;
                setThumbWidth(thumbWidthPercent);
                // 计算滑动条位置（0 到 1 - 滑动条宽度）
                const maxThumbPosition = 100 - thumbWidthPercent;
                const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * maxThumbPosition : 0;
                setScrollProgress(progress);
            }
        };
        // 初始化时检查
        requestAnimationFrame(() => {
            handleScroll();
        });
        tagsList.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        return () => {
            tagsList.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [tags]);
    if (tags.length === 0)
        return null;
    return (_jsxs("div", { className: styles.tagsContainer, children: [_jsx("div", { className: styles.tagsWrapper, children: _jsxs("div", { ref: tagsListRef, className: styles.tagsList, children: [tags.map((tag) => (_jsxs("div", { className: styles.tag, children: [_jsx("span", { children: tag.label }), _jsx("button", { className: styles.removeBtn, onClick: () => onTagRemove(tag.key), title: "\u5220\u9664", children: "\u00D7" })] }, tag.key))), _jsx("button", { className: styles.resetBtn, onClick: onResetAll, children: "\u91CD\u7F6E" })] }) }), isScrollable && (_jsx("div", { className: styles.scrollIndicator, children: _jsx("div", { className: styles.scrollThumb, style: {
                        left: `${scrollProgress}%`,
                        width: `${thumbWidth}%`,
                    } }) }))] }));
};
export default SelectedTagsBar;
//# sourceMappingURL=index.js.map