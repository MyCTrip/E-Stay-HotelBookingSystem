/**
 * 地图视图组件 - 显示民宿在地图上的位置
 * 使用高德地图或腾讯地图API
 */
import React from 'react';
import type { HomeStay } from '@estay/shared';
interface MapViewProps {
    data: HomeStay[];
    filters?: {
        city?: string;
        checkInDate?: string;
        checkOutDate?: string;
    };
    onMarkerClick?: (id: string) => void;
}
declare const MapView: React.FC<MapViewProps>;
export default MapView;
//# sourceMappingURL=index.d.ts.map