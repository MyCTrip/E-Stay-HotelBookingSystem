// @ts-nocheck
/**
 * RoomDetailDrawer/RoomDrawerFacilities 组件数据中间�?
 * 数据来源：DetailCenterData.facilities
 * 组件接收：FacilityCategory[]数组
 */
export const transformCenterDataToRoomDrawerFacilities = (data) => {
    return {
        facilities: data.facilities || [],
    };
};
export const transformRoomDrawerFacilitiesToCenterData = (params) => {
    return {
        facilities: params.facilities,
    };
};
//# sourceMappingURL=roomDrawerFacilitiesMiddleware.js.map