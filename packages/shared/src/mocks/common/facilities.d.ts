/**
 * 设施 Mock 数据
 * 完全对应 web-h5/src/constants/facilities.ts 中的属性值定义
 */
export interface Facility {
    id: string;
    name: string;
    available: boolean;
}
export interface FacilityCategory {
    id: string;
    name: string;
    facilities: Facility[];
}
export declare const FACILITY_CATEGORIES: FacilityCategory[];
/**
 * 兼容旧版本 API - 导出为数组格式
 */
export declare const HOMESTAY_FACILITIES: FacilityCategory[];
export declare const ROOM_FACILITIES: FacilityCategory[];
//# sourceMappingURL=facilities.d.ts.map