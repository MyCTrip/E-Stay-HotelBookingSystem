/**
 * 房型基础信息和床型信息
 */
import React from 'react';
interface Room {
    id: string;
    name: string;
    area: string;
    beds: string;
    guests: string;
    benefits: string[];
    [key: string]: any;
}
interface RoomDrawerBasicInfoProps {
    room: Room;
}
declare const RoomDrawerBasicInfo: React.FC<RoomDrawerBasicInfoProps>;
export default RoomDrawerBasicInfo;
//# sourceMappingURL=RoomDrawerBasicInfo.d.ts.map