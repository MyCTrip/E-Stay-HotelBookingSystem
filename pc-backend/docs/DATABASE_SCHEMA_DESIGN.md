# 多房型数据库表设计方案

## 📋 需求分析

### 三种房型特点对比

| 特性 | 标准房型 | 钟点房 | 民宿 |
|------|--------|--------|------|
| 计费单位 | 按天 | 按小时 | 按天/周/月 |
| 入住时间灵活性 | 固定（14:00） | 高度灵活 | 按天 |
| 同日多次预订 | ❌ | ✅ | ❌ |
| 单元结构 | 单间 | 单间 | 整套/多间 |
| 清洁时间 | 长（1-2小时） | 短（30-45分钟） | 长（2-3小时） |
| 取消政策 | 提前24小时 | 提前2小时 | 灵活可配 |
| 额外费用 | 服务费 | 无 | 清洁费、押金等 |
| 房屋设施 | 基础 | 基础 | 多样、完整 |

---

## 🏗️ 数据库设计方案

### 核心思路
采用 **单表多聚合字段** 设计（利用MongoDB的灵活schema），通过 `roomCategory` 字段区分房型，每种房型有独立的配置字段。

---

## 📐 完整表结构设计

### Room 表（改进版）

```typescript
export type RoomCategory = 'standard' | 'hourly' | 'homestay';

// ============ 标准房型配置 ============
export interface IStandardRoomConfig {
  cancellationDeadlineHours?: number;  // 提前多少小时取消免费（默认24）
  earlyCheckoutDiscount?: number;      // 提前退房折扣（%）
  extensionAllowed?: boolean;          // 是否允许延期入住（默认true）
  extensionPrice?: number;             // 延期按小时计费
}

// ============ 钟点房配置 ============
export interface ITimeSlot {
  dayOfWeek: number;              // 0-6 (周日-周六)
  startTime: string;              // HH:mm
  endTime: string;                // HH:mm
  pricePerHour?: number;          // 该时段的时间价格（可覆盖基础价格）
  maxBookingsPerSlot?: number;    // 该时段每天最多预订数
  bookingLeadTime?: number;       // 提前预订时间（分钟，默认60）
}

export interface IHourlyRoomConfig {
  pricePerHour: number;           // 基础小时价格
  minimumHours: number;           // 最少预订时长（如2小时）
  maximumHours?: number;          // 最多预订时长（如12小时，null表示无限制）
  availableTimeSlots: ITimeSlot[];  // 可用时间段（优先级最高）
  requiresApproval?: boolean;     // 是否需要房东批准（默认false，钟点房一般即时确认）
  cleaningTime: number;           // 清洁时间（分钟，默认45）
  maxBookingsPerDay: number;      // 每天最多预订次数（默认3-4次）
  noShowPolicy?: string;          // 爽约政策描述
  
  // 定价规则支持
  hourlyTiers?: Array<{           // 分小时段定价
    minHours: number;
    maxHours: number;
    pricePerHour: number;         // 该区间的时间价格
  }>;
  
  peakHours?: Array<{             // 高峰期加价
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    multiplier: number;           // 价格倍数（如1.2倍）
  }>;
}

// ============ 民宿配置 ============
export interface IHomestayRoomConfig {
  // 房屋结构
  totalRooms: number;             // 总房间数
  bedrooms: number;               // 卧室数
  bathrooms: number;              // 浴室数
  kitchens?: number;              // 厨房数（可选）
  livingArea: number;             // 生活区面积（平方米）
  
  // 价格配置
  pricePerNight: number;          // 每晚基础价格
  weeklyDiscount?: number;        // 7晚及以上折扣（%，如10表示9.0折）
  monthlyDiscount?: number;       // 30晚及以上折扣（%）
  
  // 额外费用
  cleaningFee?: number;           // 清洁费（固定或按房间数）
  serviceFee?: number;            // 服务费（可能是百分比）
  securityDeposit?: number;       // 押金（可选）
  
  // 预订规则
  minimumStay: number;            // 最少入住天数（默认1）
  maximumStay?: number;           // 最长入住天数（null表示无限制）
  instantBooking: boolean;        // 是否支持即时预订
  requiresApproval?: boolean;     // 是否需要房东确认（实时预订为false）
  checkInTime?: string;           // 入住时间（如 "15:00"）
  checkOutTime?: string;          // 离住时间（如 "11:00"）
  checkInFlexibility?: number;    // 入住时间灵活性（分钟，默认60）
  
  // 房东信息和规则
  hostName?: string;              // 房东名称
  hostPhone?: string;             // 房东电话
  responseTimeHours?: number;     // 回复时间（小时）
  
  // 访客规则
  petsAllowed: boolean;           // 是否允许宠物
  petsPrice?: number;             // 宠物费用（每晚）
  maxGuests: number;              // 最多入住人数
  childrenAllowed?: boolean;      // 是否允许儿童
  infantsAllowed?: boolean;       // 是否允许婴儿
  
  // 房屋特性（标签）
  tags?: string[];                // 如: ['整套出租', '可带宠物', '投影仪', '健身房']
  
  // 取消政策
  cancellationPolicy?: 'flexible' | 'moderate' | 'strict' | 'non_refundable';
  cancellationDeadlineHours?: number;  // 提前多少小时取消
  cancellationRefundPercentage?: number;  // 退款百分比
}

// ============ 房型配置统一接口 ============
export interface IRoomTypeConfig {
  standard?: IStandardRoomConfig;
  hourly?: IHourlyRoomConfig;
  homestay?: IHomestayRoomConfig;
}

// ============ 最新的房型基础信息 ============
export interface IRoomBaseInfo {
  type: string;                   // 房型名称（如"标准大床房"、"2小时钟点房"、"精品民宿"）
  category: RoomCategory;         // 房型分类
  price: number;                  // 基础价格（根据category含义不同：day/hour/night）
  images: string[];
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'offline';
  maxOccupancy: number;
  facilities: IFacility[];
  policies: IPolicy[];
  bedRemark: string[];
}

// ============ 最终的Room表完整结构 ============
export interface IRoom extends Document {
  hotelId: Types.ObjectId;
  baseInfo: IRoomBaseInfo;
  headInfo?: IRoomHeadInfo;       // 对于民宿可能字段不完整
  bedInfo?: IBedInfo[];
  breakfastInfo?: IBreakfastInfo;
  
  // 新增：房型特定配置（核心改动）
  typeConfig: IRoomTypeConfig;
  
  auditInfo?: IRoomAuditInfo;
  pendingChanges?: Record<string, any> | null;
  pendingDeletion?: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 📊 Mongoose Schema 实现

```typescript
import { Schema, model, Document, Types } from 'mongoose';

// ============ 钟点房时间段Schema ============
const TimeSlotSchema = new Schema<ITimeSlot>({
  dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
  startTime: { type: String, required: true, pattern: /^\d{2}:\d{2}$/ },
  endTime: { type: String, required: true, pattern: /^\d{2}:\d{2}$/ },
  pricePerHour: { type: Number, min: 0 },
  maxBookingsPerSlot: { type: Number, min: 1 },
  bookingLeadTime: { type: Number, min: 0 },
});

// ============ 钟点房分层定价Schema ============
const HourlyTierSchema = new Schema({
  minHours: { type: Number, required: true, min: 0 },
  maxHours: { type: Number, required: true, min: 0 },
  pricePerHour: { type: Number, required: true, min: 0 },
});

// ============ 钟点房高峰期加价Schema ============
const PeakHourSchema = new Schema({
  dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  multiplier: { type: Number, required: true, min: 1 },
});

// ============ 标准房型配置Schema ============
const StandardRoomConfigSchema = new Schema<IStandardRoomConfig>({
  cancellationDeadlineHours: { type: Number, default: 24 },
  earlyCheckoutDiscount: { type: Number, min: 0, max: 100 },
  extensionAllowed: { type: Boolean, default: true },
  extensionPrice: { type: Number, min: 0 },
});

// ============ 钟点房配置Schema ============
const HourlyRoomConfigSchema = new Schema<IHourlyRoomConfig>({
  pricePerHour: { type: Number, required: true, min: 0 },
  minimumHours: { type: Number, required: true, min: 0.5 },
  maximumHours: { type: Number, min: 0 },
  availableTimeSlots: { type: [TimeSlotSchema], required: true },
  requiresApproval: { type: Boolean, default: false },
  cleaningTime: { type: Number, default: 45, min: 0 },
  maxBookingsPerDay: { type: Number, default: 4, min: 1 },
  noShowPolicy: String,
  hourlyTiers: { type: [HourlyTierSchema], default: [] },
  peakHours: { type: [PeakHourSchema], default: [] },
});

// ============ 民宿配置Schema ============
const HomestayRoomConfigSchema = new Schema<IHomestayRoomConfig>({
  totalRooms: { type: Number, required: true, min: 1 },
  bedrooms: { type: Number, required: true, min: 0 },
  bathrooms: { type: Number, required: true, min: 1 },
  kitchens: { type: Number, min: 0 },
  livingArea: { type: Number, required: true, min: 0 },
  
  pricePerNight: { type: Number, required: true, min: 0 },
  weeklyDiscount: { type: Number, min: 0, max: 100 },
  monthlyDiscount: { type: Number, min: 0, max: 100 },
  
  cleaningFee: { type: Number, min: 0 },
  serviceFee: { type: Number, min: 0 },
  securityDeposit: { type: Number, min: 0 },
  
  minimumStay: { type: Number, default: 1, min: 1 },
  maximumStay: { type: Number, min: 1 },
  instantBooking: { type: Boolean, required: true },
  requiresApproval: { type: Boolean },
  checkInTime: { type: String, default: '15:00' },
  checkOutTime: { type: String, default: '11:00' },
  checkInFlexibility: { type: Number, default: 60, min: 0 },
  
  hostName: String,
  hostPhone: String,
  responseTimeHours: { type: Number, min: 0 },
  
  petsAllowed: { type: Boolean, default: false },
  petsPrice: { type: Number, min: 0 },
  maxGuests: { type: Number, required: true, min: 1 },
  childrenAllowed: { type: Boolean, default: true },
  infantsAllowed: { type: Boolean, default: false },
  
  tags: { type: [String], default: [] },
  
  cancellationPolicy: { type: String, enum: ['flexible', 'moderate', 'strict', 'non_refundable'] },
  cancellationDeadlineHours: { type: Number, min: 0 },
  cancellationRefundPercentage: { type: Number, min: 0, max: 100 },
});

// ============ 房型配置统一Schema ============
const RoomTypeConfigSchema = new Schema<IRoomTypeConfig>({
  standard: StandardRoomConfigSchema,
  hourly: HourlyRoomConfigSchema,
  homestay: HomestayRoomConfigSchema,
});

// ============ 基础信息（修改category字段） ============
const BaseInfoSchema = new Schema<IRoomBaseInfo>({
  type: { type: String, required: true },
  category: { type: String, enum: ['standard', 'hourly', 'homestay'], required: true },
  price: { type: Number, required: true, min: 0 },
  images: { type: [String], required: true },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'offline'],
    required: true,
  },
  maxOccupancy: { type: Number, required: true, min: 0 },
  facilities: {
    type: [FacilitySchema],
    required: true,
    validate: { validator: (v: any[]) => Array.isArray(v) && v.length > 0 },
  },
  policies: {
    type: [PolicySchema],
    required: true,
    validate: { validator: (v: any[]) => Array.isArray(v) && v.length > 0 },
  },
  bedRemark: {
    type: [String],
    required: true,
    validate: { validator: (v: any[]) => Array.isArray(v) && v.length > 0 },
  },
});

// ============ 最终Room Schema ============
const RoomSchema = new Schema<IRoom>(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    baseInfo: { type: BaseInfoSchema, required: true },
    headInfo: HeadInfoSchema,
    bedInfo: { type: [BedSchema], validate: { validator: (v: any[]) => !v || v.length > 0 } },
    breakfastInfo: BreakfastSchema,
    
    // 核心改动：增加房型特定配置
    typeConfig: { type: RoomTypeConfigSchema, required: true, default: {} },
    
    auditInfo: { type: AuditSchema, default: {} },
    pendingChanges: { type: Schema.Types.Mixed, default: null },
    pendingDeletion: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, optimisticConcurrency: true }
);

// ============ 索引优化 ============
RoomSchema.index({ hotelId: 1, createdAt: -1 });
RoomSchema.index({ 'auditInfo.status': 1, createdAt: -1 });
RoomSchema.index({ 'auditInfo.status': 1, hotelId: 1 });
RoomSchema.index({ 'baseInfo.price': 1 });

// 新增：按房型分类查询
RoomSchema.index({ hotelId: 1, 'baseInfo.category': 1 });
RoomSchema.index({
  'baseInfo.category': 1,
  'auditInfo.status': 1,
  createdAt: -1,
});

export const Room = model<IRoom>('Room', RoomSchema);
```

---

## 🔄 数据迁移策略

### 第1步：为现有Room添加category和typeConfig字段

```javascript
// migration.js - 为现有房型添加默认值
db.rooms.updateMany(
  { 'baseInfo.category': { $exists: false } },
  [
    {
      $set: {
        'baseInfo.category': 'standard',
        typeConfig: {
          standard: {
            cancellationDeadlineHours: 24,
            extensionAllowed: true,
          },
        },
      },
    },
  ]
);
```

### 第2步：应用程序兼容性

```typescript
// 创建room时自动设置category和typeConfig
async createRoom(hotelId, roomData) {
  const category = roomData.category || 'standard';
  
  // 根据category初始化相应的typeConfig
  const typeConfig = this.initializeTypeConfig(category, roomData);
  
  return Room.create({
    hotelId,
    ...roomData,
    typeConfig,
  });
}

private initializeTypeConfig(category, roomData) {
  switch (category) {
    case 'hourly':
      return {
        hourly: {
          pricePerHour: roomData.typeConfig?.hourly?.pricePerHour,
          minimumHours: roomData.typeConfig?.hourly?.minimumHours || 2,
          availableTimeSlots: roomData.typeConfig?.hourly?.availableTimeSlots || [],
          cleaningTime: roomData.typeConfig?.hourly?.cleaningTime || 45,
          maxBookingsPerDay: roomData.typeConfig?.hourly?.maxBookingsPerDay || 4,
        },
      };
    case 'homestay':
      return {
        homestay: { /* homestay 配置 */ },
      };
    default: // standard
      return {
        standard: {
          cancellationDeadlineHours: roomData.typeConfig?.standard?.cancellationDeadlineHours || 24,
        },
      };
  }
}
```

---

## 📋 预订规则引擎（后端逻辑）

### 不同房型的核心计价逻辑

```typescript
// 价格计算服务
export class RoomPricingService {
  
  // 标准房型：按天计费
  calculateStandardPrice(room: IRoom, nights: number): number {
    const basePrice = room.baseInfo.price * nights;
    const config = room.typeConfig.standard;
    
    if (config?.earlyCheckoutDiscount) {
      // 应用提前退房折扣
    }
    
    return basePrice;
  }
  
  // 钟点房：按小时计费（支持分层定价和高峰期加价）
  calculateHourlyPrice(room: IRoom, bookingTime: { date: Date; startTime: string; endTime: string }): number {
    const config = room.typeConfig.hourly!;
    const hours = this.calculateHours(bookingTime.startTime, bookingTime.endTime);
    
    // 检查最小/最大时长限制
    if (hours < config.minimumHours || (config.maximumHours && hours > config.maximumHours)) {
      throw new Error('预订时长不符合要求');
    }
    
    // 检查时间段可用性
    const slotPrice = this.getTimeSlotPrice(config, bookingTime);
    
    // 应用分层定价
    let hourlyRate = slotPrice || config.pricePerHour;
    if (config.hourlyTiers) {
      const tier = config.hourlyTiers.find(t => hours >= t.minHours && hours <= t.maxHours);
      if (tier) hourlyRate = tier.pricePerHour;
    }
    
    // 应用高峰期加价
    const peakMultiplier = this.getPeakMultiplier(config, bookingTime);
    
    return hours * hourlyRate * peakMultiplier;
  }
  
  // 民宿：按天/周/月计费（支持长期优惠）
  calculateHomestayPrice(room: IRoom, nights: number, 
    options: { cleaningFee?: boolean; petDays?: number }): number {
    const config = room.typeConfig.homestay!;
    
    let basePrice = config.pricePerNight * nights;
    
    // 应用长期优惠
    if (nights >= 30 && config.monthlyDiscount) {
      basePrice *= (1 - config.monthlyDiscount / 100);
    } else if (nights >= 7 && config.weeklyDiscount) {
      basePrice *= (1 - config.weeklyDiscount / 100);
    }
    
    // 额外费用
    if (options.cleaningFee && config.cleaningFee) {
      basePrice += config.cleaningFee;
    }
    
    if (config.serviceFee) {
      basePrice += config.serviceFee;
    }
    
    // 宠物费用
    if (options.petDays && config.petsPrice && config.petsAllowed) {
      basePrice += config.petsPrice * options.petDays;
    }
    
    return basePrice;
  }
  
  // 辅助方法
  private getTimeSlotPrice(config: IHourlyRoomConfig, bookingTime): number | null {
    const dayOfWeek = new Date(bookingTime.date).getDay();
    const slot = config.availableTimeSlots.find(s => 
      s.dayOfWeek === dayOfWeek && 
      this.isTimeInRange(bookingTime.startTime, s.startTime, s.endTime)
    );
    return slot?.pricePerHour || null;
  }
  
  private getPeakMultiplier(config: IHourlyRoomConfig, bookingTime): number {
    const dayOfWeek = new Date(bookingTime.date).getDay();
    const peak = config.peakHours?.find(p =>
      p.dayOfWeek === dayOfWeek &&
      this.isTimeInRange(bookingTime.startTime, p.startTime, p.endTime)
    );
    return peak?.multiplier || 1;
  }
}
```

---

## 🎯 API请求/响应示例

### 创建钟点房

```json
POST /api/hotels/{hotelId}/rooms

{
  "baseInfo": {
    "type": "2小时钟点房",
    "category": "hourly",
    "price": 188,
    "maxOccupancy": 2,
    "images": ["url1", "url2"],
    "facilities": [...],
    "policies": [...],
    "bedRemark": ["大床"]
  },
  "headInfo": {
    "size": "30 sqm",
    "floor": "3",
    "wifi": true,
    "windowAvailable": true,
    "smokingAllowed": false
  },
  "bedInfo": [{ "bedType": "King", "bedNumber": 1, "bedSize": "1.8m" }],
  "typeConfig": {
    "hourly": {
      "pricePerHour": 94,
      "minimumHours": 2,
      "maximumHours": 8,
      "cleaningTime": 45,
      "maxBookingsPerDay": 4,
      "availableTimeSlots": [
        {
          "dayOfWeek": 1,
          "startTime": "08:00",
          "endTime": "22:00",
          "maxBookingsPerSlot": 2
        },
        {
          "dayOfWeek": 2,
          "startTime": "08:00",
          "endTime": "22:00",
          "maxBookingsPerSlot": 2
        }
      ],
      "hourlyTiers": [
        { "minHours": 2, "maxHours": 4, "pricePerHour": 94 },
        { "minHours": 5, "maxHours": 8, "pricePerHour": 85 }
      ],
      "peakHours": [
        {
          "dayOfWeek": 5,
          "startTime": "11:00",
          "endTime": "14:00",
          "multiplier": 1.3
        }
      ]
    }
  }
}
```

### 创建民宿

```json
POST /api/hotels/{hotelId}/rooms

{
  "baseInfo": {
    "type": "两居室精品民宿",
    "category": "homestay",
    "price": 299,
    "maxOccupancy": 4,
    "images": ["url1", "url2", "url3"],
    "facilities": [...],
    "policies": [...],
    "bedRemark": ["主卧双人床", "次卧两單人床"]
  },
  "typeConfig": {
    "homestay": {
      "totalRooms": 2,
      "bedrooms": 2,
      "bathrooms": 1,
      "kitchens": 1,
      "livingArea": 60,
      "pricePerNight": 299,
      "weeklyDiscount": 10,
      "monthlyDiscount": 20,
      "cleaningFee": 50,
      "serviceFee": 20,
      "securityDeposit": 500,
      "minimumStay": 2,
      "maximumStay": 30,
      "instantBooking": true,
      "checkInTime": "15:00",
      "checkOutTime": "11:00",
      "checkInFlexibility": 120,
      "petsAllowed": true,
      "petsPrice": 50,
      "maxGuests": 4,
      "childrenAllowed": true,
      "infantsAllowed": false,
      "tags": ["整套出租", "可带宠物", "投影仪", "健身房"],
      "cancellationPolicy": "moderate",
      "cancellationDeadlineHours": 72,
      "cancellationRefundPercentage": 80
    }
  }
}
```

---

## ✅ 迁移清单

- [ ] 添加TypeScript接口定义
- [ ] 更新Mongoose Schema
- [ ] 创建数据库迁移脚本
- [ ] 实现价格计算服务（StandardRoomService、HourlyRoomService、HomestayRoomService）
- [ ] 更新验证Schema（Zod）
- [ ] 更新API Controller逻辑
- [ ] 更新预订相关逻辑（若有）
- [ ] 添加单元测试和集成测试
- [ ] 更新API文档

---

## 🔍 查询优化建议

```javascript
// 查询所有钟点房
db.rooms.find({
  'baseInfo.category': 'hourly',
  'auditInfo.status': 'approved'
});

// 查询特定时间段有效的钟点房
db.rooms.findOne({
  hotelId: ObjectId("..."),
  'baseInfo.category': 'hourly',
  'typeConfig.hourly.availableTimeSlots.dayOfWeek': 3
});

// 查询支持即时预订的民宿
db.rooms.find({
  hotelId: ObjectId("..."),
  'baseInfo.category': 'homestay',
  'typeConfig.homestay.instantBooking': true
});
```

---

## 📌 总结

此设计方案通过以下方式实现了三种房型的完整支持：

1. **灵活的category字段**：区分三种房型
2. **独立的typeConfig配置**：每种房型有专属配置字段
3. **向后兼容**：现有标准房型可无缝迁移
4. **高内聚低耦合**：各房型的特定逻辑独立管理
5. **性能优化**：新增索引支持高效查询
6. **易于扩展**：未来可轻松添加新的房型类别
