import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { IStorage } from '../adapters/storage'
// 从刚才定义的 models 中引入完整类型
import { 
  HotelQuery, 
  Hotel, 
  Room, 
  PropertyType 
} from '../types/models'

/**
 * 分页响应格式 (严格对齐你的后端结构)
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

/**
 * API 响应标准格式
 */
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

/**
 * API 服务接口定义 (全面替换 any 为强类型)
 */
export interface IApiService {
  // 酒店接口
  getHotels: (query: HotelQuery) => Promise<ApiResponse<PaginatedResponse<Hotel>>>
  getHotHotels: (limit?: number, isInternational?: boolean) => Promise<ApiResponse<Hotel[]>>
  getHotelDetail: (id: string, isInternational?: boolean) => Promise<ApiResponse<Hotel>>
  
  // 房型接口
  getRoomsByHotel: (hotelId: string, params?: { checkInDate?: string; checkOutDate?: string }, isInternational?: boolean) => Promise<ApiResponse<PaginatedResponse<Room>>>
  getRoomDetail: (id: string, isInternational?: boolean) => Promise<ApiResponse<Room>>

  // 认证接口（预留）
  login: (email: string, password: string) => Promise<ApiResponse<{ token: string }>>
  register: (email: string, password: string) => Promise<ApiResponse<{ id: string; email: string }>>
  getMe: () => Promise<ApiResponse<{ id: string; email: string; role: string }>>
}

/**
 * API 配置 (扩展支持海外域名)
 */
export interface ApiConfig {
  baseURL: string           // 国内主域名
  intlBaseURL?: string      // 海外域名 (可选，未配置则 fallback 到主域名)
  timeout?: number
  headers?: Record<string, string>
  storage?: IStorage        // 可选的存储适配器
}

/**
 * 创建 API 实例（工厂函数）
 */
export function createApiService(config: ApiConfig): IApiService {
  const instance = axios.create({
    baseURL: config.baseURL, // 默认国内域名
    timeout: config.timeout || 10000,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
  })

  // 请求拦截：添加 token
  instance.interceptors.request.use(async (cfg: any) => {
    try {
      let token: string | null = null
      if (config.storage) {
        token = await config.storage.getItem('auth_token')
      } else if (typeof window !== 'undefined') {
        token = localStorage.getItem('auth_token')
      }

      if (token) {
        cfg.headers.Authorization = `Bearer ${token}`
      }
    } catch (err) {
      console.warn('[API] Failed to get auth token:', err)
    }
    return cfg
  })

  // 响应拦截：统一错误处理与解包
  instance.interceptors.response.use(
    (res: any) => res.data, // 自动解包外层的 axios Response，直接返回业务数据
    (err: any) => {
      const message = err.response?.data?.message || err.message || 'Unknown error'
      console.error('[API Error]', message)

      if (err?.response?.status === 401) {
        try {
          if (config.storage) {
            config.storage.removeItem('auth_token')
          } else if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token')
          }
        } catch (e) {
          console.warn('[API] Failed to clear auth token:', e)
        }
      }

      return Promise.reject(new Error(message))
    }
  )

  /**
   * 核心逻辑：动态路由选择器
   * 拦截是否为海外请求，动态重写 AxiosRequestConfig 的 baseURL
   */
  const getRequestConfig = (isInternational?: boolean): AxiosRequestConfig => {
    if (isInternational && config.intlBaseURL) {
      return { baseURL: config.intlBaseURL }
    }
    return {} // 使用 axios 实例默认的 baseURL
  }

  // 返回 API 方法集合
  return {
    getHotels: (query: HotelQuery) => 
      instance.get('/hotels', { 
        ...getRequestConfig(query.isInternational), 
        params: query 
      }),
      
    getHotHotels: (limit = 10, isInternational = false) => 
      instance.get('/hotels/hot', { 
        ...getRequestConfig(isInternational),
        params: { limit } 
      }),
      
    getHotelDetail: (id, isInternational = false) => 
      instance.get(`/hotels/${id}`, getRequestConfig(isInternational)),
      
    getRoomsByHotel: (hotelId, params, isInternational = false) => 
      instance.get(`/hotels/${hotelId}/rooms`, { 
        ...getRequestConfig(isInternational),
        params 
      }),
      
    getRoomDetail: (id, isInternational = false) => 
      instance.get(`/rooms/${id}`, getRequestConfig(isInternational)),

    // Auth endpoints
    login: (email, password) => instance.post('/auth/login', { email, password }),
    register: (email, password) => instance.post('/auth/register', { email, password }),
    getMe: () => instance.get('/auth/me'),
  }
}

/**
 * Mock API 实现（包含移动端专属 displayInfo 与库存展示）
 */
export function createMockApiService(): IApiService {
  return {
    getHotels: async (query): Promise<ApiResponse<PaginatedResponse<Hotel>>> => {
      // 模拟根据 propertyType 和 isInternational 过滤
      const prefix = query.isInternational ? '海外' : '国内';
      
      return {
        code: 200,
        data: {
          items: [
            {
              _id: 'hotel_1',
              baseInfo: {
                nameCn: `${prefix}五星级示例酒店`,
                address: query.isInternational ? 'Chiyoda City, Tokyo' : '北京市朝阳区',
                city: query.city || (query.isInternational ? 'Tokyo' : 'Beijing'),
                star: 5,
                phone: '010-12345678',
                description: '设施完善的豪华酒店',
                images: ['https://via.placeholder.com/300x200'],
                facilities: [{ category: '公共', content: '<p>WiFi</p>' }],
                policies: [{ policyType: 'cancellation', content: '<p>免费取消</p>' }],
                propertyType: query.propertyType || 'hotel'
              },
              auditInfo: { status: 'approved' },
              // ✨ 移动端专属：聚合展示数据
              displayInfo: {
                lowestPrice: 899,
                rating: 4.8,
                reviewCount: 1250,
                distanceText: '距市中心 2.5km',
                tags: ['豪华型', '近地铁', '免费停车']
              }
            },
          ],
          total: 1,
          page: query.page || 1,
          limit: query.limit || 10,
        },
        message: 'success',
      }
    },

    getHotHotels: async (limit = 10, isIntl): Promise<ApiResponse<Hotel[]>> => ({
      code: 200,
      data: [], // 结构同上，此处略作精简
      message: 'success',
    }),

    getHotelDetail: async (id, isIntl): Promise<ApiResponse<Hotel>> => ({
      code: 200,
      data: {
        _id: id,
        baseInfo: {
          nameCn: '详情示例酒店',
          address: '核心商业区',
          city: 'Beijing',
          star: 4,
          phone: '010-12345678',
          description: '优质酒店描述',
          images: ['https://via.placeholder.com/800x400', 'https://via.placeholder.com/800x400'],
          facilities: [
            { category: '公共', content: '<p>大厅 WiFi</p>', icon: 'wifi' },
          ],
          policies: [
            { policyType: 'cancellation', content: '<p>入住前24小时免费取消</p>' },
          ],
        },
        checkinInfo: { checkinTime: '14:00', checkoutTime: '12:00' },
        auditInfo: { status: 'approved' },
        displayInfo: {
          lowestPrice: 599,
          rating: 4.7,
          reviewCount: 888,
          tags: ['精选推荐']
        }
      },
      message: 'success',
    }),

    getRoomsByHotel: async (hotelId, params, isIntl): Promise<ApiResponse<PaginatedResponse<Room>>> => ({
      code: 200,
      data: {
        items: [
          {
            _id: 'room_1',
            hotelId,
            baseInfo: {
              type: '高级标准间',
              price: 699, // 挂牌价
              images: ['https://via.placeholder.com/300x200'],
              maxOccupancy: 2,
              status: 'approved'
            },
            headInfo: {
              size: '30 sqm',
              floor: '5F-8F',
              wifi: true,
              windowAvailable: true,
              smokingAllowed: false,
            },
            bedInfo: [{ bedType: '双人床', bedNumber: 2, bedSize: '1.5m' }],
            breakfastInfo: { breakfastType: '双早' },
            // ✨ 移动端专属：实时库存与售价
            inventory: 5,
            currentPrice: 599, 
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
      },
      message: 'success',
    }),

    getRoomDetail: async (id, isIntl): Promise<ApiResponse<Room>> => ({
      code: 200,
      data: {} as Room, // 同上结构
      message: 'success',
    }),

    // Auth (mock)
    login: async () => ({ code: 200, data: { token: 'mock_token' }, message: 'ok' }),
    register: async () => ({ code: 200, data: { id: '1', email: 'test@test.com' }, message: 'ok' }),
    getMe: async () => ({ code: 200, data: { id: '1', email: 'test@test.com', role: 'user' }, message: 'ok' }),
  }
}

export default createApiService