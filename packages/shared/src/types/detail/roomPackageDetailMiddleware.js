// @ts-nocheck
/**
 * RoomDetailDrawer/RoomPackageDetail 组件数据中间�?
 * 数据来源：DetailCenterData.selectedRoom.packages[]
 * 组件接收：title、checkInService、enjoyService、details[]
 */
export const transformCenterDataToRoomPackageDetail = (data, packageIndex = 0) => {
    const selectedPackage = data.selectedRoom?.packages?.[packageIndex];
    return {
        title: selectedPackage?.name || '',
        checkInService: '',
        enjoyService: '',
        details: [],
    };
};
export const transformRoomPackageDetailToCenterData = (params) => {
    return {};
};
//# sourceMappingURL=roomPackageDetailMiddleware.js.map