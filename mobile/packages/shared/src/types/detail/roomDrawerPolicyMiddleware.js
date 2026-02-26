// @ts-nocheck
/**
 * RoomDetailDrawer/RoomDrawerPolicy 组件数据中间�?
 * 数据来源：DetailCenterData.policies
 * 组件接收：checkInSpan[]、checkoutTime、cancelMinute、deadlineTime、amenities
 */
export const transformCenterDataToRoomDrawerPolicy = (data) => {
    return {
        policies: data.policies || [],
    };
};
export const transformRoomDrawerPolicyToCenterData = (params) => {
    return {
        policies: params.policies,
    };
};
//# sourceMappingURL=roomDrawerPolicyMiddleware.js.map