// @ts-nocheck
/**
 * RoomDetailDrawer/RoomDrawerPrice 组件数据中间�?
 * 数据来源：DetailCenterData.selectedRoom �?feePrice
 * 组件接收：id、price、discounts[]
 */
export const transformCenterDataToRoomDrawerPrice = (data) => {
    return {
        id: data.selectedRoom?._id || '',
        price: data.selectedRoom?.price || 0,
        discounts: data.feePrice?.discounts,
    };
};
export const transformRoomDrawerPriceToCenterData = (params) => {
    return {
        feePrice: {
            discounts: params.discounts,
        },
    };
};
//# sourceMappingURL=roomDrawerPriceMiddleware.js.map