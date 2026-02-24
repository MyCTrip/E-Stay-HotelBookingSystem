/**
 * PolicySection 组件数据中间件
 * 数据来源：DetailCenterData.policies
 * 组件接收：checkInSpan、checkoutTime、cancelMinute、deadlineTime、amenities
 */

import type { DetailCenterData, PolicySectionData, CancellationPolicy } from '../detailDataMiddleware'

export interface PolicySectionParams {
  policies: CancellationPolicy[]
}

export const transformCenterDataToPolicySection = (
  data: DetailCenterData
): PolicySectionParams => {
  return {
    policies: data.policies || [],
  }
}

export const transformPolicySectionToCenterData = (
  params: Partial<PolicySectionParams>
): Partial<DetailCenterData> => {
  return {
    policies: params.policies,
  }
}
