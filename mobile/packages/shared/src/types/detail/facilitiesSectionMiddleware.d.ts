/**
 * FacilitiesSection 组件数据中间�?
 * 数据来源：DetailCenterData
 * 组件接收：FacilityCategory[]
 */
import type { DetailCenterData, FacilityCategory } from '../detailDataMiddleware';
export interface FacilitiesSectionParams {
    facilities: FacilityCategory[];
}
export declare const transformCenterDataToFacilitiesSection: (data: DetailCenterData) => FacilitiesSectionParams;
export declare const transformFacilitiesSectionToCenterData: (params: Partial<FacilitiesSectionParams>) => Partial<DetailCenterData>;
//# sourceMappingURL=facilitiesSectionMiddleware.d.ts.map