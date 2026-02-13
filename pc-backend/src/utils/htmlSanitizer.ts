// 净化HTML内容的函数
export const sanitizeHtml = (html: string): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }
  
  // 使用简单的HTML净化实现，避免模块导入问题
  // 移除script标签
  let sanitizedHtml = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  // 移除style标签
  sanitizedHtml = sanitizedHtml.replace(/<style[\s\S]*?<\/style>/gi, '');
  // 移除iframe标签
  sanitizedHtml = sanitizedHtml.replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
  // 移除object标签
  sanitizedHtml = sanitizedHtml.replace(/<object[\s\S]*?<\/object>/gi, '');
  // 移除embed标签
  sanitizedHtml = sanitizedHtml.replace(/<embed[\s\S]*?<\/embed>/gi, '');
  // 移除所有on事件属性
  sanitizedHtml = sanitizedHtml.replace(/on\w+\s*=\s*["']?[^"'>]+["']?/gi, '');
  
  return sanitizedHtml;
};

// 递归净化包含HTML内容的对象
export const sanitizeObject = (obj: any): any => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  const sanitizedObj: any = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      
      if (key === 'content' && typeof value === 'string') {
        // 净化HTML内容字段
        sanitizedObj[key] = sanitizeHtml(value);
      } else if (typeof value === 'object') {
        // 递归处理嵌套对象
        sanitizedObj[key] = sanitizeObject(value);
      } else {
        // 其他类型保持不变
        sanitizedObj[key] = value;
      }
    }
  }
  
  return sanitizedObj;
};
