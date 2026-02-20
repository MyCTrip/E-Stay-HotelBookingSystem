/**
 * 搜索结果页 - 筛选/排序栏
 */
import React from 'react';
type SortType = 'smart' | 'priceAsc' | 'priceDesc' | 'ratingDesc' | 'distanceAsc';
type ViewMode = 'list' | 'grid' | 'map';
interface FilterSortBarProps {
    sortBy: SortType;
    onSortChange: (sort: SortType) => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    onPriceFilter?: () => void;
    onStarFilter?: () => void;
    onFacilityFilter?: () => void;
    onFilterClick?: () => void;
    hasActiveFilters?: boolean;
}
declare const FilterSortBar: React.FC<FilterSortBarProps>;
export default FilterSortBar;
//# sourceMappingURL=index.d.ts.map