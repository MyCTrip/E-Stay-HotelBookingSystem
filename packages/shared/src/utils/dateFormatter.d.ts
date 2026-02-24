/**
 * 日期格式化工具 - Date ↔ String 双向转换
 * 用于搜索参数和详情页参数的日期格式统一处理
 */
/**
 * 将Date对象转换为字符串格式 "YYYY-MM-DD"
 * @param date - Date对象
 * @returns 格式化后的日期字符串 "2024-02-17"
 */
export declare const formatDateToString: (date?: Date | null) => string;
/**
 * 将字符串格式 "YYYY-MM-DD" 转换为Date对象
 * @param dateStr - 日期字符串 "2024-02-17"
 * @returns Date对象
 */
export declare const formatStringToDate: (dateStr?: string | null) => Date;
/**
 * 获取格式化后的日期字符串（显示在UI上）
 * @param dateStr - 日期字符串 "2024-02-17"
 * @returns 显示格式 "2月17"
 */
export declare const formatDateForDisplay: (dateStr?: string | null) => string;
/**
 * 获取当前日期的字符串格式
 * @returns 当前日期 "2024-02-17"
 */
export declare const getTodayString: () => string;
/**
 * 获取明天日期的字符串格式
 * @returns 明天日期 "2024-02-18"
 */
export declare const getTomorrowString: () => string;
/**
 * 验证日期字符串是否有效
 * @param dateStr - 日期字符串
 * @returns 是否有效
 */
export declare const isValidDateString: (dateStr: string) => boolean;
//# sourceMappingURL=dateFormatter.d.ts.map