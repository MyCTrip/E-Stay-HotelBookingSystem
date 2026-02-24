/**
 * ImageCarousel 组件数据中间件
 * 数据来源：DetailCenterData.images
 * 组件接收：images数组，数组项 {category:分类名，url:图片路径}
 */

import type { DetailCenterData, ImageCarouselData } from '../detailDataMiddleware'

export interface ImageCarouselParams extends ImageCarouselData {}

export const transformCenterDataToImageCarousel = (
  data: DetailCenterData
): ImageCarouselParams => {
  return {
    images: data.images || [],
  }
}

export const transformImageCarouselToCenterData = (
  params: Partial<ImageCarouselParams>
): Partial<DetailCenterData> => {
  return {
    images: params.images,
  }
}
