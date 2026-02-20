/**
 * 价格筛选组件
 * 从网页窗口底部滑入，高度自适应
 */
import React from 'react';
interface PriceFilterProps {
    visible: boolean;
    minPrice?: number;
    maxPrice?: number;
    onSelect: (minPrice: number, maxPrice: number) => void;
    onClose: () => void;
}
declare const PriceFilter: React.FC<PriceFilterProps>;
export default PriceFilter;
//# sourceMappingURL=index.d.ts.map