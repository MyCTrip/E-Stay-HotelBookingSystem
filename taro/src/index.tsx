// 定义全局环境变量，防止库文件中的环境检查错误
if (typeof (global as any).development === 'undefined') {
  (global as any).development = process.env.NODE_ENV === 'development'
}
if (typeof (global as any).production === 'undefined') {
  (global as any).production = process.env.NODE_ENV === 'production'
}

// Taro 小程序不需要 index.tsx 的入口点
// 应用入口由 app.tsx 和页面组件处理
