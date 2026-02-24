/**
 * FeeNoticeSection 组件数据中间件
 * 数据来源：DetailCenterData.feeNotice
 * 组件接收：deposit、standardGuests、joinNumber、joinPrice、otherDescription、showOther
 */

import type { DetailCenterData, FeeNoticeSectionData, FeeNoticeInfo } from '../detailDataMiddleware'

export interface FeeNoticeSectionParams extends FeeNoticeInfo {}

export const transformCenterDataToFeeNoticeSection = (
  data: DetailCenterData
): FeeNoticeSectionParams => {
  return {
    deposit: data.feeNotice?.deposit || 0,
    standardGuests: data.feeNotice?.standardGuests || 0,
    joinNumber: data.feeNotice?.joinNumber || 0,
    joinPrice: data.feeNotice?.joinPrice || 0,
    otherDescription: data.feeNotice?.otherDescription,
    showOther: data.feeNotice?.showOther,
  }
}

export const transformFeeNoticeSectionToCenterData = (
  params: Partial<FeeNoticeSectionParams>
): Partial<DetailCenterData> => {
  return {
    feeNotice: params as any,
  }
}
