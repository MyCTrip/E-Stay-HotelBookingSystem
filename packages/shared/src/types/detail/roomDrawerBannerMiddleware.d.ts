/**
 * RoomDetailDrawer/RoomDrawerBanner 组件数据中间�?
 * 数据来源：DetailCenterData.selectedRoom.roomImages
 * 组件接收：images数组，数组项 {category:分类名，url:图片路径}
 */
import type { DetailCenterData } from '../detailDataMiddleware';
export interface RoomDrawerBannerParams {
    images: Array<{
        category?: string;
        url: string;
    }>;
}
export declare const transformCenterDataToRoomDrawerBanner: (data: DetailCenterData) => RoomDrawerBannerParams;
export declare const transformRoomDrawerBannerToCenterData: (params: Partial<RoomDrawerBannerParams>) => Partial<DetailCenterData>;
//# sourceMappingURL=roomDrawerBannerMiddleware.d.ts.map