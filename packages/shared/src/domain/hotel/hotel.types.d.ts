export type ObjectId = string;
export type PropertyType = 'hotel' | 'hourlyHotel' | 'homeStay';
export type RoomCategory = 'standard' | 'hourly' | 'homestay';
export type AuditStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'offline';
export type SurroundingType = 'metro' | 'attraction' | 'business';
export type DiscountType = 'discount' | 'instant';
export type RoomAvailabilityStatus = 'available' | 'booked' | 'blocked';
export interface GeoJSONPointModel {
    type: 'Point';
    coordinates: [number, number];
}
export interface FacilityItemModel {
    name: string;
    description?: string;
    icon?: string;
    available?: boolean;
}
export interface FacilityModel {
    category: string;
    content: string;
    summary?: string;
    icon?: string;
    order?: number;
    visible?: boolean;
    items?: FacilityItemModel[];
}
export interface PolicyModel {
    policyType: string;
    content: string;
    summary?: string;
    flags?: Record<string, unknown>;
    effectiveFrom?: Date;
}
export interface SurroundingModel {
    surType: SurroundingType;
    surName: string;
    distance: number;
}
export interface DiscountModel {
    title: string;
    type: DiscountType;
    content: string;
}
export interface CheckinInfoModel {
    checkinTime: string;
    checkoutTime: string;
    breakfastType?: string;
    breakfastPrice?: number;
}
export interface AuditInfoModel {
    status: AuditStatus;
    auditedBy: ObjectId | null;
    auditedAt: Date | null;
    rejectReason?: string;
}
export interface HotelBaseInfoModel {
    nameCn: string;
    nameEn?: string;
    address: string;
    city: string;
    propertyType: PropertyType;
    location?: GeoJSONPointModel;
    star: number;
    openTime: string;
    roomTotal: number;
    phone: string;
    description: string;
    images: string[];
    facilities: [FacilityModel, ...FacilityModel[]];
    policies: [PolicyModel, ...PolicyModel[]];
    surroundings?: SurroundingModel[];
    discounts?: DiscountModel[];
}
export interface HotelDomainModel {
    _id?: ObjectId;
    merchantId: ObjectId;
    baseInfo: HotelBaseInfoModel;
    typeConfig: Record<string, unknown>;
    checkinInfo: CheckinInfoModel;
    auditInfo: AuditInfoModel;
    pendingChanges: Record<string, unknown> | null;
    pendingDeletion: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface RoomBaseInfoModel {
    type: string;
    price: number;
    images: string[];
    status: AuditStatus;
    maxOccupancy: number;
    facilities: [FacilityModel, ...FacilityModel[]];
    policies: [PolicyModel, ...PolicyModel[]];
    bedRemark: [string, ...string[]];
}
export interface RoomHeadInfoModel {
    size: string;
    floor: string;
    wifi: boolean;
    windowAvailable: boolean;
    smokingAllowed: boolean;
}
export interface RoomBedInfoModel {
    bedType: string;
    bedNumber: number;
    bedSize: string;
}
export interface RoomBreakfastInfoModel {
    breakfastType?: string;
    cuisine?: string;
    bussinessTime?: string;
    addBreakfast?: string;
}
export interface RoomDomainModel {
    _id?: ObjectId;
    hotelId: ObjectId;
    baseInfo: RoomBaseInfoModel;
    category: RoomCategory;
    typeConfig: Record<string, unknown>;
    headInfo: RoomHeadInfoModel;
    bedInfo: RoomBedInfoModel[];
    breakfastInfo: RoomBreakfastInfoModel;
    auditInfo: AuditInfoModel;
    pendingChanges: Record<string, unknown> | null;
    pendingDeletion: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface RoomAvailabilityDomainModel {
    _id?: ObjectId;
    roomId: ObjectId;
    date: Date;
    status: RoomAvailabilityStatus;
    priceOverride?: number;
    availableCount: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=hotel.types.d.ts.map