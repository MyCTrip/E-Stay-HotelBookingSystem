// @ts-nocheck
/**
 * RoomDetailDrawer/RoomDrawerBanner 组件数据中间�?
 * 数据来源：DetailCenterData.selectedRoom.roomImages
 * 组件接收：images数组，数组项 {category:分类名，url:图片路径}
 */
export const transformCenterDataToRoomDrawerBanner = (data) => {
    return {
        images: data.selectedRoom?.roomImages || [],
    };
};
export const transformRoomDrawerBannerToCenterData = (params) => {
    return {};
};
//# sourceMappingURL=roomDrawerBannerMiddleware.js.map