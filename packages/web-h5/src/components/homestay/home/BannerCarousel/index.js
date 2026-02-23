import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
/**
 * 民宿首页轮播组件
 * 遵循规范：
 * - 宽度100%，高度480px
 * - 圆角10-12pt
 * - 自动轮播3.5秒，支持手动滑动
 * - 底部indicator显示当前位置
 * - 淡出淡入切换效果
 * - 纯色填充覆盖整个区域
 */
export default function BannerCarousel({ items, autoPlay = true, interval = 3500, onBannerClick, }) {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const defaultItems = [
        {
            id: '1',
            title: '周末度假专场',
            subtitle: '优质民宿低至5折',
            link: '/search/homestay?discount=weekend',
            color: '#FF6B6B',
        },
        {
            id: '2',
            title: '温暖家庭民宿',
            subtitle: '适合全家欢乐时光',
            link: '/search/homestay?type=family',
            color: '#26A69A',
        },
        {
            id: '3',
            title: '诗意海滨民宿',
            subtitle: '尽享海岸风光',
            link: '/search/homestay?type=beach',
            color: '#F59E0B',
        },
    ];
    const bannerItems = items || defaultItems;
    // 自动轮播
    useEffect(() => {
        if (!autoPlay || bannerItems.length === 0)
            return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % bannerItems.length);
        }, interval);
        return () => clearInterval(timer);
    }, [autoPlay, interval, bannerItems.length]);
    const handleBannerClick = useCallback(() => {
        const item = bannerItems[currentIndex];
        if (onBannerClick) {
            onBannerClick(item);
        }
        else if (item.link) {
            navigate(item.link);
        }
    }, [currentIndex, bannerItems, onBannerClick, navigate]);
    const goToSlide = (index) => {
        setCurrentIndex(index % bannerItems.length);
    };
    return (_jsxs("div", { className: styles.container, onClick: handleBannerClick, children: [_jsx("div", { className: styles.bannerWrapper, children: bannerItems.map((item, index) => (_jsxs("div", { className: `${styles.bannerSlide} ${index === currentIndex ? styles.active : ''}`, style: {
                        backgroundColor: item.color || '#FF6B6B',
                    }, children: [_jsxs("div", { className: styles.content, children: [_jsx("h3", { className: styles.title, children: item.title }), item.subtitle && _jsx("p", { className: styles.subtitle, children: item.subtitle })] }), _jsxs("div", { className: styles.counter, children: [currentIndex + 1, "/", bannerItems.length] })] }, item.id))) }), _jsx("div", { className: styles.indicators, children: bannerItems.map((_, index) => (_jsx("div", { className: `${styles.dot} ${index === currentIndex ? styles.active : ''}`, onClick: (e) => {
                        e.stopPropagation();
                        goToSlide(index);
                    } }, index))) })] }));
}
//# sourceMappingURL=index.js.map