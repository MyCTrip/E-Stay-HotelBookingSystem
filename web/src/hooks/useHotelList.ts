import { createUseHotelList, createUseHotelDetail } from '@estay/shared/hooks'
import api from '../services/api'

// 使用 api 实例创建 hooks
export const useHotelList = createUseHotelList(api)
export const useHotelDetail = createUseHotelDetail(api)
