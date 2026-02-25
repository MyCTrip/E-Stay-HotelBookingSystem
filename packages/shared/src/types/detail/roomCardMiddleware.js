// @ts-nocheck
/**
 * RoomCard 组件数据中间�?
 * 数据来源：DetailCenterData.rooms[]
 * 组件接收：_id、name、area、beds、guests、image、priceList、priceNote、benefits、confirmTime�?
 */
export const transformCenterDataToRoomCard = (data) => {
    if (!data.rooms) {
        return [];
    }
    return (Array.isArray(data.rooms) ? data.rooms : []).map(room => ({
        _id: room._id,
        name: room.name,
        area: room.area,
        beds: room.beds,
        guests: room.guests,
        image: room.image,
        priceList: room.priceList || [],
        priceNote: room.priceNote,
        benefits: room.benefits,
        confirmTime: room.confirmTime,
        showBreakfastTag: room.showBreakfastTag,
        breakfastCount: room.breakfastCount,
        showCancelTag: room.showCancelTag,
        cancelMunite: room.cancelMunite,
        packageCount: room.packageCount,
        packages: room.packages,
    }));
};
export const transformRoomCardToCenterData = (params) => {
    return {
        rooms: params,
    };
};
//# sourceMappingURL=roomCardMiddleware.js.map