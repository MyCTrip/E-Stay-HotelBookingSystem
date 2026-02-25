// @ts-nocheck
/**
 * PolicySection 组件数据中间�?
 * 数据来源：DetailCenterData.policies
 * 组件接收：checkInSpan、checkoutTime、cancelMinute、deadlineTime、amenities
 */
export const transformCenterDataToPolicySection = (data) => {
    return {
        policies: data.policies || [],
    };
};
export const transformPolicySectionToCenterData = (params) => {
    return {
        policies: params.policies,
    };
};
//# sourceMappingURL=policySectionMiddleware.js.map