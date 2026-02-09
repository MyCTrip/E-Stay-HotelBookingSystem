/**
 * 格式化工具函数集合
 */

/** 格式化价格 */
export function formatPrice(price: number): string {
  return `¥${price}`
}

/** 格式化日期 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
  })
}

/** 计算两个日期间的天数 */
export function daysBetween(startDate: Date, endDate: Date): number {
  const ms = endDate.getTime() - startDate.getTime()
  return Math.ceil(ms / (24 * 60 * 60 * 1000))
}

/** 星级评分 */
export function formatRating(rating: number): string {
  return Math.min(rating, 5).toFixed(1)
}
