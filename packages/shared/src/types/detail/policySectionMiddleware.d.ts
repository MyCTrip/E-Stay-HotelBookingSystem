/**
 * PolicySection 组件数据中间�?
 * 数据来源：DetailCenterData.policies
 * 组件接收：checkInSpan、checkoutTime、cancelMinute、deadlineTime、amenities
 */
import type { DetailCenterData, CancellationPolicy } from '../detailDataMiddleware';
export interface PolicySectionParams {
    policies: CancellationPolicy[];
}
export declare const transformCenterDataToPolicySection: (data: DetailCenterData) => PolicySectionParams;
export declare const transformPolicySectionToCenterData: (params: Partial<PolicySectionParams>) => Partial<DetailCenterData>;
//# sourceMappingURL=policySectionMiddleware.d.ts.map