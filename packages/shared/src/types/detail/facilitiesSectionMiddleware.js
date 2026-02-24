// @ts-nocheck
/**
 * FacilitiesSection 组件数据中间�?
 * 数据来源：DetailCenterData
 * 组件接收：FacilityCategory[]
 */
export const transformCenterDataToFacilitiesSection = (data) => {
    return {
        facilities: data.facilities || [],
    };
};
export const transformFacilitiesSectionToCenterData = (params) => {
    return {
        facilities: params.facilities,
    };
};
//# sourceMappingURL=facilitiesSectionMiddleware.js.map