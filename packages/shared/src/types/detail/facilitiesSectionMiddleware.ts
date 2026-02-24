/**
 * FacilitiesSection 组件数据中间件
 * 数据来源：DetailCenterData
 * 组件接收：FacilityCategory[]
 */

import type { DetailCenterData, FacilitiesSectionData, FacilityCategory } from '../detailDataMiddleware'

export interface FacilitiesSectionParams {
  facilities: FacilityCategory[]
}

export const transformCenterDataToFacilitiesSection = (
  data: DetailCenterData
): FacilitiesSectionParams => {
  return {
    facilities: data.facilities || [],
  }
}

export const transformFacilitiesSectionToCenterData = (
  params: Partial<FacilitiesSectionParams>
): Partial<DetailCenterData> => {
  return {
    facilities: params.facilities,
  }
}
