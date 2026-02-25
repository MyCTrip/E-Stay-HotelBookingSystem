// @ts-nocheck
/**
 * RoomDetailDrawer/RoomDrawerBasicInfo 组件数据中间�?
 * 数据来源：DetailCenterData.selectedRoom
 * 组件接收：id、name、area、beds、guests、breakfastCount、room[]
 */
export const transformCenterDataToRoomDrawerBasicInfo = (data) => {
    return {
        id: data.selectedRoom?._id || '',
        name: data.selectedRoom?.name || '',
        type: data.selectedRoom?.type || '',
        area: typeof data.selectedRoom?.area === 'number' ? data.selectedRoom.area : 0,
        guests: data.selectedRoom?.guests || '',
        bedRemark: undefined,
        breakfastCount: data.selectedRoom?.breakfastCount,
        room: data.selectedRoom?.bedDetails,
    };
};
export const transformRoomDrawerBasicInfoToCenterData = (params) => {
    return {};
};
//# sourceMappingURL=roomDrawerBasicInfoMiddleware.js.map