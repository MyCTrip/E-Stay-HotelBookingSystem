/**
 * 房型选择区 - 核心转化模块
 */
import React from 'react';
interface Room {
    id: string;
    name: string;
    area: string;
    beds: string;
    guests: string;
    image: string;
    priceList: Array<{
        packageId: number;
        originPrice: number;
        currentPrice: number;
    }>;
    priceNote: string;
    benefits: string[];
    packageCount: number;
    confirmTime: string;
    showBreakfastTag?: boolean;
    breakfastCount?: number;
    showCancelTag?: boolean;
    cancelMunite?: number;
    hasPackageDetail?: boolean;
    packages?: Array<{
        packageId: number;
        name: string;
        showPackageDetail?: boolean;
        showBreakfastTag?: boolean;
        breakfastCount?: number;
        showCancelTag?: boolean;
        cancelMunite?: number;
        showComfirmTag?: boolean;
        confirmTime?: number;
    }>;
}
interface RoomSelectionProps {
    rooms: Room[];
    displayCount?: number;
    onSelectRoom?: (room: Room) => void;
    checkIn?: string;
    checkOut?: string;
    facilities?: any[];
    policies?: any[];
    feeInfo?: any;
}
declare const RoomSelection: React.FC<RoomSelectionProps>;
export default RoomSelection;
//# sourceMappingURL=index.d.ts.map