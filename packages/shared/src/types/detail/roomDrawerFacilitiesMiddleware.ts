// @ts-nocheck
/**
 * RoomDetailDrawer/RoomDrawerFacilities 组件数据中间�?
 * 数据来源：DetailCenterData.facilities
 * 组件接收：FacilityCategory[]数组
 */

import type { DetailCenterData, RoomDrawerFacilitiesData, FacilityCategory } from '../detailDataMiddleware'

export interface RoomDrawerFacilitiesParams {
  facilities: FacilityCategory[]
}

export const transformCenterDataToRoomDrawerFacilities = (
  data: DetailCenterData
): RoomDrawerFacilitiesParams => {
  return {
    facilities: data.facilities || [],
  }
}

export const transformRoomDrawerFacilitiesToCenterData = (
  params: Partial<RoomDrawerFacilitiesParams>
): Partial<DetailCenterData> => {
  return {
    facilities: params.facilities,
  }
}

