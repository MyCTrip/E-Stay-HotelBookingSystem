// @ts-nocheck
/**
 * ImageCarousel 组件数据中间�?
 * 数据来源：DetailCenterData.images
 * 组件接收：images数组，数组项 {category:分类名，url:图片路径}
 */
export const transformCenterDataToImageCarousel = (data) => {
    return {
        images: data.images || [],
    };
};
export const transformImageCarouselToCenterData = (params) => {
    return {
        images: params.images,
    };
};
//# sourceMappingURL=imageCarouselMiddleware.js.map