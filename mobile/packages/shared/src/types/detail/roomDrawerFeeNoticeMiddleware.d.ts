/**
 * RoomDetailDrawer/RoomDrawerFeeNotice 组件数据中间件
 * 数据来源：DetailCenterData.feeNotice
 * 组件接收：deposit、standardGuests、joinNumber、joinPrice、otherDescription、showOther
 */
import type { DetailCenterData, FeeNoticeInfo } from '../detailDataMiddleware';
export interface RoomDrawerFeeNoticeParams extends FeeNoticeInfo {
}
export declare const transformCenterDataToRoomDrawerFeeNotice: (data: DetailCenterData) => RoomDrawerFeeNoticeParams;
export declare const transformRoomDrawerFeeNoticeToCenterData: (params: Partial<RoomDrawerFeeNoticeParams>) => Partial<DetailCenterData>;
//# sourceMappingURL=roomDrawerFeeNoticeMiddleware.d.ts.map