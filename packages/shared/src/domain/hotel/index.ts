export type {
  ObjectId,
  PropertyType as HotelPropertyType,
  RoomCategory,
  SurroundingType,
  DiscountType,
  RoomAvailabilityStatus,
  GeoJSONPointModel,
  FacilityItemModel,
  FacilityModel,
  PolicyModel,
  SurroundingModel,
  DiscountModel,
  CheckinInfoModel,
  HotelBaseInfoModel as HotelEntityBaseInfoModel,
  HotelDomainModel as HotelEntityModel,
  RoomBaseInfoModel as RoomEntityBaseInfoModel,
  RoomHeadInfoModel as RoomEntityHeadInfoModel,
  RoomBedInfoModel as RoomEntityBedInfoModel,
  RoomBreakfastInfoModel as RoomEntityBreakfastInfoModel,
  RoomDomainModel as RoomEntityModel,
  RoomAvailabilityDomainModel,
} from './hotel.types'
// 导出视图模型中的类型（这些在 types 中没有定义）
export * from './hotel.view.types'
export * from './price'
