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
    price: number;
    priceNote: string;
    benefits: string[];
    packageCount: number;
}
interface RoomCardProps {
    room: Room;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onViewDetails?: (room: Room) => void;
}
declare const RoomCard: React.FC<RoomCardProps>;
export default RoomCard;
//# sourceMappingURL=RoomCard.d.ts.map