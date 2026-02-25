/**
 * 搜索结果页 - 顶部返回栏 + 搜索条件修改栏
 */
import React from 'react';
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
interface SearchResultHeaderProps {
    filters: SearchFilters;
    onModifyClick?: () => void;
}
declare const SearchResultHeader: React.FC<SearchResultHeaderProps>;
export default SearchResultHeader;
//# sourceMappingURL=index.d.ts.map