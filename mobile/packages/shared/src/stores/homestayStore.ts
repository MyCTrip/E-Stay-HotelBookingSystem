/**
 * 民宿 Zustand Store
 * 管理搜索、详情、推荐等所有民宿相关状态
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import dayjs from 'dayjs'
import type { Hotel, Room, HomeStaySearchParams, PaginationMeta } from '../types'
import type { HomeStay } from '../types/homestay'
import {
  POPULAR_HOMESTAYS,
  SEARCH_RESULT_HOMESTAYS,
  getRecommendedHomestays,
  HOMESTAY_DETAIL_MOCK,
  NEARBY_ROOMS,
} from '../mocks'
import type { IApiService } from '../api'

// 定义一个内部的 api 变量，用来接收外部传进来的请求实例
let _api: IApiService | null = null;

// 初始化方法
export const initHomestayStoreApi = (api: IApiService) => {
  _api = api;
}

// ============ 类型定义 ============

/** 本地副本类型 - 用于暂存修改不直接更新Store */
export interface DetailLocalCopy {
  homeStay: HomeStay
  selectedRoomId?: string
  checkInDate?: string
  checkOutDate?: string
  otherModifications?: Record<string, any>
}

/** 详情页上下文状态 - 仅UI交互状态 */
export interface DetailContextState {
  selectedRoomName: string
  selectedRoomId?: string
  expandNearbyProperties: boolean
  currentTab: string
  activeDrawer?: 'room' | 'facilities' | null
  scrollPosition?: number
  checkInDate?: string
  checkOutDate?: string
  deadlineTime?: number
  // 本地副本相关
  isEditing?: boolean
  localCopy?: DetailLocalCopy
  modifiedFields?: Set<string>
}

/** 搜索 UI 状态 */
export interface SearchUIState {
  activeModal?: 'location' | 'date' | 'guests' | 'filter' | null
  isFilterPanelOpen: boolean
  currentSort: 'price' | 'rating' | 'popularity' | 'newest'
  viewMode: 'list' | 'map'
}

/** Store 状态接口 */
export interface HomestayStoreState {
  // ===== 搜索域 =====
  searchParams: HomeStaySearchParams | null
  homestays: HomeStay[]
  pagination: PaginationMeta
  searchLoading: boolean
  searchError: string | null

  // ===== 详情域 =====
  currentHomestay: HomeStay | null
  detailContext: DetailContextState
  detailLoading: boolean
  detailError: string | null

  // ===== 推荐域 =====
  hotHomestays: HomeStay[]
  recommendedHomestays: HomeStay[]
  nearbyRooms: Room[]

  // ===== UI 状态 =====
  searchUIState: SearchUIState

  // ===== Actions: 搜索 =====
  setSearchParams(params: HomeStaySearchParams): void
  fetchSearchResults(params: HomeStaySearchParams): Promise<void>
  loadMoreSearchResults(): Promise<void>
  setSearchUIState(state: Partial<SearchUIState>): void

  // ===== Actions: 详情 =====
  fetchHomestayDetail(id: string): Promise<void>
  setCurrentHomestay(homestay: HomeStay | null): void
  updateDetailContext(context: Partial<DetailContextState>): void
  // 本地副本相关
  startEditingDetail(): void
  setDetailLocalCopy(data: Partial<DetailLocalCopy>): void
  commitDetailLocalCopy(): void
  revertDetailLocalCopy(): void
  resetDetailLocalCopy(): void

  // ===== Actions: 推荐 =====
  loadHotHomestays(): Promise<void>
  loadRecommendedHomestays(city?: string, priceMin?: number, priceMax?: number): Promise<void>
  loadNearbyRooms(homestayId: string): Promise<void>

  // ===== Actions: 清理 =====
  clearCurrentHomestay(): void
  clearErrors(): void
  reset(): void
}

// ============ Store 创建 ============

export const useHomestayStore = create<HomestayStoreState>()(
  persist(
    (set, get) => ({
      // ===== 初始状态 =====
      searchParams: null,
      homestays: [],
      pagination: { page: 1, limit: 20, total: 0 },
      searchLoading: false,
      searchError: null,

      currentHomestay: null,
      detailContext: {
        selectedRoomName: '',
        expandNearbyProperties: false,
        currentTab: 'overview',
        checkInDate: dayjs().format('YYYY-MM-DD'),
        checkOutDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        deadlineTime: 30,
      },
      detailLoading: false,
      detailError: null,

      hotHomestays: [],
      recommendedHomestays: [],
      nearbyRooms: [],

      searchUIState: {
        activeModal: null,
        isFilterPanelOpen: false,
        currentSort: 'popularity',
        viewMode: 'list',
      },

      // ===== 搜索 Actions =====

      /** 设置搜索参数 */
      setSearchParams: (params: HomeStaySearchParams) => {
        set({ searchParams: params })
      },

      /** 执行搜索(真实后端优先，Mock 数据兜底) */
      fetchSearchResults: async (params: HomeStaySearchParams) => {
        set({ searchLoading: true, searchError: null })
        // ==========================================
        // 🌟 阶段 1：如果有注入 api，尝试请求真实后端
        // ==========================================
        if (_api) {
          try {
            // 直接调用我们在 api/index.ts 里改好的 search 方法
            const res = await _api.homestays.search(params) as any;
            
            const realData = res.data || [];
            const meta = res.meta || {};

            // 【核心判断】：如果后端真的有民宿数据
            if (realData.length > 0) {
              console.log('✅ 成功拉取真实后端民宿数据！');
              set({
                homestays: realData as HomeStay[],
                pagination: {
                  page: meta.page || params.page || 1,
                  limit: meta.limit || params.limit || 20,
                  total: meta.total || realData.length,
                },
                searchParams: params,
                searchLoading: false,
              })
              return; // 🌟 成功拿到真实数据，直接结束函数，不跑 Mock！
            } else {
              console.warn('⚠️ 真实后端请求成功，但数据库中暂无民宿数据。准备降级...');
            }
          } catch (error) {
            console.warn('⚠️ 真实后端请求失败，准备降级加载 Mock...', error);
          }
        }

        // ==========================================
        // 🌟 阶段 2：容错兜底，加载本地 Mock 数据
        // ==========================================
        try {
          // 模拟 API 延迟
          await new Promise((resolve) => setTimeout(resolve, 500))

          // Mock 数据处理：根据参数筛选
          let results = [...(SEARCH_RESULT_HOMESTAYS as any[])]

          // TODO: 暂时不按城市筛选，显示所有民宿卡片
          // 匹配搜索条件的功能后续实现
          // results = results.filter((h) => h.baseInfo.city === params.city)

          // 按价格筛选
          if (params.priceMin || params.priceMax) {
            results = results.filter((h: any) => {
              const minPrice = h.rooms?.[0]?.baseInfo?.price || h.price || 0
              if (params.priceMin && minPrice < params.priceMin) return false
              if (params.priceMax && minPrice > params.priceMax) return false
              return true
            })
          }

          // 按关键词筛选
          if (params.keyword) {
            results = results.filter((h: any) =>
              (h.baseInfo?.name || h.baseInfo?.nameCn || '').toLowerCase().includes(params.keyword || '')
            )
          }

          // 分页处理
          const page = params.page || 1
          const limit = params.limit || 20
          const start = (page - 1) * limit
          const end = start + limit

          const paginatedResults = results.slice(start, end)

          set({
            homestays: paginatedResults as HomeStay[],
            pagination: {
              page,
              limit,
              total: results.length,
            },
            searchParams: params,
            searchLoading: false,
          })
        } catch (error: any) {
          set({
            searchError: error.message || '搜索失败，请重试',
            searchLoading: false,
          })
        }
      },

      /** 加载更多搜索结果 */
      loadMoreSearchResults: async () => {
        const { searchParams, pagination } = get()
        if (!searchParams) return

        try {
          await get().fetchSearchResults({
            ...searchParams,
            page: (pagination.page || 1) + 1,
          })
        } catch (error: any) {
          set({ searchError: error.message || '加载失败' })
        }
      },

      /** 设置搜索 UI 状态 */
      setSearchUIState: (state: Partial<SearchUIState>) => {
        set((store) => ({
          searchUIState: { ...store.searchUIState, ...state },
        }))
      },

      // ===== 详情 Actions =====

      /** 获取民宿详情 */
      fetchHomestayDetail: async (id: string) => {
        set({ detailLoading: true, detailError: null })
        try {
          // 模拟 API 延迟
          await new Promise((resolve) => setTimeout(resolve, 300))

          // Mock 数据：如果 ID 匹配则返回详情数据，否则构造
          let homestay: HomeStay = (HOMESTAY_DETAIL_MOCK || SEARCH_RESULT_HOMESTAYS[0]) as HomeStay

          if (id !== 'homestay-001') {
            // 对于其他 ID，从搜索结果中查找
            const found = SEARCH_RESULT_HOMESTAYS.find((h) => h._id === id)
            if (found) {
              homestay = found
            }
          }

          set({
            currentHomestay: homestay,
            detailLoading: false,
          })
        } catch (error: any) {
          set({
            detailError: error.message || '获取详情失败',
            detailLoading: false,
          })
        }
      },

      /** 设置当前民宿 */
      setCurrentHomestay: (homestay: HomeStay | null) => {
        set({ currentHomestay: homestay })
      },

      /** 更新详情页上下文 */
      updateDetailContext: (context: Partial<DetailContextState>) => {
        set((store) => ({
          detailContext: { ...store.detailContext, ...context },
        }))
      },

      /** 开始编辑详情 - 创建本地副本 */
      startEditingDetail: () => {
        set((store) => {
          const { currentHomestay, detailContext } = store
          if (!currentHomestay) return {}

          return {
            detailContext: {
              ...detailContext,
              isEditing: true,
              localCopy: {
                homeStay: JSON.parse(JSON.stringify(currentHomestay)), // 深拷贝
                selectedRoomId: detailContext.selectedRoomName,
                checkInDate: detailContext.checkInDate,
                checkOutDate: detailContext.checkOutDate,
              },
              modifiedFields: new Set<string>(),
            },
          }
        })
      },

      /** 更新本地副本中的数据 */
      setDetailLocalCopy: (data: Partial<DetailLocalCopy>) => {
        set((store) => {
          const { detailContext } = store
          if (!detailContext.localCopy) return {}

          // 记录修改的字段
          const modifiedFields = new Set(detailContext.modifiedFields || [])
          Object.keys(data).forEach((key) => {
            if (key !== 'homeStay') {
              modifiedFields.add(key)
            }
          })

          return {
            detailContext: {
              ...detailContext,
              localCopy: {
                ...detailContext.localCopy,
                ...data,
              },
              modifiedFields,
            },
          }
        })
      },

      /** 提交本地副本 - 将修改保存到currentHomestay和detailContext */
      commitDetailLocalCopy: () => {
        set((store) => {
          const { detailContext } = store
          if (!detailContext.localCopy) return {}

          return {
            currentHomestay: detailContext.localCopy.homeStay,
            detailContext: {
              ...detailContext,
              isEditing: false,
              selectedRoomName: detailContext.localCopy.selectedRoomId || detailContext.selectedRoomName,
              checkInDate: detailContext.localCopy.checkInDate || detailContext.checkInDate,
              checkOutDate: detailContext.localCopy.checkOutDate || detailContext.checkOutDate,
              localCopy: undefined,
              modifiedFields: undefined,
            },
          }
        })
      },

      /** 撤销本地副本 - 恢复到编辑前的状态 */
      revertDetailLocalCopy: () => {
        set((store) => {
          const { detailContext } = store
          return {
            detailContext: {
              ...detailContext,
              isEditing: false,
              localCopy: undefined,
              modifiedFields: undefined,
            },
          }
        })
      },

      /** 重置本地副本 */
      resetDetailLocalCopy: () => {
        set((store) => {
          const { detailContext } = store
          return {
            detailContext: {
              ...detailContext,
              isEditing: false,
              localCopy: undefined,
              modifiedFields: undefined,
            },
          }
        })
      },

      // ===== 推荐 Actions =====

      /** 加载热门民宿 */
      loadHotHomestays: async () => {
        try {
          // 模拟 API 延迟
          await new Promise((resolve) => setTimeout(resolve, 300))
          set({ hotHomestays: POPULAR_HOMESTAYS })
        } catch (error: any) {
          set({ searchError: error.message || '加载热门民宿失败' })
        }
      },

      /** 加载推荐民宿 */
      loadRecommendedHomestays: async (
        city: string = '上海',
        priceMin?: number,
        priceMax?: number
      ) => {
        try {
          // 模拟 API 延迟
          await new Promise((resolve) => setTimeout(resolve, 300))
          const recommended = getRecommendedHomestays(city, priceMin, priceMax)
          set({ recommendedHomestays: recommended })
        } catch (error: any) {
          set({ searchError: error.message || '加载推荐民宿失败' })
        }
      },

      /** 加载周边房源 */
      loadNearbyRooms: async (homestayId: string) => {
        try {
          // 模拟 API 延迟
          await new Promise((resolve) => setTimeout(resolve, 300))
          // Mock 数据：直接返回周边房源
          set({ nearbyRooms: (NEARBY_ROOMS as unknown as Room[]) })
        } catch (error: any) {
          set({ searchError: error.message || '加载周边房源失败' })
        }
      },

      // ===== 清理 Actions =====

      /** 清除当前民宿 */
      clearCurrentHomestay: () => {
        set({
          currentHomestay: null,
          detailContext: {
            selectedRoomName: '',
            expandNearbyProperties: false,
            currentTab: 'overview',
          },
        })
      },

      /** 清除错误 */
      clearErrors: () => {
        set({ searchError: null, detailError: null })
      },

      /** 重置 Store */
      reset: () => {
        set({
          searchParams: null,
          homestays: [],
          pagination: { page: 1, limit: 20, total: 0 },
          currentHomestay: null,
          hotHomestays: [],
          recommendedHomestays: [],
          nearbyRooms: [],
          searchError: null,
          detailError: null,
          searchUIState: {
            activeModal: null,
            isFilterPanelOpen: false,
            currentSort: 'popularity',
            viewMode: 'list',
          },
        })
      },
    }),
    {
      name: 'homestay-store', // LocalStorage 键名
      partialize: (state) => ({
        searchParams: state.searchParams,
        detailContext: state.detailContext,
      }),
    }
  )
)
