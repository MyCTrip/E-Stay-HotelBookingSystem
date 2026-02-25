/**
 * HostInfo 组件数据中间�?
 * 数据来源：DetailCenterData.hostInfo
 * 组件接收：name、avatar、badge、responseRate、responseTime、totalReviews、overallRating、tags
 */
import type { DetailCenterData, HostInfoData } from '../detailDataMiddleware';
export interface HostInfoParams extends HostInfoData {
}
export declare const transformCenterDataToHostInfo: (data: DetailCenterData) => HostInfoParams;
export declare const transformHostInfoToCenterData: (params: Partial<HostInfoParams>) => Partial<DetailCenterData>;
//# sourceMappingURL=hostInfoMiddleware.d.ts.map