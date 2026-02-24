/**
 * 工具函数集合
 */

/**
 * 格式化价格
 */
export function formatPrice(price: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
  }).format(price)
}

/**
 * 计算入住间夜数
 */
export function calculateNights(checkIn: Date, checkOut: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.ceil((checkOut.getTime() - checkIn.getTime()) / msPerDay)
}

/**
 * 格式化日期
 */
export function formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  if (format === 'YYYY-MM-DD') return `${year}-${month}-${day}`
  if (format === 'MM-DD') return `${month}-${day}`
  if (format === 'MM/DD') return `${month}/${day}`

  return `${year}-${month}-${day}`
}

/**
 * 解析 HTML 富文本为纯文本（简单实现）
 */
export function htmlToText(html: string): string {
  if (typeof document === 'undefined') return html
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 日期格式化工具
 */
export * from './dateFormatter'
