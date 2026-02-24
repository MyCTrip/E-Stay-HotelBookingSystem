/**
 * RoomDetailDrawer/RoomDrawerPolicy 组件数据中间件
 * 数据来源：DetailCenterData.policies
 * 组件接收：checkInSpan[]、checkoutTime、cancelMinute、deadlineTime、amenities
 */

import type { DetailCenterData, RoomDrawerPolicyData, CancellationPolicy } from '../detailDataMiddleware'

export interface RoomDrawerPolicyParams {
  policies: CancellationPolicy[]
}

export const transformCenterDataToRoomDrawerPolicy = (
  data: DetailCenterData
): RoomDrawerPolicyParams => {
  return {
    policies: data.policies || [],
  }
}

export const transformRoomDrawerPolicyToCenterData = (
  params: Partial<RoomDrawerPolicyParams>
): Partial<DetailCenterData> => {
  return {
    policies: params.policies,
  }
}
