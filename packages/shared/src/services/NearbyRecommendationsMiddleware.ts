/**
 * NearbyRecommendations 组件数据中间件
 * 职责：从中央数据提取并格式化周边推荐信息
 */

import type { DetailCenterData, SurroundingInfo } from '../types/detailDataMiddleware'

export const nearbyRecommendationsMiddleware = {
  /**
   * 获取 NearbyRecommendations 组件所需的数据
   */
  getData: (centerData: DetailCenterData): SurroundingInfo => {
    const { surroundings } = centerData
    
    if (!surroundings) {
      return {
        fullAddress: '',
        community: {
          name: '',
          belongTo: '',
          buildAge: 0,
          buildType: '',
        },
        surroundings: [],
      }
    }

    return {
      fullAddress: surroundings.fullAddress,
      community: surroundings.community,
      surroundings: surroundings.surroundings,
    }
  },
}
