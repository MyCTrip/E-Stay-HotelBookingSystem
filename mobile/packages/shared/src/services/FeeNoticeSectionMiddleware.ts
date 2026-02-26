/**
 * FeeNoticeSection 组件数据中间件
 * 职责：从中央数据提取并格式化费用通知信息
 */

import type { DetailCenterData, FeeNoticeInfo } from '../types/detailDataMiddleware'

export const feeNoticeSectionMiddleware = {
  /**
   * 获取 FeeNoticeSection 组件所需的数据
   */
  getData: (centerData: DetailCenterData): FeeNoticeInfo => {
    const { feeNotice } = centerData
    
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
