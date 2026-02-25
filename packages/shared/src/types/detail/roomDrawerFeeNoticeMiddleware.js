/**
 * RoomDetailDrawer/RoomDrawerFeeNotice 组件数据中间件
 * 数据来源：DetailCenterData.feeNotice
 * 组件接收：deposit、standardGuests、joinNumber、joinPrice、otherDescription、showOther
 */
export const transformCenterDataToRoomDrawerFeeNotice = (data) => {
    return {
        deposit: data.feeNotice?.deposit || 0,
        standardGuests: data.feeNotice?.standardGuests || 0,
        joinNumber: data.feeNotice?.joinNumber || 0,
        joinPrice: data.feeNotice?.joinPrice || 0,
        otherDescription: data.feeNotice?.otherDescription,
        showOther: data.feeNotice?.showOther,
    };
};
export const transformRoomDrawerFeeNoticeToCenterData = (params) => {
    return {
        feeNotice: params,
    };
};
//# sourceMappingURL=roomDrawerFeeNoticeMiddleware.js.map