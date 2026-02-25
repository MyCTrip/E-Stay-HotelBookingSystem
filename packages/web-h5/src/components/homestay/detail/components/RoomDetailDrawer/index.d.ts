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
    price: number;
    priceNote: string;
    benefits: string[];
    packageCount: number;
}
interface RoomDetailDrawerProps {
    room: Room | null;
    isOpen: boolean;
    onClose: () => void;
    onBook?: (roomId: string) => void;
}
declare const RoomDetailDrawer: React.FC<RoomDetailDrawerProps>;
export default RoomDetailDrawer;
//# sourceMappingURL=index.d.ts.map