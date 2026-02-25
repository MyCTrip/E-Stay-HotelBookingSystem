/**
 * 工具函数集合
 */
export * from './dateConverter';
export declare function formatPrice(price: number, locale?: string): string;
/**
 * 计算入住间夜数
 */
export declare function calculateNights(checkIn: Date, checkOut: Date): number;
/**
 * 格式化日期
 */
export declare function formatDate(date: Date, format?: string): string;
/**
 * 解析 HTML 富文本为纯文本（简单实现）
 */
export declare function htmlToText(html: string): string;
/**
 * 防抖函数
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * 节流函数
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void;
/**
 * 日期格式化工具
 */
export * from './dateFormatter';
//# sourceMappingURL=index.d.ts.map