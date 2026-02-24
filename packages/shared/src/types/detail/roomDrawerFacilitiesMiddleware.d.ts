/**
 * RoomDetailDrawer/RoomDrawerFacilities 组件数据中间�?
 * 数据来源：DetailCenterData.facilities
 * 组件接收：FacilityCategory[]数组
 */
import type { DetailCenterData, FacilityCategory } from '../detailDataMiddleware';
export interface RoomDrawerFacilitiesParams {
    facilities: FacilityCategory[];
}
export declare const transformCenterDataToRoomDrawerFacilities: (data: DetailCenterData) => RoomDrawerFacilitiesParams;
export declare const transformRoomDrawerFacilitiesToCenterData: (params: Partial<RoomDrawerFacilitiesParams>) => Partial<DetailCenterData>;
//# sourceMappingURL=roomDrawerFacilitiesMiddleware.d.ts.map