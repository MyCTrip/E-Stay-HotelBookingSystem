/**
 * RoomDetailDrawer/RoomDrawerPrice 组件数据中间�?
 * 数据来源：DetailCenterData.selectedRoom �?feePrice
 * 组件接收：id、price、discounts[]
 */
import type { DetailCenterData, DiscountInfo } from '../detailDataMiddleware';
export interface RoomDrawerPriceParams {
    id: string;
    price: number;
    discounts?: DiscountInfo[];
}
export declare const transformCenterDataToRoomDrawerPrice: (data: DetailCenterData) => RoomDrawerPriceParams;
export declare const transformRoomDrawerPriceToCenterData: (params: Partial<RoomDrawerPriceParams>) => Partial<DetailCenterData>;
//# sourceMappingURL=roomDrawerPriceMiddleware.d.ts.map