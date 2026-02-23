/**
 * 房间详情抽屉 - 70%屏幕高度
 */
import React from 'react'
interface Room {
  id: string
  name: string
  area: string
  beds: string
  guests: string
  image: string
  price: number
  priceNote: string
  benefits: string[]
  packageCount: number
  showBreakfastTag?: boolean
  breakfastCount?: number
  showCancelTag?: boolean
}
interface RoomDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  room?: Room
}
declare const RoomDetailDrawer: React.FC<RoomDetailDrawerProps>
export default RoomDetailDrawer
//# sourceMappingURL=index.d.ts.map
