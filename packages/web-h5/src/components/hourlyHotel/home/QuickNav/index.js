import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
/**
 * 民宿首页快速导航组件（金刚区）
 * 2x4网格布局，8个快速入口
 * 遵循规范：
 * - 每个item ≥44*44pt 点击区域
 * - icon 48pt，底部12pt文字
 * - 左右边距16pt, 行间距10-12pt
 * - 圆角8-12pt，图标背景渐变
 */
export default function QuickNav({ items }) {
    const navigate = useNavigate();
    const defaultItems = [
        {
            id: 'family',
            icon: '👨‍👩‍👧‍👦',
            label: '亲子民宿',
            action: () => navigate('/search/homestay?type=family'),
        },
        {
            id: 'luxury',
            icon: '✨',
            label: '豪华民宿',
            action: () => navigate('/search/homestay?type=luxury'),
        },
        {
            id: 'wifi',
            icon: '📡',
            label: '免费WiFi',
            action: () => navigate('/search/homestay?facilities=wifi'),
        },
        {
            id: 'scenic',
            icon: '🏔️',
            label: '景区周边',
            action: () => navigate('/search/homestay?type=scenic'),
        },
        {
            id: 'hot',
            icon: '🔥',
            label: '热门推荐',
            action: () => navigate('/search/homestay?sort=hot'),
        },
        {
            id: 'discount',
            icon: '🎉',
            label: '优惠活动',
            action: () => navigate('/search/homestay?discount=true'),
        },
        {
            id: 'new',
            icon: '⭐',
            label: '新上线',
            action: () => navigate('/search/homestay?sort=new'),
        },
        {
            id: 'whole',
            icon: '🏠',
            label: '独栋民宿',
            action: () => navigate('/search/homestay?wholeHouse=true'),
        },
    ];
    const navItems = items || defaultItems;
    const handleItemClick = useCallback((item) => {
        item.action?.();
    }, []);
    return (_jsx("div", { className: styles.container, children: _jsx("nav", { className: styles.grid, children: navItems.map((item) => (_jsxs("button", { className: styles.navItem, onClick: () => handleItemClick(item), role: "button", tabIndex: 0, onKeyDown: (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleItemClick(item);
                    }
                }, children: [_jsx("div", { className: styles.iconWrapper, children: item.icon }), _jsx("span", { className: styles.label, children: item.label })] }, item.id))) }) }));
}
//# sourceMappingURL=index.js.map