/**
 * 民宿Zustand Store
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import dayjs from 'dayjs'
import type {
  HomeStay,
  HomeStaySearchParams,
  Room,
  HomeStaySearchResponse,
  PaginationMeta,
} from '../types/homestay'
import type { IApiService } from '../api'

export interface HomeStayState {
  // 搜索状态
  searchParams: HomeStaySearchParams | null

  // 列表数据
  homestays: HomeStay[]
  pagination: PaginationMeta

  // 详情页数据
  currentHomestay: HomeStay | null
  currentRoom: Room | null

  // UI状态
  loading: boolean
  error: string | null

  // Actions
  setSearchParams(params: HomeStaySearchParams): void
  fetchHomestays(params: HomeStaySearchParams): Promise<void>
  fetchMoreHomestays(): Promise<void>
  fetchHotStays(limit?: number): Promise<HomeStay[]>
  fetchHomestayDetail(id: string): Promise<void>
  fetchRoomDetail(roomId: string): Promise<void>
  clearCurrentHomestay(): void
  clearCurrentRoom(): void
  resetStore(): void
}

export const createHomeStayStore = (api: IApiService) => {
  return create<HomeStayState>()(
    persist(
      (set, get) => ({
        searchParams: null,
        homestays: [],
        pagination: { page: 1, limit: 20, total: 0 },
        currentHomestay: null,
        currentRoom: null,
        loading: false,
        error: null,

        setSearchParams: (params: HomeStaySearchParams) => {
          set({ searchParams: params })
        },

        fetchHomestays: async (params: HomeStaySearchParams) => {
          set({ loading: true, error: null })
          try {
            const result: any = await api.homestays.search({
              ...params,
              page: params.page || 1,
              limit: params.limit || 20,
              checkIn: dayjs(params.checkIn).format('YYYY-MM-DD'),
              checkOut: dayjs(params.checkOut).format('YYYY-MM-DD'),
            })
            set({
              homestays: result.data || [],
              pagination: result.pagination || { page: 1, limit: 20, total: 0 },
              searchParams: params,
              loading: false,
            })
          } catch (err: any) {
            set({
              error: err.message || '搜索失败，请重试',
              loading: false,
            })
            throw err
          }
        },

        fetchMoreHomestays: async () => {
          const { searchParams, pagination } = get()
          if (!searchParams) {
            console.warn('No search params set')
            return
          }

          set({ loading: true })
          try {
            const result: any = await api.homestays.search({
              ...searchParams,
              page: (pagination.page || 1) + 1,
              limit: pagination.limit || 20,
              checkIn: dayjs(searchParams.checkIn).format('YYYY-MM-DD'),
              checkOut: dayjs(searchParams.checkOut).format('YYYY-MM-DD'),
            })
            set((state) => ({
              homestays: [...state.homestays, ...result.data],
              pagination: result.pagination,
              loading: false,
            }))
          } catch (err: any) {
            set({
              error: err.message || '加载更多失败',
              loading: false,
            })
            throw err
          }
        },

        fetchHotStays: async (limit: number = 10): Promise<HomeStay[]> => {
          try {
            const data: any = await api.homestays.getHot({ limit })
            return data.data || data || []
          } catch (err: any) {
            set({ error: err.message || '获取热门民宿失败' })
            return []
          }
        },

        fetchHomestayDetail: async (id: string) => {
          set({ loading: true, error: null })
          try {
            const data: any = await api.homestays.getDetail(id)
            set({ currentHomestay: data, loading: false })
          } catch (err: any) {
            set({
              error: err.message || '获取民宿详情失败',
              loading: false,
            })
            throw err
          }
        },

        fetchRoomDetail: async (roomId: string) => {
          set({ loading: true })
          try {
            const data: any = await api.homestays.getDetail(roomId)
            set({ currentRoom: data, loading: false })
          } catch (err: any) {
            set({
              error: err.message || '获取房型详情失败',
              loading: false,
            })
            throw err
          }
        },

        clearCurrentHomestay: () => set({ currentHomestay: null }),
        clearCurrentRoom: () => set({ currentRoom: null }),
        resetStore: () =>
          set({
            searchParams: null,
            homestays: [],
            pagination: { page: 1, limit: 20, total: 0 },
            currentHomestay: null,
            currentRoom: null,
            loading: false,
            error: null,
          }),
      }),
      {
        name: 'homestay-store',
        partialize: (state) => ({
          searchParams: state.searchParams,
        }),
      }
    )
  )
}

// 全局store实例
let storeInstance: ReturnType<typeof createHomeStayStore> | null = null

/**
 * 获取或创建 HomeStayStore hook
 * @param api 可选的API实例，如果不提供则使用全局实例
 */
export const useHomeStayStore = (api?: IApiService) => {
  if (!storeInstance && api) {
    storeInstance = createHomeStayStore(api)
  }
  if (!storeInstance) {
    throw new Error('HomeStayStore not initialized. Call initHomeStayStore first.')
  }
  return storeInstance
}

/**
 * 初始化 HomeStay Store（幂等性）
 * @param api API 服务实例
 */
export function initHomeStayStore(api: IApiService): void {
  if (storeInstance) {
    console.warn('⚠️ HomeStayStore already initialized, skipping...')
    return
  }
  storeInstance = createHomeStayStore(api)
}

/**
 * 重置 Store 状态（用于测试或用户登出）
 */
export function resetHomeStayStore(): void {
  if (!storeInstance) return
  const state = storeInstance.getState() as any
  state.resetStore?.()
}
