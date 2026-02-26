/**
 * RoomDetailDrawer/RoomDrawerFeeNotice 组件数据中间件
 * 数据来源：DetailCenterData.feeNotice
 * 组件接收：deposit、standardGuests、joinNumber、joinPrice、otherDescription、showOther
 */

import type { DetailCenterData, RoomDrawerFeeNoticeData, FeeNoticeInfo } from '../detailDataMiddleware'

export interface RoomDrawerFeeNoticeParams extends FeeNoticeInfo {}

export const transformCenterDataToRoomDrawerFeeNotice = (
  data: DetailCenterData
): RoomDrawerFeeNoticeParams => {
  return {
    deposit: data.feeNotice?.deposit || 0,
    standardGuests: data.feeNotice?.standardGuests || 0,
    joinNumber: data.feeNotice?.joinNumber || 0,
    joinPrice: data.feeNotice?.joinPrice || 0,
    otherDescription: data.feeNotice?.otherDescription,
    showOther: data.feeNotice?.showOther,
  }
}

export const transformRoomDrawerFeeNoticeToCenterData = (
  params: Partial<RoomDrawerFeeNoticeParams>
): Partial<DetailCenterData> => {
  return {
    feeNotice: params as any,
  }
}
