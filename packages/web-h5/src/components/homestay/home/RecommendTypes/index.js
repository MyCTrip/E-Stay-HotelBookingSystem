import { jsx as _jsx } from "react/jsx-runtime";
/**
 * 推荐类型区域组件
 * 展示多个推荐类型卡片的容器，支持灵活的布局配置
 */
import React from 'react';
import RecommendTypeCard from '../RecommendTypeCard';
import { QualityHouseIcon, PetFriendlyIcon, WeekendDealsIcon } from '../RecommendTypeCard/icons';
import styles from './index.module.scss';
// 默认推荐类型数据
const DEFAULT_RECOMMEND_TYPES = [
    {
        id: 'quality-houses',
        title: '品质好房',
        subtitle: '平台甄选 入住无忧',
        icon: _jsx(QualityHouseIcon, {}),
        backgroundGradient: {
            from: '#FFE4E1',
            to: '#FFC0CB',
        },
        searchParams: {
            city: '上海',
            tag: 'quality',
        },
    },
    {
        id: 'pet-friendly',
        title: '携宠出游',
        subtitle: '带毛孩子撒欢',
        icon: _jsx(PetFriendlyIcon, {}),
        backgroundGradient: {
            from: '#FFF8DC',
            to: '#FFE4B5',
        },
        searchParams: {
            city: '上海',
            tag: 'pet-friendly',
        },
    },
    {
        id: 'weekend-deals',
        title: '周末不加价',
        subtitle: '订民宿折上折',
        icon: _jsx(WeekendDealsIcon, {}),
        backgroundGradient: {
            from: '#E0FFE0',
            to: '#C0FFC0',
        },
        searchParams: {
            city: '上海',
            tag: 'weekend-deals',
        },
    },
];
const RecommendTypes = ({ items = DEFAULT_RECOMMEND_TYPES, columns = 3, gap = 8, padding = 16, className, }) => {
    // 网格样式
    const gridStyle = {
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: typeof gap === 'number' ? `${gap}px` : gap,
        padding: typeof padding === 'number' ? `${padding}px` : padding,
    };
    return (_jsx("div", { className: `${styles.container} ${className || ''}`, style: gridStyle, children: items.map((item) => (_jsx(RecommendTypeCard, { ...item }, item.id))) }));
};
export default React.memo(RecommendTypes);
//# sourceMappingURL=index.js.map