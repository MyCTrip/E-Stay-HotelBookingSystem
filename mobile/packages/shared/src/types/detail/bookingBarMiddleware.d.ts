/**
 * BookingBar 组件数据中间件
 * 数据来源：DetailCenterData
 * 组件接收：host、priceList、totalPrice、deadlineTime
 */
import type { DetailCenterData, BookingBarData } from '../detailDataMiddleware';
export interface BookingBarParams extends BookingBarData {
}
export declare const transformCenterDataToBookingBar: (data: DetailCenterData) => BookingBarParams;
export declare const transformBookingBarToCenterData: (params: Partial<BookingBarParams>) => Partial<DetailCenterData>;
//# sourceMappingURL=bookingBarMiddleware.d.ts.map