/**
 * 价格与优惠信息 - 符合行业规范
 * 展示房费、优惠、最终价格等信息
 */
import React from 'react';
interface Discount {
    name: string;
    description: string;
    amount: number;
}
interface Room {
    id: string;
    priceList: Array<{
        packageId: number;
        originPrice: number;
        currentPrice: number;
    }>;
    discounts?: Discount[];
}
interface RoomDrawerPriceProps {
    room: Room;
    checkIn?: string;
    checkOut?: string;
}
declare const RoomDrawerPrice: React.FC<RoomDrawerPriceProps>;
export default RoomDrawerPrice;
//# sourceMappingURL=index.d.ts.map