/**
 * NearbyRecommendations 组件数据中间件
 * 数据来源：DetailCenterData.surroundings
 * 组件接收：fullAddress、community、surroundings
 */
export const transformCenterDataToNearbyRecommendations = (data) => {
    return {
        fullAddress: data.surroundings?.fullAddress,
        community: data.surroundings?.community,
        surroundings: data.surroundings?.surroundings,
    };
};
export const transformNearbyRecommendationsToCenterData = (params) => {
    return {
        surroundings: params,
    };
};
//# sourceMappingURL=nearbyRecommendationsMiddleware.js.map