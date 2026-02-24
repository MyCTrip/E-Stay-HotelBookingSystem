/**
 * RoomDetailDrawer/RoomDrawerPolicy 组件数据中间�?
 * 数据来源：DetailCenterData.policies
 * 组件接收：checkInSpan[]、checkoutTime、cancelMinute、deadlineTime、amenities
 */
import type { DetailCenterData, CancellationPolicy } from '../detailDataMiddleware';
export interface RoomDrawerPolicyParams {
    policies: CancellationPolicy[];
}
export declare const transformCenterDataToRoomDrawerPolicy: (data: DetailCenterData) => RoomDrawerPolicyParams;
export declare const transformRoomDrawerPolicyToCenterData: (params: Partial<RoomDrawerPolicyParams>) => Partial<DetailCenterData>;
//# sourceMappingURL=roomDrawerPolicyMiddleware.d.ts.map