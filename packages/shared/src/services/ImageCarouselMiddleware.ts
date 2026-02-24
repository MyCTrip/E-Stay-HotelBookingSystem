/**
 * ImageCarousel 组件数据中间件
 * 职责：从中央数据提取并格式化图片轮播信息
 */

import type { DetailCenterData } from '../types/detailDataMiddleware'

export interface ImageData {
  category?: string
  url: string
}

export const imageCarouselMiddleware = {
  /**
   * 获取 ImageCarousel 组件所需的数据
   */
  getData: (centerData: DetailCenterData): ImageData[] => {
    const { images } = centerData
    
    if (!images.images || images.images.length === 0) {
      return []
    }

    return images.images.map(img => ({
      category: img.category,
      url: img.url,
    }))
  },
}
