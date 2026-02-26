import axios, { AxiosInstance } from 'axios'
import { IStorage } from '../adapters/storage'
import { HotelQuery } from '../types'

/**
 * API 服务接口定义
 */
export interface IApiService {
  // 酒店接口
  getHotels: (query: HotelQuery) => Promise<any>
  getHotHotels: (limit?: number) => Promise<any>
  getHotelDetail: (id: string) => Promise<any>
  getRoomsByHotel: (hotelId: string, params?: any) => Promise<any>

  // 房型接口
  getRoomDetail: (id: string) => Promise<any>

  // 民宿接口
  homestays: {
    search: (params: any) => Promise<any>
    getDetail: (id: string) => Promise<any>
    getHot: (params?: any) => Promise<any>
  }

  // 房间接口
  rooms: {
    getDetail: (id: string) => Promise<any>
  }

  // 认证接口（预留）
  login: (email: string, password: string) => Promise<any>
  register: (email: string, password: string) => Promise<any>
  getMe: () => Promise<any>
}

/**
 * API 配置
 */
export interface ApiConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
  storage?: IStorage // ✨ 可选的存储适配器（用于获取 auth token）
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
 * 分页响应格式
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

/**
 * 创建 API 实例（工厂函数）
 */
export function createApiService(config: ApiConfig): IApiService {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout || 10000,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
  })

  // 请求拦截：添加 token（使用存储适配器）
  instance.interceptors.request.use(async (config: any) => {
    try {
      let token: string | null = null
      if (config.storage) {
        token = await config.storage.getItem('auth_token')
      } else if (typeof window !== 'undefined') {
        token = localStorage.getItem('auth_token')
      }

      // 核心逻辑：区分“公开接口”和“私有接口”
      const method = config.method?.toLowerCase()
      const url = config.url || ''
      
      // 判断是不是获取酒店或房型列表的 GET 请求（普通游客查房无需 Token）
      const isPublicQuery = method === 'get' && (url.includes('/hotels') || url.includes('/rooms'))

      // 如果没有真实的 token，且【不是】公开接口，才强行塞入暗号（用于预订等需登录的接口）
      if (!token && !isPublicQuery) {
        token = 'test_mock_token_123456789'
      }

      // 如果有 Token 才设置请求头
      if (token) {
        config.headers = config.headers || {}
        if (config.headers.set) {
          config.headers.set('Authorization', `Bearer ${token}`)
        } else {
          config.headers['Authorization'] = `Bearer ${token}`
        }
      }

      // 联调雷达：清晰打印每个请求到底有没有带 Token
      console.log(`[API 准备请求] ${url} | 携带Token: ${token ? '是' : '否(普通游客访问)'}`)

    } catch (err) {
      console.error('[API 拦截器错误]:', err)
    }
    return config
  })

  // 响应拦截：统一错误处理
  instance.interceptors.response.use(
    (res: any) => res.data,
    (err: any) => {
      const message = err.response?.data?.message || err.message || 'Unknown error'
      console.error('[API Error]', message)

      if (err?.response?.status === 401) {
        // 清除 token 并导航到登录
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

  // 返回 API 方法集合
  return {
    getHotels: (query: HotelQuery) => instance.get('/hotels', { params: query }),
    getHotHotels: (limit = 10) => instance.get('/hotels/hot', { params: { limit } }),
    getHotelDetail: (id) => instance.get(`/hotels/${id}`),
    getRoomsByHotel: (hotelId, params) => instance.get(`/hotels/${hotelId}/rooms`, { params }),
    getRoomDetail: (id) => instance.get(`/rooms/${id}`),

    // // 民宿接口
    // homestays: {
    //   search: (params: any) => instance.get('/homestays/search', { params }),
    //   getDetail: (id: string) => instance.get(`/homestays/${id}`),
    //   getHot: (params?: any) => instance.get('/homestays/hot', { params }),
    // },
    // 修正后的民宿接口：复用真实后端的 hotels 路由
    homestays: {
      search: (params: any) => instance.get('/hotels', { params: { ...params, propertyType: 'homeStay' } }),
      getDetail: (id: string) => instance.get(`/hotels/${id}`),
      getHot: (params?: any) => instance.get('/hotels/hot', { params: { ...params, propertyType: 'homeStay', limit: 10 } }),
    },

    // 房间接口
    rooms: {
      getDetail: (id: string) => instance.get(`/rooms/${id}`),
    },

    // Auth endpoints (预留)
    login: (email, password) => instance.post('/auth/login', { email, password }),
    register: (email, password) => instance.post('/auth/register', { email, password }),
    getMe: () => instance.get('/auth/me'),
  }
}

/**
 * Mock API 实现（开发用）
 */
export function createMockApiService(): IApiService {
  return {
    getHotels: async (query): Promise<any> => ({
      data: [
        {
          id: '1',
          market: 'domestic',
          baseInfo: {
            name: '五星级示例酒店',
            star: 5,
            address: '北京市朝阳区',
            description: '优质酒店',
            images: ['https://via.placeholder.com/300x200'],
          },
          facilities: [{ category: '公共', content: '<p>WiFi</p>' }],
          policies: { checkInTime: '14:00', checkOutTime: '12:00', cancellationPolicy: '免费取消' },
          surroundings: [{ surType: 'metro', surName: '天安门地铁站', distanceMeters: 500}],
          rating: { score: 4.8, count: 328 },
        },
      ],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
      },
    }),
    getHotHotels: async (limit = 10): Promise<any> => ([
      {
        _id: '1',
        id: '1',
        baseInfo: {
          nameCn: '热门酒店',
          city: 'Beijing',
          star: 5,
          images: ['https://via.placeholder.com/300x200'],
          address: '北京市',
        },
        market: 'domestic',
        rating: { count: 328, score: 4.8 },
        policies: { cancellationPolicy: '免费取消' },
        surroundings: [{ surType: 'metro', surName: '天安门地铁站', distanceMeters: 500 }],
      },
    ]),
    getHotelDetail: async (id): Promise<any> => ({
      id: id,
      market: 'domestic',
      baseInfo: {
        name: '详情示例酒店',
        star: 4,
        address: '北京市朝阳区',
        description: '优质酒店描述',
        images: ['https://via.placeholder.com/300x200'],
      },
      facilities: [
        { category: '公共', content: '<p>大厅 WiFi</p>' },
        { category: '房间', content: '<p>房间 WiFi</p>' },
      ],
      policies: {
        checkInTime: '14:00',
        checkOutTime: '12:00',
        cancellationPolicy: '免费取消',
      },
      surroundings: [{ surName: '天安门地铁站', surType: 'metro', distanceMeters: 500 }],
      rating: { score: 4.8, count: 328 },
    }),
    getRoomsByHotel: async (hotelId, params): Promise<any> => ({
      data: [
        {
          spuName: '标准间',
          images: ['https://via.placeholder.com/300x200'],
          headInfo: {
            size: '25 sqm',
            floor: '2F',
            wifi: true,
            windowAvailable: true,
            smokingAllowed: false,
          },
          bedInfo: [{ bedType: '双人床', bedNumber: 1, bedSize: '1.8m' }],
          startingPrice: 299,
          skus: [
            {
              roomId: 'room1',
              priceInfo: {
                nightlyPrice: 299,
              },
              status: 'available',
              cancellationRule: '免费取消',
            },
          ],
        },
      ],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
      },
    }),
    getRoomDetail: async (id): Promise<any> => ({
      _id: id,
      roomId: id,
      baseInfo: {
        type: '豪华间',
        price: 599,
        images: ['https://via.placeholder.com/300x200'],
        maxOccupancy: 2,
        status: 'approved',
        facilities: [{ category: '房间', content: '<p>豪华设施 WiFi</p>' }],
        policies: [{ policyType: 'cancellation', content: '<p>免费取消</p>' }],
        bedRemark: ['大床'],
      },
      headInfo: {
        size: '35 sqm',
        floor: '3F',
        wifi: true,
        windowAvailable: true,
        smokingAllowed: false,
      },
      bedInfo: [{ bedType: '大床', bedNumber: 1, bedSize: '2.0m' }],
      breakfastInfo: { breakfastType: '自助早餐' },
    }),

    // 民宿 Mock API
    homestays: {
      search: async (params): Promise<any> => ({
        items: [],
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 10,
      }),
      getDetail: async (id): Promise<any> => ({
        _id: id,
        baseInfo: {
          nameCn: '民宿示例',
          address: '示例地址',
          city: 'Beijing',
          images: [],
        },
      }),
      getHot: async (params): Promise<any> => ([]),
    },

    // 房间 Mock API
    rooms: {
      getDetail: async (id): Promise<any> => ({
        _id: id,
        roomId: id,
        baseInfo: {
          type: '标准间',
          price: 299,
        },
      }),
    },

    // Auth (mock)
    login: async (email, password): Promise<any> => ({ token: 'mock_token_' + Date.now() }),
    register: async (email, password): Promise<any> => ({ id: 'user_' + Date.now(), email }),
    getMe: async (): Promise<any> => ({ id: 'user1', email: 'user@example.com', role: 'user' }),
  }
}

export default createApiService
