/**
 * 合并 className 的工具函数
 * 用法：cn('p-4', isActive && 'bg-blue-500')
 * 好处：避免字符串拼接出错，提高可读性
 */
export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}
