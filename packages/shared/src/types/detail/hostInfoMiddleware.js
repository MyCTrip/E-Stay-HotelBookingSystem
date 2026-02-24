// @ts-nocheck
/**
 * HostInfo 组件数据中间�?
 * 数据来源：DetailCenterData.hostInfo
 * 组件接收：name、avatar、badge、responseRate、responseTime、totalReviews、overallRating、tags
 */
export const transformCenterDataToHostInfo = (data) => {
    return {
        name: data.hostInfo?.name,
        avatar: data.hostInfo?.avatar,
        badge: data.hostInfo?.badge,
        responseRate: data.hostInfo?.responseRate,
        orderConfirmationRate: data.hostInfo?.orderConfirmationRate,
        responseTime: data.hostInfo?.responseTime,
        totalReviews: data.hostInfo?.totalReviews,
        overallRating: data.hostInfo?.overallRating,
        tags: data.hostInfo?.tags,
    };
};
export const transformHostInfoToCenterData = (params) => {
    return {
        hostInfo: params,
    };
};
//# sourceMappingURL=hostInfoMiddleware.js.map