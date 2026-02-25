/**
 * 搜索相关类型定义
 * 仅包含搜索功能相关的接口
 */
import type { Hotel } from './models';
/**
 * 搜索参数
 */
export interface HomeStaySearchParams {
    city: string;
    checkIn: Date;
    checkOut: Date;
    guests: number;
    rooms?: number;
    beds?: number;
    keyword?: string;
    selectedTags?: string[];
    priceMin?: number;
    priceMax?: number;
    page?: number;
    limit?: number;
}
/**
 * 搜索结果分页信息
 */
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
}
/**
 * API搜索响应
 */
export interface HomeStaySearchResponse {
    data: Array<{
        _id: string;
        baseInfo: {
            nameCn: string;
            address: string;
            city: string;
            star: number;
        };
        [key: string]: any;
    }>;
    pagination: PaginationMeta;
}
/**
 * 快捷筛选标签
 */
export interface QuickFilterTag {
    id: string;
    label: string;
    icon?: string;
    badge?: string;
}
/**
 * HomeStay类型别名 - 指向models中的Hotel
 * 用于保持向后兼容性，实际使用models中的完整Hotel类型
 */
export type HomeStay = Hotel;
//# sourceMappingURL=homestay.d.ts.map