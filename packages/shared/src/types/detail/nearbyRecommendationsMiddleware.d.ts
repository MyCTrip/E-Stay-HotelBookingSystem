/**
 * NearbyRecommendations 组件数据中间件
 * 数据来源：DetailCenterData.surroundings
 * 组件接收：fullAddress、community、surroundings
 */
import type { DetailCenterData, SurroundingInfo } from '../detailDataMiddleware';
export interface NearbyRecommendationsParams extends SurroundingInfo {
}
export declare const transformCenterDataToNearbyRecommendations: (data: DetailCenterData) => NearbyRecommendationsParams;
export declare const transformNearbyRecommendationsToCenterData: (params: Partial<NearbyRecommendationsParams>) => Partial<DetailCenterData>;
//# sourceMappingURL=nearbyRecommendationsMiddleware.d.ts.map