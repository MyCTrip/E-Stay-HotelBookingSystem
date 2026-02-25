/**
 * RoomDrawerFeeNotice 组件数据中间件
 * 职责：从中央数据提取并格式化房间费用通知信息
 */

import type { DetailCenterData, RoomDrawerFeeNoticeData } from '../types/detailDataMiddleware'

export const roomDrawerFeeNoticeMiddleware = {
  /**
   * 获取 RoomDrawerFeeNotice 组件所需的数据
   */
  getData: (centerData: DetailCenterData): RoomDrawerFeeNoticeData => {
    const { selectedRoom } = centerData
    
    if (!selectedRoom) {
      return {
        deposit: 0,
        standardGuests: 0,
        joinNumber: 0,
        joinPrice: 0,
      }
    }

    const { feeNotice } = selectedRoom
    
    return {
      deposit: feeNotice.deposit,
      standardGuests: feeNotice.standardGuests,
      joinNumber: feeNotice.joinNumber,
      joinPrice: feeNotice.joinPrice,
      otherDescription: feeNotice.otherDescription,
      showOther: feeNotice.showOther,
    }
  },
}
