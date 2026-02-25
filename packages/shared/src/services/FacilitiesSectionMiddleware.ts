/**
 * FacilitiesSection 组件数据中间件
 * 职责：从中央数据提取并格式化设施信息
 */

import type { DetailCenterData, FacilityCategory } from '../types/detailDataMiddleware'

export const facilitiesSectionMiddleware = {
  /**
   * 获取 FacilitiesSection 组件所需的数据
   */
  getData: (centerData: DetailCenterData): FacilityCategory[] => {
    const { facilites } = centerData
    return facilites.facilities
  },
}
