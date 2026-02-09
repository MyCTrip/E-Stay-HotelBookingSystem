import api from './api'
import { createRoomService, type Room } from '@estay/shared/services'

// 使用 api 实例创建房型服务
const roomService = createRoomService(api)

// 导出这些函数以保持向后兼容
export { type Room }

export const fetchRoomDetail = roomService.fetchRoomDetail
