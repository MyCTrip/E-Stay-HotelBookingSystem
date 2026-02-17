/**
 * 房型图片轮播区 - 抽屉顶部banner
 */
import React from 'react';
interface Room {
    id: string;
    name: string;
    image: string;
    [key: string]: any;
}
interface RoomDrawerBannerProps {
    room: Room;
}
declare const RoomDrawerBanner: React.FC<RoomDrawerBannerProps>;
export default RoomDrawerBanner;
//# sourceMappingURL=RoomDrawerBanner.d.ts.map