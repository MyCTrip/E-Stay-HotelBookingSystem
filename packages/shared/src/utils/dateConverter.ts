/**
 * 日期格式转换工具函数
 * hotelStore 使用 Date 格式，web-h5 组件使用 string 格式
 */

/**
 * 将 Date 对象转换为 YYYY-MM-DD 字符串格式
 * @param date - Date 对象或 undefined
 * @returns YYYY-MM-DD 格式字符串或 undefined
 */
export function dateToString(date: Date | string | undefined): string | undefined {
  if (!date) return undefined
  if (typeof date === 'string') return date // 已经是字符串格式
  
  if (date instanceof Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  return undefined
}

/**
 * 将 YYYY-MM-DD 字符串转换为 Date 对象
 * @param dateStr - YYYY-MM-DD 格式字符串或 undefined
 * @returns Date 对象或 undefined
 */
export function stringToDate(dateStr: string | Date | undefined): Date | undefined {
  if (!dateStr) return undefined
  if (dateStr instanceof Date) return dateStr // 已经是 Date 格式
  
  if (typeof dateStr === 'string') {
    const date = new Date(`${dateStr}T00:00:00`)
    return Number.isNaN(date.getTime()) ? undefined : date
  }
  
  return undefined
}

/**
 * 将带有 Date 属性的搜索参数转换为字符串日期格式
 * 用于 hotelStore -> web-h5 组件的适配
 */
export function convertSearchParamsToString(params: {
  checkInDate?: Date | string
  checkOutDate?: Date | string
  [key: string]: any
}): {
  checkInDate?: string
  checkOutDate?: string
  [key: string]: any
} {
  return {
    ...params,
    checkInDate: dateToString(params.checkInDate),
    checkOutDate: dateToString(params.checkOutDate),
  }
}

/**
 * 将带有字符串日期的过滤器转换为 Date 格式
 * 用于 web-h5 组件 -> hotelStore 的适配
 */
export function convertSearchFiltersToDate(filters: {
  checkInDate?: string | Date
  checkOutDate?: string | Date
  [key: string]: any
}): {
  checkInDate?: Date
  checkOutDate?: Date
  [key: string]: any
} {
  return {
    ...filters,
    checkInDate: stringToDate(filters.checkInDate),
    checkOutDate: stringToDate(filters.checkOutDate),
  }
}
