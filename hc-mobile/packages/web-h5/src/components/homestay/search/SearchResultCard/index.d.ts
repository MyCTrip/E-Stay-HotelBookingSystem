/**
 * 搜索结果单列卡片 - 响应式布局
 * PC端（>768px）: 左图右文水平布局
 * 移动端（≤768px）: 纵向竖卡片布局
 */
import React from 'react';
import type { HomeStay } from '@estay/shared';
interface SearchResultCardProps {
    data: HomeStay;
    onClick?: (id: string) => void;
    onFavorite?: (id: string, favorited: boolean) => void;
    isFavorited?: boolean;
}
declare const SearchResultCard: React.FC<SearchResultCardProps>;
export default SearchResultCard;
//# sourceMappingURL=index.d.ts.map