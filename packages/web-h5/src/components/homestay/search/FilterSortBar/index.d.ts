/**
 * 搜索结果页 - 筛选/排序栏
 * 包含4个筛选组件：排序、位置、价格/人数、设施
 * 滚动隐藏/显示功能 - 使用 Intersection Observer
 */
import React from 'react';
type SortType = 'smart' | 'priceAsc' | 'priceDesc' | 'ratingDesc' | 'distanceAsc';
type ViewMode = 'list' | 'grid';
interface FilterSortBarProps {
    sortBy: SortType;
    onSortChange: (sort: SortType) => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    location?: string;
    onLocationChange?: (location: string) => void;
    minPrice?: number;
    maxPrice?: number;
    guests?: number;
    beds?: number;
    rooms?: number;
    onPriceChange?: (minPrice: number, maxPrice: number) => void;
    onGuestChange?: (guests: number, beds: number, rooms: number) => void;
    facilities?: string[];
    onFacilitiesChange?: (facilities: string[]) => void;
    hasActiveFilters?: boolean;
}
declare const FilterSortBar: React.FC<FilterSortBarProps>;
export default FilterSortBar;
//# sourceMappingURL=index.d.ts.map