/**
 * RoomCard 组件数据中间�?
 * 数据来源：DetailCenterData.rooms[]
 * 组件接收：_id、name、area、beds、guests、image、priceList、priceNote、benefits、confirmTime�?
 */
import type { DetailCenterData, RoomCardData } from '../detailDataMiddleware';
export interface RoomCardParams extends RoomCardData {
}
export declare const transformCenterDataToRoomCard: (data: DetailCenterData) => RoomCardParams[];
export declare const transformRoomCardToCenterData: (params: Partial<RoomCardParams[]>) => Partial<DetailCenterData>;
//# sourceMappingURL=roomCardMiddleware.d.ts.map