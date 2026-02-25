/**
 * 工具函数集合
 */
// 导出日期转换函数
export * from './dateConverter';
export function formatPrice(price, locale = 'en-US') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'CNY',
        minimumFractionDigits: 0,
    }).format(price);
}
/**
 * 计算入住间夜数
 */
export function calculateNights(checkIn, checkOut) {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / msPerDay);
}
/**
 * 格式化日期
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    if (format === 'YYYY-MM-DD')
        return `${year}-${month}-${day}`;
    if (format === 'MM-DD')
        return `${month}-${day}`;
    if (format === 'MM/DD')
        return `${month}/${day}`;
    return `${year}-${month}-${day}`;
}
/**
 * 解析 HTML 富文本为纯文本（简单实现）
 */
export function htmlToText(html) {
    if (typeof document === 'undefined')
        return html;
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}
/**
 * 防抖函数
 */
export function debounce(func, wait) {
    let timeout = null;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
/**
 * 节流函数
 */
export function throttle(func, limit) {
    let inThrottle = false;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
/**
 * 日期格式化工具
 */
export * from './dateFormatter';
//# sourceMappingURL=index.js.map