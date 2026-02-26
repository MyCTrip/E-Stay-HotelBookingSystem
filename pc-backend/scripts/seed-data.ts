import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import * as bcrypt from 'bcryptjs';

import { User } from '../src/modules/user/user.model';
import { AdminProfile } from '../src/modules/admin/admin.model';
import { Merchant } from '../src/modules/merchant/merchant.model';
import { Hotel } from '../src/modules/hotel/hotel.model';
import { Room } from '../src/modules/room/room.model';
import { RoomAvailability } from '../src/modules/room/availability.model';
import { AuditLog } from '../src/modules/audit/audit.model';
import { Notification } from '../src/modules/notification/notification.model';

// directories relative to this script
const IMG_BASE = path.resolve(__dirname, '..', '..', '..', 'img');
const HOTEL_IMG_DIR = path.join(IMG_BASE, 'hotels.ctrip.com');
const LICENSE_DIR = path.join(IMG_BASE, '营业执照');
const UPLOADS_DIR = path.resolve(__dirname, '..', 'uploads');

// fixed payloads (copied from user-provided example)
const FACILITIES = [
  {
    id: 'service',
    name: '服务',
    facilities: [
      { id: 'free_parking', name: '免费停车位', available: true },
      { id: 'paid_parking', name: '付费停车位', available: true },
      { id: 'luggage_storage', name: '行李寄存', available: true },
      { id: 'front_desk', name: '前台接待', available: true },
      { id: 'concierge', name: '管家式服务', available: false },
    ],
  },
  {
    id: 'basic',
    name: '基础',
    facilities: [
      { id: 'wifi', name: '无线网络', available: true },
      { id: 'elevator', name: '电梯', available: true },
      { id: 'window', name: '窗户', available: true },
      { id: 'bedroom_ac', name: '卧室 - 冷暖空调', available: true },
      { id: 'living_ac', name: '客厅 - 冷暖空调', available: true },
      { id: 'heater', name: '暖气', available: true },
      { id: 'drying_rack', name: '晾衣架', available: true },
      { id: 'electric_kettle', name: '电热水壶', available: true },
      { id: 'sofa', name: '沙发', available: true },
      { id: 'tv', name: '电视', available: true },
      { id: 'fridge', name: '冰箱', available: true },
      { id: 'washing_machine', name: '洗衣机', available: true },
      { id: 'air_purifier', name: '空气净化器', available: true },
      { id: 'humidifier', name: '加湿器', available: true },
      { id: 'dryer', name: '烘干机', available: true },
      { id: 'iron', name: '电熨斗', available: true },
      { id: 'water', name: '免费瓶装水', available: true },
    ],
  },
  {
    id: 'bathroom',
    name: '卫浴',
    facilities: [
      { id: 'slippers', name: '一次性拖鞋', available: true },
      { id: 'hot_water', name: '热水', available: true },
      { id: 'private_bathroom', name: '独立卫浴', available: true },
      { id: 'hair_dryer', name: '电吹风', available: true },
      { id: 'toiletries', name: '洗浴用品', available: true },
      { id: 'toothbrush', name: '牙具', available: false },
      { id: 'bath_towel', name: '浴巾', available: true },
      { id: 'towel', name: '毛巾', available: false },
      { id: 'smart_toilet', name: '智能马桶', available: true },
    ],
  },
  {
    id: 'kitchen',
    name: '厨房',
    facilities: [
      { id: 'microwave', name: '微波炉', available: true },
      { id: 'tableware', name: '餐具', available: true },
      { id: 'knife_board', name: '刀具菜板', available: true },
      { id: 'cooking_pots', name: '烹饪锅具', available: true },
      { id: 'induction', name: '电磁炉', available: true },
      { id: 'gas_stove', name: '燃气灶', available: true },
      { id: 'detergent', name: '洗涤用品', available: true },
      { id: 'rice_cooker', name: '电饭煲', available: false },
      { id: 'oven', name: '烤箱', available: false },
      { id: 'dining_table', name: '餐桌', available: false },
    ],
  },
  {
    id: 'nearby',
    name: '周边',
    facilities: [
      { id: 'supermarket', name: '超市', available: true },
      { id: 'convenience_store', name: '便利店', available: true },
      { id: 'restaurant', name: '餐厅', available: true },
      { id: 'pharmacy', name: '药店', available: true },
      { id: 'park', name: '公园', available: false },
      { id: 'market', name: '菜市场', available: true },
      { id: 'atm', name: '提款机', available: true },
      { id: 'playground', name: '儿童乐园', available: false },
    ],
  },
  {
    id: 'safety',
    name: '安全',
    facilities: [
      { id: 'smart_lock', name: '智能门锁', available: true },
      { id: 'card_key', name: '门禁卡', available: true },
      { id: 'security', name: '保安', available: false },
      { id: 'fire_alarm', name: '火灾警报器', available: false },
      { id: 'extinguisher', name: '灭火器', available: true },
    ],
  },
  {
    id: 'entertainment',
    name: '娱乐',
    facilities: [{ id: 'projector', name: '投影设备', available: true }],
  },
  {
    id: 'leisure',
    name: '休闲',
    facilities: [{ id: 'living_room', name: '独立客厅', available: true }],
  },
  {
    id: 'children',
    name: '儿童',
    facilities: [
      { id: 'toys', name: '儿童玩具', available: true },
      { id: 'high_chair', name: '儿童餐椅', available: true },
      { id: 'baby_tub', name: '婴儿浴盆', available: false },
    ],
  },
];

const POLICIES = [
  { policyType: 'petAllowed', content: '<p>不可携带宠物</p>' },
  { policyType: 'cancellation', content: '<p>21313213</p>' },
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function walk(dir: string): Promise<string[]> {
  let results: string[] = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        results = results.concat(await walk(full));
      } else if (/\.(jpe?g|png|gif|webp)$/i.test(e.name)) {
        results.push(full);
      }
    }
  } catch (err) {
    // ignore missing directories
  }
  return results;
}

async function copyToUploads(src: string): Promise<string> {
  const ext = path.extname(src).toLowerCase();
  const name = `${Date.now()}-${Math.random().toString(16).slice(2, 10)}-compressed${ext}`;
  const dest = path.join(UPLOADS_DIR, name);
  await fs.copyFile(src, dest);
  return `/api/uploads/${name}`;
}

async function seedDatabase() {
  const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/estay';
  console.log('connecting to', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  console.log('clearing collections...');
  await Promise.all([
    User.deleteMany({}),
    AdminProfile.deleteMany({}),
    Merchant.deleteMany({}),
    Hotel.deleteMany({}),
    Room.deleteMany({}),
    RoomAvailability.deleteMany({}),
    AuditLog.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  console.log('ensuring uploads directory');
  await fs.mkdir(UPLOADS_DIR, { recursive: true });

  console.log('IMG_BASE', IMG_BASE);
  console.log('HOTEL_IMG_DIR', HOTEL_IMG_DIR);
  console.log('LICENSE_DIR', LICENSE_DIR);
  try {
    await fs.access(HOTEL_IMG_DIR);
    console.log('hotel image directory exists');
  } catch (e) {
    console.log('hotel image directory does not exist');
  }
  try {
    await fs.access(LICENSE_DIR);
    console.log('license image directory exists');
  } catch (e) {
    console.log('license image directory does not exist');
  }

  const hotelImagesAll = await walk(HOTEL_IMG_DIR);
  const licenseImages = await walk(LICENSE_DIR);
  if (hotelImagesAll.length === 0) console.warn('no hotel images found');
  if (licenseImages.length === 0) console.warn('no license images found');

  let availableHotelImages = shuffle(hotelImagesAll);
  const pickHotelImages = (n: number) => {
    if (availableHotelImages.length < n) availableHotelImages = shuffle(hotelImagesAll);
    return availableHotelImages.splice(0, n);
  };

  const pickLicenseImage = () => {
    if (licenseImages.length === 0) return undefined;
    return licenseImages[randomInt(0, licenseImages.length - 1)];
  };

  const hashedPassword = await bcrypt.hash('password123', 10);

  console.log('creating admin account');
  const adminUser = await User.create({
    email: 'admin@local.com',
    password: hashedPassword,
    role: 'admin',
    status: 'active',
  });
  const adminProfile = await AdminProfile.create({
    userId: adminUser._id,
    baseInfo: { name: 'Default Admin' },
  });

  const propertyTypes: ('hotel' | 'hourlyHotel' | 'homeStay')[] = [
    'hotel',
    'hourlyHotel',
    'homeStay',
  ];

  for (const type of propertyTypes) {
    for (let idx = 0; idx < 20; idx++) {
      const merchantEmail = `merchant_${type}_${idx}@estay.com`;
      const merchantUser = await User.create({
        email: merchantEmail,
        password: hashedPassword,
        role: 'merchant',
        status: 'active',
      });

      const licSrc = pickLicenseImage();
      const licUrl = licSrc ? await copyToUploads(licSrc) : '';
      const merchant = await Merchant.create({
        userId: merchantUser._id,
        baseInfo: {
          merchantName: `${type} 商户 ${idx}`,
          contactName: '张三',
          contactPhone: `13800${randomInt(10000, 99999)}`,
          contactEmail: merchantEmail,
        },
        qualificationInfo: {
          businessLicenseNo: `BL${type}${idx}${Date.now()}`,
          businessLicensePhoto: licUrl,
          idCardNo: `ID${type}${idx}${Date.now()}`,
          realNameStatus: 'verified',
        },
        auditInfo: { verifyStatus: 'verified' },
      });

      // merchant audit logs/notifications
      await AuditLog.create({
        targetType: 'merchant',
        targetId: merchant._id,
        action: 'submit',
        operatorId: merchantUser._id,
      });
      await AuditLog.create({
        targetType: 'merchant',
        targetId: merchant._id,
        action: 'approve',
        operatorId: adminUser._id,
      });

      await Notification.create({
        userId: adminUser._id,
        senderType: 'system',
        type: 'audit_pending',
        targetType: 'merchant',
        targetId: merchant._id,
        message: '有新的商户资料待审核',
        meta: { resourceName: merchant.baseInfo.merchantName },
      });
      await Notification.create({
        userId: merchantUser._id,
        senderType: 'admin',
        type: 'audit_approved',
        targetType: 'merchant',
        targetId: merchant._id,
        message: '您的商户资料已审核通过',
        meta: { resourceName: merchant.baseInfo.merchantName, operatorId: adminUser._id },
      });

      // --- create hotel ---
      const cityList = ['北京', '上海', '广州', '深圳'];
      const hotelImages = pickHotelImages(randomInt(5, 10));
      const hotelImageUrls = [];
      for (const src of hotelImages) hotelImageUrls.push(await copyToUploads(src));

      const hotel = await Hotel.create({
        merchantId: merchant._id,
        baseInfo: {
          nameCn: `${type} 酒店 ${idx}`,
          address: `${type} 地址 ${idx}`,
          city: cityList[randomInt(0, cityList.length - 1)],
          star: randomInt(1, 5),
          openTime: new Date().toISOString().split('T')[0],
          roomTotal: randomInt(1, 50),
          phone: '010-12345678',
          description: '自动生成的酒店描述',
          images: hotelImageUrls,
          propertyType: type,
          facilities: FACILITIES,
          policies: POLICIES,
          surroundings: [],
          discounts: [],
        },
        checkinInfo: { checkinTime: '14:00', checkoutTime: '12:00' },
        typeConfig: type === 'hourlyHotel' ? { hourly: { baseConfig: { pricePerHour: 88, minimumHours: 2 }, timeSlots: [{ dayOfWeek: 0, startTime: '08:00', endTime: '22:00', minStayHours: 2, content: '' }], }, } : type === 'homeStay' ? { homestay: { hostName: '房东', hostPhone: '13800000000', instantBooking: true, minStay: 1, securityDeposit: 100, }, } : {},
        auditInfo: { status: 'approved', auditedBy: adminProfile._id, auditedAt: new Date() },
      });

      await AuditLog.create({ targetType: 'hotel', targetId: hotel._id, action: 'submit', operatorId: merchantUser._id });
      await AuditLog.create({ targetType: 'hotel', targetId: hotel._id, action: 'approve', operatorId: adminUser._id });

      await Notification.create({
        userId: adminUser._id,
        senderType: 'system',
        type: 'audit_pending',
        targetType: 'hotel',
        targetId: hotel._id,
        message: '有新的酒店待审核',
        meta: { resourceName: hotel.baseInfo.nameCn },
      });
      await Notification.create({
        userId: merchantUser._id,
        senderType: 'admin',
        type: 'audit_approved',
        targetType: 'hotel',
        targetId: hotel._id,
        message: '您的酒店已审核通过',
        meta: { resourceName: hotel.baseInfo.nameCn, operatorId: adminUser._id },
      });

      // --- create rooms ---
      const roomCount = type === 'homeStay' ? 1 : randomInt(1, 3);
      for (let r = 0; r < roomCount; r++) {
        const roomImages = pickHotelImages(randomInt(5, 10));
        const roomImageUrls: string[] = [];
        for (const src of roomImages) roomImageUrls.push(await copyToUploads(src));

        const room = await Room.create({
          hotelId: hotel._id,
          category: type === 'hotel' ? 'standard' : type === 'hourlyHotel' ? 'hourly' : 'homestay',
          baseInfo: {
            type: `房型 ${r + 1}`,
            price: randomInt(100, 500),
            images: roomImageUrls,
            status: 'approved',
            maxOccupancy: randomInt(1, 4),
            facilities: FACILITIES,
            policies: POLICIES,
            bedRemark: ['成人加床：免费，需提前申请'],
          },
          headInfo: {
            size: '30 sqm',
            floor: `${randomInt(1, 20)}`,
            wifi: true,
            windowAvailable: true,
            smokingAllowed: false,
          },
          bedInfo: [{ bedType: '大床', bedNumber: 1, bedSize: '1.8m x 2m' }],
          auditInfo: { status: 'approved', auditedBy: adminProfile._id, auditedAt: new Date() },
        });

        await AuditLog.create({ targetType: 'room', targetId: room._id, action: 'submit', operatorId: merchantUser._id });
        await AuditLog.create({ targetType: 'room', targetId: room._id, action: 'approve', operatorId: adminUser._id });

        await Notification.create({
          userId: adminUser._id,
          senderType: 'system',
          type: 'audit_pending',
          targetType: 'room',
          targetId: room._id,
          message: '有新的房型待审核',
          meta: { resourceName: room.baseInfo.type },
        });
        await Notification.create({
          userId: merchantUser._id,
          senderType: 'admin',
          type: 'audit_approved',
          targetType: 'room',
          targetId: room._id,
          message: '您的房型已审核通过',
          meta: { resourceName: room.baseInfo.type, operatorId: adminUser._id },
        });

        // create availability entries for next 30 days
        const start = new Date();
        for (let d = 0; d < 30; d++) {
          const date = new Date(start);
          date.setDate(start.getDate() + d);
          let status: 'available' | 'booked' | 'blocked' = 'available';
          const prob = Math.random();
          if (prob < 0.1) status = 'blocked';
          else if (prob < 0.3) status = 'booked';
          const priceOverride = Math.random() < 0.2 ? room.baseInfo.price * (0.8 + Math.random() * 0.4) : undefined;
          await RoomAvailability.create({ roomId: room._id, date, status, priceOverride, availableCount: 1 });
        }
      }
    }
  }

  // print summary counts
  const [uCount, mCount, hCount, rCount, aCount, nCount] = await Promise.all([
    User.countDocuments(),
    Merchant.countDocuments(),
    Hotel.countDocuments(),
    Room.countDocuments(),
    AuditLog.countDocuments(),
    Notification.countDocuments(),
  ]);
  console.log('seeding completed');
  console.log('counts -> users', uCount, 'merchants', mCount, 'hotels', hCount, 'rooms', rCount, 'auditLogs', aCount, 'notifications', nCount);
  process.exit(0);
}

seedDatabase().catch((e) => {
  console.error(e);
  process.exit(1);
});
