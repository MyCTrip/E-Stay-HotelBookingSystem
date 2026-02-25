/**
 * 设施数据定义
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
export declare const getFacilitiesByCategory: (categoryId: string) => Facility[];
export declare const getAvailableFacilitiesByCategory: (categoryId: string) => Facility[];
export declare const getFacilitiesSectionData: () => Facility[];
export declare const getFacilitiesInCategory: (categoryId: string, hasFacilities?: string[]) => Facility[];
export declare const getFacilitiesWithStatus: (categoryId: string, hasFacilities?: string[]) => {
    name: string;
    has: boolean;
}[];
//# sourceMappingURL=facilities.d.ts.map