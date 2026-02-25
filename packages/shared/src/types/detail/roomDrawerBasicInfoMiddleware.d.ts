/**
 * RoomDetailDrawer/RoomDrawerBasicInfo 组件数据中间�?
 * 数据来源：DetailCenterData.selectedRoom
 * 组件接收：id、name、area、beds、guests、breakfastCount、room[]
 */
import type { DetailCenterData, RoomDrawerBasicInfoData } from '../detailDataMiddleware';
export interface RoomDrawerBasicInfoParams extends RoomDrawerBasicInfoData {
}
export declare const transformCenterDataToRoomDrawerBasicInfo: (data: DetailCenterData) => RoomDrawerBasicInfoParams;
export declare const transformRoomDrawerBasicInfoToCenterData: (params: Partial<RoomDrawerBasicInfoParams>) => Partial<DetailCenterData>;
//# sourceMappingURL=roomDrawerBasicInfoMiddleware.d.ts.map