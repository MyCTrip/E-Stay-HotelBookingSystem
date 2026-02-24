/**
 * FeeNoticeSection 组件数据中间件
 * 数据来源：DetailCenterData.feeNotice
 * 组件接收：deposit、standardGuests、joinNumber、joinPrice、otherDescription、showOther
 */
import type { DetailCenterData, FeeNoticeInfo } from '../detailDataMiddleware';
export interface FeeNoticeSectionParams extends FeeNoticeInfo {
}
export declare const transformCenterDataToFeeNoticeSection: (data: DetailCenterData) => FeeNoticeSectionParams;
export declare const transformFeeNoticeSectionToCenterData: (params: Partial<FeeNoticeSectionParams>) => Partial<DetailCenterData>;
//# sourceMappingURL=feeNoticeSectionMiddleware.d.ts.map