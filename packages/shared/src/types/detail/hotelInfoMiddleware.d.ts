/**
 * HotelInfo 组件数据中间件
 * 数据来源：DetailCenterData.baseInfo
 * 组件接收：name、brand、tags、rating、reviewCount、star、address、area、room、bed、guests
 */
import type { DetailCenterData, HotelInfoData } from '../detailDataMiddleware';
export interface HotelInfoParams extends HotelInfoData {
}
/**
 * 从DetailCenterData转换为HotelInfo格式
 */
export declare const transformCenterDataToHotelInfo: (data: DetailCenterData) => HotelInfoParams;
/**
 * 从HotelInfo格式转换回CenterData格式（用于数据更新）
 */
export declare const transformHotelInfoToCenterData: (params: Partial<HotelInfoParams>) => Partial<DetailCenterData>;
//# sourceMappingURL=hotelInfoMiddleware.d.ts.map