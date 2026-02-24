/**
 * RoomDetailDrawer/RoomPackageDetail 组件数据中间�?
 * 数据来源：DetailCenterData.selectedRoom.packages[]
 * 组件接收：title、checkInService、enjoyService、details[]
 */
import type { DetailCenterData, PackageDetail } from '../detailDataMiddleware';
export interface RoomPackageDetailParams extends PackageDetail {
}
export declare const transformCenterDataToRoomPackageDetail: (data: DetailCenterData, packageIndex?: number) => RoomPackageDetailParams;
export declare const transformRoomPackageDetailToCenterData: (params: Partial<RoomPackageDetailParams>) => Partial<DetailCenterData>;
//# sourceMappingURL=roomPackageDetailMiddleware.d.ts.map