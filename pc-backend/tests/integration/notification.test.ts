import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../../src/app';
import { User } from '../../src/modules/user/user.model';
import { Merchant } from '../../src/modules/merchant/merchant.model';
import { AdminProfile } from '../../src/modules/admin/admin.model';
import { Hotel } from '../../src/modules/hotel/hotel.model';
import { Room } from '../../src/modules/room/room.model';
import { Notification } from '../../src/modules/notification/notification.model';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
jest.setTimeout(60000);

describe('Notification System', () => {
  let mongod: MongoMemoryServer;
  let merchantToken: string;
  let adminToken: string;
  let merchantUserId: string;
  let adminUserId: string;
  let merchantProfileId: string;
  let hotelId: string;
  let roomId: string;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);

    // 清空集合
    await Promise.all([
      User.deleteMany({}),
      Merchant.deleteMany({}),
      AdminProfile.deleteMany({}),
      Hotel.deleteMany({}),
      Room.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    // Create merchant user and profile
    const merchantUser = await User.create({
      email: 'merchant@test.com',
      password: 'hashed_password',
      role: 'merchant',
      status: 'active',
    });
    merchantUserId = merchantUser._id.toString();
    merchantToken = jwt.sign({ id: merchantUserId, role: 'merchant' }, JWT_SECRET, { expiresIn: '1h' });

    const merchantProfile = await Merchant.create({
      userId: merchantUserId,
      baseInfo: {
        merchantName: '测试商户',
        contactName: '联系人',
        contactPhone: '13800000000',
        contactEmail: 'contact@test.com',
      },
      qualificationInfo: {
        businessLicenseNo: 'BL123456',
        idCardNo: 'ID123456',
        realNameStatus: 'verified',
      },
      auditInfo: {
        verifyStatus: 'verified',
      },
    });
    merchantProfileId = merchantProfile._id.toString();

    // Create admin user and profile
    const adminUser = await User.create({
      email: 'admin@test.com',
      password: 'hashed_password',
      role: 'admin',
      status: 'active',
    });
    adminUserId = adminUser._id.toString();
    adminToken = jwt.sign({ id: adminUserId, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });

    await AdminProfile.create({
      userId: adminUserId,
      baseInfo: {
        name: '管理员',
        employeeNo: 'EMP001',
      },
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  });

  describe('Merchant Submit & Admin Notified', () => {
    test('应该在商户提交酒店时通知管理员', async () => {
      // 1. 创建酒店
      const createRes = await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${merchantToken}`)
        .send({
          baseInfo: {
            nameCn: '测试酒店',
            address: '北京市朝阳区',
            city: '北京',
            star: 4,
            openTime: '2020-01-01',
            roomTotal: 100,
            phone: '010-12345678',
            description: '测试酒店描述',
            images: ['http://example.com/image.jpg'],
            facilities: [
              {
                category: '公共设施',
                content: '<p>WiFi</p>',
              },
            ],
            policies: [
              {
                policyType: 'petAllowed',
                content: '<p>不允许宠物</p>',
              },
            ],
          },
          checkinInfo: {
            checkinTime: '14:00',
            checkoutTime: '11:00',
          },
        });

      expect(createRes.status).toBe(201);
      hotelId = createRes.body._id;

      // 2. 提交酒店审核
      const submitRes = await request(app)
        .post(`/api/hotels/${hotelId}/submit`)
        .set('Authorization', `Bearer ${merchantToken}`)
        .send({});

      expect(submitRes.status).toBe(200);
      expect(submitRes.body.auditInfo.status).toBe('pending');

      // 3. 验证管理员收到通知
      const notificationsRes = await request(app)
        .get('/api/admin/notifications?type=audit_pending')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(notificationsRes.status).toBe(200);
      const hotelNotifications = notificationsRes.body.data.filter(
        (n: any) => n.targetType === 'hotel' && n.targetId === hotelId
      );
      expect(hotelNotifications.length).toBeGreaterThan(0);
      expect(hotelNotifications[0].message).toContain('测试酒店');
      expect(hotelNotifications[0].type).toBe('audit_pending');
    });

    test('应该在商户提交房间时通知管理员', async () => {
      // 1. 批准酒店（准备充分条件）
      const approveRes = await request(app)
        .post(`/api/admin/hotels/${hotelId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(approveRes.status).toBe(200);

      // 清除通知
      await Notification.deleteMany({});

      // 2. 创建房间
      const createRoomRes = await request(app)
        .post(`/api/hotels/${hotelId}/rooms`)
        .set('Authorization', `Bearer ${merchantToken}`)
        .send({
          baseInfo: {
            type: '标准间',
            price: 299,
            images: ['http://example.com/room.jpg'],
            status: 'draft',
            maxOccupancy: 2,
            facilities: [
              {
                category: '房间设施',
                content: '<p>空调</p>',
              },
            ],
            policies: [
              {
                policyType: 'noSmoking',
                content: '<p>禁烟</p>',
              },
            ],
            bedRemark: ['标准双床'],
          },
          headInfo: {
            size: '25 sqm',
            floor: '1',
            wifi: true,
            windowAvailable: true,
            smokingAllowed: false,
          },
          bedInfo: [
            {
              bedType: '双床',
              bedNumber: 1,
              bedSize: '1.2m x 2m',
            },
          ],
        });

      if (createRoomRes.status !== 201) {
        console.error('Create room failed:', createRoomRes.body);
      }
      expect(createRoomRes.status).toBe(201);
      roomId = createRoomRes.body._id;

      // 3. 提交房间审核
      const submitRoomRes = await request(app)
        .post(`/api/rooms/${roomId}/submit`)
        .set('Authorization', `Bearer ${merchantToken}`)
        .send({});

      expect(submitRoomRes.status).toBe(200);

      // 4. 验证管理员收到通知
      const notificationsRes = await request(app)
        .get('/api/admin/notifications?type=audit_pending')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(notificationsRes.status).toBe(200);
      const roomNotifications = notificationsRes.body.data.filter(
        (n: any) => n.targetType === 'room' && n.targetId === roomId
      );
      expect(roomNotifications.length).toBeGreaterThan(0);
      expect(roomNotifications[0].message).toContain('房间');
    });
  });

  describe('Admin Approve & Merchant Notified', () => {
    test('应该在管理员批准酒店时通知商户', async () => {
      // 清除通知
      await Notification.deleteMany({});

      // 1. 首先创建并提交一个酒店
      const createRes = await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${merchantToken}`)
        .send({
          baseInfo: {
            nameCn: '用于审核测试的酒店',
            address: '北京市test',
            city: '北京',
            star: 4,
            openTime: '2020-01-01',
            roomTotal: 100,
            phone: '010-12345678',
            description: '测试',
            images: ['http://example.com/image.jpg'],
            facilities: [
              {
                category: '公共设施',
                content: '<p>WiFi</p>',
              },
            ],
            policies: [
              {
                policyType: 'petAllowed',
                content: '<p>不允许宠物</p>',
              },
            ],
          },
          checkinInfo: {
            checkinTime: '14:00',
            checkoutTime: '11:00',
          },
        });

      expect(createRes.status).toBe(201);
      const testHotelId = createRes.body._id;

      // 2. 提交酒店审核
      const submitRes = await request(app)
        .post(`/api/hotels/${testHotelId}/submit`)
        .set('Authorization', `Bearer ${merchantToken}`)
        .send({});

      expect(submitRes.status).toBe(200);

      // 清除之前的通知，只记录批准产生的通知
      await Notification.deleteMany({});

      // 3. 批准酒店
      const approveRes = await request(app)
        .post(`/api/admin/hotels/${testHotelId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(approveRes.status).toBe(200);

      // 4. 验证商户收到通知（直接查询 DB）
      const notifications = await Notification.find({
        userId: merchantUserId,
        type: 'audit_approved',
        targetType: 'hotel',
      });

      expect(notifications.length).toBeGreaterThan(0);
      expect(notifications[0].message).toContain('已通过审核');
    });

    test('应该在管理员驳回房间时通知商户并包含原因', async () => {
      // 清除通知
      await Notification.deleteMany({});

      // 先获取一个有效的 roomId 或创建一个
      // 为了避免之前的房间创建失败，我们需要创建一个有效的房间
      // 首先创建一个新的酒店
      const createHotelRes = await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${merchantToken}`)
        .send({
          baseInfo: {
            nameCn: '用于房间测试的酒店',
            address: '北京市test',
            city: '北京',
            star: 4,
            openTime: '2020-01-01',
            roomTotal: 100,
            phone: '010-12345678',
            description: '测试',
            images: ['http://example.com/image.jpg'],
            facilities: [
              {
                category: '公共设施',
                content: '<p>WiFi</p>',
              },
            ],
            policies: [
              {
                policyType: 'petAllowed',
                content: '<p>不允许宠物</p>',
              },
            ],
          },
          checkinInfo: {
            checkinTime: '14:00',
            checkoutTime: '11:00',
          },
        });

      const testHotelId = createHotelRes.body._id;

      // 批准测试酒店
      const approveHotelRes = await request(app)
        .post(`/api/admin/hotels/${testHotelId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(approveHotelRes.status).toBe(200);

      // 创建房间
      const createRoomRes = await request(app)
        .post(`/api/hotels/${testHotelId}/rooms`)
        .set('Authorization', `Bearer ${merchantToken}`)
        .send({
          baseInfo: {
            type: '豪华间',
            price: 599,
            images: ['http://example.com/room.jpg'],
            status: 'draft',
            maxOccupancy: 2,
            facilities: [
              {
                category: '房间设施',
                content: '<p>浴缸</p>',
              },
            ],
            policies: [
              {
                policyType: 'breakfast',
                content: '<p>免费早餐</p>',
              },
            ],
            bedRemark: ['豪华双床'],
          },
          headInfo: {
            size: '40 sqm',
            floor: '5',
            wifi: true,
            windowAvailable: true,
            smokingAllowed: false,
          },
          bedInfo: [
            {
              bedType: '大床',
              bedNumber: 1,
              bedSize: '1.5m x 2m',
            },
          ],
        });

      if (createRoomRes.status !== 201) {
        throw new Error(`Failed to create room: ${JSON.stringify(createRoomRes.body)}`);
      }

      const testRoomId = createRoomRes.body._id;

      // 清除之前的通知，只记录驳回产生的通知
      await Notification.deleteMany({});

      // 1. 驳回房间
      const rejectRes = await request(app)
        .post(`/api/admin/rooms/${testRoomId}/reject`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ reason: '房间设施不符合要求' });

      expect(rejectRes.status).toBe(200);

      // 2. 验证商户收到驳回通知
      const notifications = await Notification.find({
        userId: merchantUserId,
        type: 'audit_rejected',
        targetType: 'room',
      });

      expect(notifications.length).toBeGreaterThan(0);
      expect(notifications[0].message).toContain('审核未通过');
      expect(notifications[0].meta?.reason).toBe('房间设施不符合要求');
    });
  });

  describe('Notification Management', () => {
    test('应该正确分页获取通知列表', async () => {
      // 创建多个通知
      for (let i = 0; i < 25; i++) {
        await Notification.create({
          userId: adminUserId,
          senderType: 'system',
          type: 'audit_pending',
          targetType: 'merchant',
          targetId: merchantProfileId,
          message: `测试通知 ${i}`,
        });
      }

      const res = await request(app)
        .get('/api/admin/notifications?limit=10&page=1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(10);
      expect(res.body.meta.total).toBeGreaterThanOrEqual(25);
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.limit).toBe(10);
    });

    test('应该能够按通知类型筛选', async () => {
      const res = await request(app)
        .get('/api/admin/notifications?type=audit_pending')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      res.body.data.forEach((notification: any) => {
        expect(notification.type).toBe('audit_pending');
      });
    });

    test('应该能够标记单个通知为已读', async () => {
      // 创建一个未读通知
      const notification = await Notification.create({
        userId: adminUserId,
        senderType: 'system',
        type: 'audit_pending',
        targetType: 'merchant',
        targetId: merchantProfileId,
        message: '测试通知',
        read: false,
      });

      // 标记为已读
      const res = await request(app)
        .patch(`/api/admin/notifications/${notification._id}/read`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.read).toBe(true);

      // 验证数据库更新
      const updated = await Notification.findById(notification._id);
      expect(updated?.read).toBe(true);
    });

    test('应该能够标记所有通知为已读', async () => {
      // 创建几个未读通知
      await Promise.all([
        Notification.create({
          userId: adminUserId,
          senderType: 'system',
          type: 'audit_pending',
          targetType: 'merchant',
          targetId: merchantProfileId,
          message: '未读通知1',
          read: false,
        }),
        Notification.create({
          userId: adminUserId,
          senderType: 'system',
          type: 'audit_pending',
          targetType: 'merchant',
          targetId: merchantProfileId,
          message: '未读通知2',
          read: false,
        }),
      ]);

      // 标记全部为已读
      const res = await request(app)
        .patch('/api/admin/notifications/read-all')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);

      // 验证所有通知都已读
      const unreadNotifications = await Notification.find({ userId: adminUserId, read: false });
      expect(unreadNotifications.length).toBe(0);
    });

    test('应该返回未读通知计数', async () => {
      // 清除所有通知
      await Notification.deleteMany({ userId: adminUserId });

      // 创建 5 个未读通知
      await Promise.all(
        Array.from({ length: 5 }).map(() =>
          Notification.create({
            userId: adminUserId,
            senderType: 'system',
            type: 'audit_pending',
            targetType: 'merchant',
            targetId: merchantProfileId,
            message: '未读通知',
            read: false,
          })
        )
      );

      const res = await request(app)
        .get('/api/admin/notifications')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.meta.unreadCount).toBe(5);
    });
  });

  describe('Merchant Notification Submission', () => {
    test('应该在商户提交个人资料时通知管理员', async () => {
      // 清除通知
      await Notification.deleteMany({});

      // 创建新商户
      const newMerchantUser = await User.create({
        email: 'merchant2@test.com',
        password: 'hashed_password',
        role: 'merchant',
        status: 'active',
      });

      const newMerchantToken = jwt.sign(
        { id: newMerchantUser._id.toString(), role: 'merchant' },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // 创建商户资料
      const merchantProfile = await Merchant.create({
        userId: newMerchantUser._id,
        baseInfo: {
          merchantName: '新商户',
          contactName: '联系人',
          contactPhone: '13800000001',
          contactEmail: 'contact2@test.com',
        },
        qualificationInfo: {
          businessLicenseNo: 'BL123457',
          idCardNo: 'ID123457',
          realNameStatus: 'verified',
        },
        auditInfo: {
          verifyStatus: 'unverified',
        },
      });

      // 提交商户审核
      const submitRes = await request(app)
        .post('/api/merchants/submit')
        .set('Authorization', `Bearer ${newMerchantToken}`)
        .send({});

      expect(submitRes.status).toBe(200);

      // 验证管理员收到通知
      const notifications = await Notification.find({
        type: 'audit_pending',
        targetType: 'merchant',
        targetId: merchantProfile._id,
      });

      expect(notifications.length).toBeGreaterThan(0);
      expect(notifications[0].message).toContain('新商户');
    });
  });
});
