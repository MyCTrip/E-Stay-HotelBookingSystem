// 模型类型 - 核心数据模型
export type {
  // 枚举和基础类型
  PropertyType,
  AuditStatus,

  // 基础数据类型
  FacilityItem,
  Facility,
  Policy,
  Surrounding,
  Discount,
  AuditInfo,
  GeoLocation,
  CheckinInfo,
  RoomHeadInfo,
  BreakfastInfo,
  BedInfo,
  HourlySlot,

  // Hotel类型
  HomeStayHotel,
  StandardHotel,
  HourlyHotel,
  Hotel,

  // Room类型
  HomeStayRoom,
  StandardRoom,
  Room,

  // API响应
  ApiResponse,
  ListResponse,
  HotelQuery,
} from './models'

// 搜索相关类型
export type {
  HomeStaySearchParams,
  HomeStaySearchResponse,
  PaginationMeta,
  QuickFilterTag,
  HomeStay,
} from './homestay'

// Detail页数据中间件 - 导出所有
export * from './detailDataMiddleware'
export * from './detail'
