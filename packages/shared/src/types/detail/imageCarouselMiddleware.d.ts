/**
 * ImageCarousel 组件数据中间�?
 * 数据来源：DetailCenterData.images
 * 组件接收：images数组，数组项 {category:分类名，url:图片路径}
 */
import type { DetailCenterData, ImageCarouselData } from '../detailDataMiddleware';
export interface ImageCarouselParams extends ImageCarouselData {
}
export declare const transformCenterDataToImageCarousel: (data: DetailCenterData) => ImageCarouselParams;
export declare const transformImageCarouselToCenterData: (params: Partial<ImageCarouselParams>) => Partial<DetailCenterData>;
//# sourceMappingURL=imageCarouselMiddleware.d.ts.map