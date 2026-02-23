/**
 * 排序筛选组件 - 内容only
 * 左侧仅文本，右侧选中有√符号
 */
import React from 'react';
type SortType = 'smart' | 'priceAsc' | 'priceDesc' | 'ratingDesc' | 'distanceAsc';
interface SortFilterProps {
    sortBy: SortType;
    onSortChange: (sort: SortType) => void;
}
declare const SortFilter: React.FC<SortFilterProps>;
export default SortFilter;
//# sourceMappingURL=index.d.ts.map