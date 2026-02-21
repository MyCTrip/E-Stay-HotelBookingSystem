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
    price: number;
    priceNote: string;
    benefits: string[];
    packageCount: number;
}
interface RoomSelectionProps {
    data?: any;
    rooms?: Room[];
    displayCount?: number;
}
declare const RoomSelection: React.FC<RoomSelectionProps>;
export default RoomSelection;
//# sourceMappingURL=index.d.ts.map