/**
 * 单个房型卡片 - 符合行业规范
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
interface RoomCardProps {
    room: Room;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onViewDetails?: (room: Room, packageId?: number) => void;
    onOpenDetail?: (room: Room, packageId?: number) => void;
    showLabel?: boolean;
}
declare const RoomCard: React.FC<RoomCardProps>;
export default RoomCard;
//# sourceMappingURL=index.d.ts.map