/**
 * 房型图片轮播区 - 抽屉顶部banner，支持平滑拖动
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
    showTabHeader?: boolean;
}
declare const RoomDrawerBanner: React.FC<RoomDrawerBannerProps>;
export default RoomDrawerBanner;
//# sourceMappingURL=index.d.ts.map