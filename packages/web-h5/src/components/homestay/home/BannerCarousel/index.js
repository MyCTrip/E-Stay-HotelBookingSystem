import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper } from '@nutui/nutui-react';
import styles from './index.module.css';
/**
 * 民宿首页轮播组件
 * 遵循规范：
 * - 宽度100%，高度200-240px
 * - 圆角10-12pt
 * - 自动轮播3.5秒，支持手动滑动
 * - 底部indicator显示当前位置
 * - 图片覆盖层渐变效果
 */
export default function BannerCarousel({ items, autoPlay = true, interval = 3500, onBannerClick, }) {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const defaultItems = [
        {
            id: '1',
            image: 'https://via.placeholder.com/480x240/FF6B6B/ffffff?text=周末度假',
            title: '周末度假专场',
            subtitle: '优质民宿低至5折',
            link: '/search/homestay?discount=weekend',
        },
        {
            id: '2',
            image: 'https://via.placeholder.com/480x240/26A69A/ffffff?text=家庭民宿',
            title: '温暖家庭民宿',
            subtitle: '适合全家欢乐时光',
            link: '/search/homestay?type=family',
        },
        {
            id: '3',
            image: 'https://via.placeholder.com/480x240/F59E0B/ffffff?text=海滨民宿',
            title: '诗意海滨民宿',
            subtitle: '尽享海岸风光',
            link: '/search/homestay?type=beach',
        },
    ];
    const bannerItems = items || defaultItems;
    const handleBannerClick = useCallback((item) => {
        if (onBannerClick) {
            onBannerClick(item);
        }
        else if (item.link) {
            navigate(item.link);
        }
    }, [navigate, onBannerClick]);
    const handleChange = useCallback((index) => {
        setCurrentIndex(index);
    }, []);
    return (_jsx("div", { className: styles.container, children: _jsx(Swiper, { autoPlay: autoPlay, duration: interval, defaultValue: 0, onChange: handleChange, className: styles.swiper, loop: true, children: bannerItems.map((item) => (_jsx(Swiper.Item, { children: _jsxs("div", { className: styles.bannerItem, style: { backgroundImage: `url(${item.image})` }, onClick: () => handleBannerClick(item), role: "button", tabIndex: 0, onKeyDown: (e) => {
                        if (e.key === 'Enter') {
                            handleBannerClick(item);
                        }
                    }, children: [_jsx("div", { className: styles.overlay }), _jsxs("div", { className: styles.content, children: [_jsx("h3", { className: styles.title, children: item.title }), item.subtitle && (_jsx("p", { className: styles.subtitle, children: item.subtitle }))] }), _jsxs("div", { className: styles.counter, children: [currentIndex + 1, "/", bannerItems.length] })] }) }, item.id))) }) }));
}
//# sourceMappingURL=index.js.map