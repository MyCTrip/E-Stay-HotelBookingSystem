/**
 * 民宿卡片组件 - 瀑布流布局专用
 * 支持收藏、价格对比、用户评价等功能
 */
import React from 'react';
import type { HomeStay } from '@estay/shared';
interface HomeStayCardProps {
    data: HomeStay;
    onClick?: (id: string) => void;
    onFavorite?: (id: string, favorited: boolean) => void;
    showStar?: boolean;
    isFavorited?: boolean;
}
declare const _default: React.NamedExoticComponent<HomeStayCardProps>;
export default _default;
//# sourceMappingURL=index.d.ts.map