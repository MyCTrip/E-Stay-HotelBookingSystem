/**
 * 完整的筛选面板 - 侧滑抽屉式
 */
import React from 'react';
export interface FilterState {
    priceMin: number;
    priceMax: number;
    stars: number[];
    facilities: string[];
}
interface FilterPanelProps {
    visible: boolean;
    onClose?: () => void;
    onApply?: (filters: FilterState) => void;
    initialFilters?: FilterState;
}
declare const FilterPanel: React.FC<FilterPanelProps>;
export default FilterPanel;
//# sourceMappingURL=index.d.ts.map