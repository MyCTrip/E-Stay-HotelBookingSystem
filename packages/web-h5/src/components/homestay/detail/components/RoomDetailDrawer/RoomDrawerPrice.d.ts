/**
 * 价格与优惠信息 - 符合行业规范（含社交证明）
 */
import React from 'react';
interface Room {
    id: string;
    price: number;
    [key: string]: any;
}
interface RoomDrawerPriceProps {
    room: Room;
}
declare const RoomDrawerPrice: React.FC<RoomDrawerPriceProps>;
export default RoomDrawerPrice;
//# sourceMappingURL=RoomDrawerPrice.d.ts.map