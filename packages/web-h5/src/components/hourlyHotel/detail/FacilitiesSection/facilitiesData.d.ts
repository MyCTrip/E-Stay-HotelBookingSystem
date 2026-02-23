/**
 * 完整的设施列表数据
 */
export interface FacilityItem {
    name: string;
    has?: boolean;
}
export interface FacilityCategory {
    name: string;
    items: FacilityItem[];
}
export declare const facilitiesData: FacilityCategory[];
//# sourceMappingURL=facilitiesData.d.ts.map