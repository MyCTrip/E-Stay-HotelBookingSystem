/**
 * 房型详情抽屉栏 - 底部上滑展示房型完整信息
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
    hasPackageDetail?: boolean;
    showBreakfastTag?: boolean;
    breakfastCount?: number;
    showCancelTag?: boolean;
    cancelMunite?: number;
    confirmTime?: string;
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
interface RoomDetailDrawerProps {
    room: Room | null;
    selectedPackageId?: number;
    isOpen: boolean;
    onClose: () => void;
    onBook?: (roomId: string) => void;
    scrollToFacilities?: boolean;
    facilitiesExpanded?: boolean;
    scrollToPolicy?: boolean;
    scrollToFeeNotice?: boolean;
    actualRoomName?: string;
    checkIn?: string;
    checkOut?: string;
    facilitiesData?: any[];
    policiesData?: any[];
    feeInfoData?: any;
}
declare const RoomDetailDrawer: React.FC<RoomDetailDrawerProps>;
export default RoomDetailDrawer;
//# sourceMappingURL=index.d.ts.map