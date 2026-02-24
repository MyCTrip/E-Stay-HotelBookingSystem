/**
 * RoomDetailDrawer/RoomPackageDetail 组件数据中间件
 * 数据来源：DetailCenterData.selectedRoom.packages[]
 * 组件接收：title、checkInService、enjoyService、details[]
 */

import type { DetailCenterData, RoomPackageDetailData, PackageDetail } from '../detailDataMiddleware'

export interface RoomPackageDetailParams extends PackageDetail {}

export const transformCenterDataToRoomPackageDetail = (
  data: DetailCenterData,
  packageIndex: number = 0
): RoomPackageDetailParams => {
  const selectedPackage = data.selectedRoom?.packages?.[packageIndex]
  
  return {
    title: selectedPackage?.name || '',
    checkInService: '',
    enjoyService: '',
    details: [],
  }
}

export const transformRoomPackageDetailToCenterData = (
  params: Partial<RoomPackageDetailParams>
): Partial<DetailCenterData> => {
  return {}
}
