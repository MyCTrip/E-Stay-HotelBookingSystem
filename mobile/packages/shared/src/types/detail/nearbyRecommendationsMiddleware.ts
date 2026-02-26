/**
 * NearbyRecommendations 组件数据中间件
 * 数据来源：DetailCenterData.surroundings
 * 组件接收：fullAddress、community、surroundings
 */

import type { DetailCenterData, NearbyRecommendationsData, SurroundingInfo } from '../detailDataMiddleware'

export interface NearbyRecommendationsParams extends SurroundingInfo {}

export const transformCenterDataToNearbyRecommendations = (
  data: DetailCenterData
): NearbyRecommendationsParams => {
  return {
    fullAddress: data.surroundings?.fullAddress,
    community: data.surroundings?.community,
    surroundings: data.surroundings?.surroundings,
  }
}

export const transformNearbyRecommendationsToCenterData = (
  params: Partial<NearbyRecommendationsParams>
): Partial<DetailCenterData> => {
  return {
    surroundings: params as any,
  }
}
