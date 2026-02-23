/**
 * 价格/人数筛选组件 - 内容only 合并了 PriceFilter 和 RoomTypeModal
 */
import React from 'react';
interface PriceGuestFilterProps {
    minPrice?: number;
    maxPrice?: number;
    guests?: number;
    beds?: number;
    rooms?: number;
    onPriceChange?: (minPrice: number, maxPrice: number) => void;
    onGuestChange?: (guests: number, beds: number, rooms: number) => void;
    onConfirm?: () => void;
}
declare const PriceGuestFilter: React.FC<PriceGuestFilterProps>;
export default PriceGuestFilter;
//# sourceMappingURL=index.d.ts.map