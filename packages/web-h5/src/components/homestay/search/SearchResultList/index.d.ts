/**
 * 搜索结果列表容器 - 组合所有4层组件
 */
import React from 'react';
import type { HomeStay } from '@estay/shared';
interface SearchFilters {
    city?: string;
    checkInDate?: string;
    checkOutDate?: string;
    roomCount?: number;
    guestCount?: number;
    priceMin?: number;
    priceMax?: number;
    stars?: number[];
    facilities?: string[];
}
interface SearchResultListProps {
    data?: HomeStay[];
    loading?: boolean;
    filters?: SearchFilters;
    onFiltersChange?: (filters: SearchFilters) => void;
    onModifySearch?: () => void;
}
declare const SearchResultList: React.FC<SearchResultListProps>;
export default SearchResultList;
//# sourceMappingURL=index.d.ts.map