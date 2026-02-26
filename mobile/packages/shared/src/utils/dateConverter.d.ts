/**
 * 日期格式转换工具函数
 * hotelStore 使用 Date 格式，web-h5 组件使用 string 格式
 */
/**
 * 将 Date 对象转换为 YYYY-MM-DD 字符串格式
 * @param date - Date 对象或 undefined
 * @returns YYYY-MM-DD 格式字符串或 undefined
 */
export declare function dateToString(date: Date | string | undefined): string | undefined;
/**
 * 将 YYYY-MM-DD 字符串转换为 Date 对象
 * @param dateStr - YYYY-MM-DD 格式字符串或 undefined
 * @returns Date 对象或 undefined
 */
export declare function stringToDate(dateStr: string | Date | undefined): Date | undefined;
/**
 * 将带有 Date 属性的搜索参数转换为字符串日期格式
 * 用于 hotelStore -> web-h5 组件的适配
 */
export declare function convertSearchParamsToString(params: {
    checkInDate?: Date | string;
    checkOutDate?: Date | string;
    [key: string]: any;
}): {
    checkInDate?: string;
    checkOutDate?: string;
    [key: string]: any;
};
/**
 * 将带有字符串日期的过滤器转换为 Date 格式
 * 用于 web-h5 组件 -> hotelStore 的适配
 */
export declare function convertSearchFiltersToDate(filters: {
    checkInDate?: string | Date;
    checkOutDate?: string | Date;
    [key: string]: any;
}): {
    checkInDate?: Date;
    checkOutDate?: Date;
    [key: string]: any;
};
//# sourceMappingURL=dateConverter.d.ts.map