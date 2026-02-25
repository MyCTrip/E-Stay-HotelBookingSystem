import { IStorage } from '../adapters/storage';
import { HotelQuery } from '../types';
/**
 * API 服务接口定义
 */
export interface IApiService {
    getHotels: (query: HotelQuery) => Promise<any>;
    getHotHotels: (limit?: number) => Promise<any>;
    getHotelDetail: (id: string) => Promise<any>;
    getRoomsByHotel: (hotelId: string, params?: any) => Promise<any>;
    getRoomDetail: (id: string) => Promise<any>;
    homestays: {
        search: (params: any) => Promise<any>;
        getDetail: (id: string) => Promise<any>;
        getHot: (params?: any) => Promise<any>;
    };
    rooms: {
        getDetail: (id: string) => Promise<any>;
    };
    login: (email: string, password: string) => Promise<any>;
    register: (email: string, password: string) => Promise<any>;
    getMe: () => Promise<any>;
}
/**
 * API 配置
 */
export interface ApiConfig {
    baseURL: string;
    timeout?: number;
    headers?: Record<string, string>;
    storage?: IStorage;
}
/**
 * API 响应标准格式
 */
export interface ApiResponse<T = any> {
    code: number;
    data: T;
    message: string;
}
/**
 * 分页响应格式
 */
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}
/**
 * 创建 API 实例（工厂函数）
 */
export declare function createApiService(config: ApiConfig): IApiService;
/**
 * Mock API 实现（开发用）
 */
export declare function createMockApiService(): IApiService;
export default createApiService;
//# sourceMappingURL=index.d.ts.map