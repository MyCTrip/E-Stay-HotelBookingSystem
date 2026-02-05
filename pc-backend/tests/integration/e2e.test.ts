import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../../src/app';
import bcrypt from 'bcryptjs';
import { User } from '../../src/modules/user/user.model';
import { AdminProfile } from '../../src/modules/admin/admin.model';
import { AuditLog } from '../../src/modules/audit/audit.model';

// Increase default jest timeout because MongoDB binary may take time to download in CI/networked environments
jest.setTimeout(60000);

let mongod: MongoMemoryServer;
let server: any;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  // create default admin
  const hash = await bcrypt.hash('admin123', 10);
  await User.create({ email: 'admin@local.com', password: hash, role: 'admin' });
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

beforeEach(async () => {
  // clean collections
  const collections = await mongoose.connection.db.collections();
  for (const coll of collections) {
    await coll.deleteMany({});
  }
  // recreate admin and admin profile
  const hash = await bcrypt.hash('admin123', 10);
  const adminUser = await User.create({ email: 'admin@local.com', password: hash, role: 'admin' });
  await AdminProfile.create({
    userId: adminUser._id,
    baseInfo: { name: 'System Administrator', employeeNo: 'ADM001' },
  });
});

const register = (email: string, password: string) => {
  return request(app).post('/api/auth/register').send({ email, password });
};

const login = async (email: string, password: string) => {
  const res = await request(app).post('/api/auth/login').send({ email, password });
  if (res.status !== 200)
    throw new Error(`Login failed: ${res.status} ${JSON.stringify(res.body)}`);
  return res.body.token;
};

test('full end-to-end flow', async () => {
  const merchantEmail = `m1@test.local`;
  const merchantPwd = 'Merchant1!';

  await register(merchantEmail, merchantPwd).expect(201);
  const token = await login(merchantEmail, merchantPwd);

  // create merchant profile
  await request(app)
    .post('/api/merchants')
    .set('Authorization', `Bearer ${token}`)
    .send({
      baseInfo: {
        merchantName: 'M',
        contactName: 'Alice',
        contactPhone: '123',
        contactEmail: 'a@test.com',
      },
    })
    .expect(200);

  // submit
  await request(app)
    .post('/api/merchants/submit')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  // admin login
  const adminToken = await login('admin@local.com', 'admin123');

  // fetch merchant id
  const mp = await request(app).get('/api/merchants').set('Authorization', `Bearer ${token}`);
  const merchantId = mp.body._id;

  // admin approve
  await request(app)
    .post(`/api/admin/merchants/${merchantId}/approve`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ reason: 'ok' })
    .expect(200);

  // create hotel
  const hotelRes = await request(app)
    .post('/api/hotels')
    .set('Authorization', `Bearer ${token}`)
    .send({
      baseInfo: {
        nameCn: 'H',
        address: 'A',
        city: 'C',
        star: 3,
        openTime: '24/7',
        roomTotal: 1,
        phone: 'p',
        description: 'd',
        images: [],
        facilities: [{ category: '基础设施', content: '<p>WiFi</p>' }],
        policies: [{ policyType: 'petAllowed', content: '<p>no</p>' }],
      },
      checkinInfo: { checkinTime: '14:00', checkoutTime: '12:00' },
    })
    .expect(201);
  const hotelId = hotelRes.body._id;

  // submit hotel
  await request(app)
    .post(`/api/hotels/${hotelId}/submit`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  // admin approve hotel
  await request(app)
    .post(`/api/admin/hotels/${hotelId}/approve`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ reason: 'ok' })
    .expect(200);

  // Merchant updates hotel -> becomes pendingChanges and status pending
  const updateRes = await request(app)
    .put(`/api/hotels/${hotelId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ baseInfo: { nameCn: 'H Updated' } })
    .expect(200);
  expect(updateRes.body.auditInfo.status).toBe('pending');
  expect(updateRes.body.pendingChanges).toBeDefined();
  expect(updateRes.body.pendingChanges.baseInfo.nameCn).toBe('H Updated');

  // Admin approves the update -> pendingChanges applied
  await request(app)
    .post(`/api/admin/hotels/${hotelId}/approve`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ reason: 'approve update' })
    .expect(200);

  const myHotelsAfterUpdate = await request(app)
    .get('/api/hotels/my')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  expect(myHotelsAfterUpdate.body.data.find((h: any) => h._id === hotelId).baseInfo.nameCn).toBe('H Updated');

  // create room
  const roomRes = await request(app)
    .post(`/api/hotels/${hotelId}/rooms`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      baseInfo: { type: 'Std', price: 100, images: [], status: 'draft', maxOccupancy: 2, facilities: [{ category: '房内', content: '<p>空调</p>' }], policies: [{ policyType: 'noSmoking', content: '<p>No smoking</p>' }], bedRemark: ['成人加床说明'] },
      headInfo: {
        size: '20',
        floor: '1',
        wifi: true,
        windowAvailable: true,
        smokingAllowed: false,
      },
      bedInfo: [{ bedType: 'King', bedNumber: 1, bedSize: '2m' }],
      breakfastInfo: {},
    })
    .expect(201);
  const roomId = roomRes.body._id;

  // submit room
  await request(app)
    .post(`/api/rooms/${roomId}/submit`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  // admin approve room
  await request(app)
    .post(`/api/admin/rooms/${roomId}/approve`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ reason: 'ok' })
    .expect(200);

  // check audit logs endpoint (supports pagination/filtering)
  const logsRes = await request(app)
    .get('/api/admin/audit-logs')
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(200);
  expect(Array.isArray(logsRes.body.data)).toBe(true);
  expect(logsRes.body.meta).toBeDefined();
  expect(logsRes.body.meta.total).toBeGreaterThan(0);

  // admin can offline a room (single)
  await request(app)
    .post(`/api/admin/rooms/${roomId}/offline`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ reason: 'maintenance' })
    .expect(200);

  // verify audit log filtered by targetType/action
  const filtered = await request(app)
    .get('/api/admin/audit-logs')
    .set('Authorization', `Bearer ${adminToken}`)
    .query({ targetType: 'room', action: 'offline' })
    .expect(200);
  expect(Array.isArray(filtered.body.data)).toBe(true);
  expect(filtered.body.data.length).toBeGreaterThan(0);
  expect(filtered.body.data[0].action).toBe('offline');

  // create a second room and approve it to test bulk offline
  const roomRes2 = await request(app)
    .post(`/api/hotels/${hotelId}/rooms`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      baseInfo: { type: 'Deluxe', price: 200, images: [], status: 'draft', maxOccupancy: 2, facilities: [{ category: '房内', content: '<p>电视</p>' }], policies: [{ policyType: 'petAllowed', content: '<p>yes</p>' }], bedRemark: ['床型特别说明'] },
      headInfo: {
        size: '25',
        floor: '2',
        wifi: true,
        windowAvailable: true,
        smokingAllowed: false,
      },
      bedInfo: [{ bedType: 'Queen', bedNumber: 1, bedSize: '1.5m' }],
      breakfastInfo: {},
    })
    .expect(201);
  const roomId2 = roomRes2.body._id;
  await request(app)
    .post(`/api/rooms/${roomId2}/submit`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  await request(app)
    .post(`/api/admin/rooms/${roomId2}/approve`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ reason: 'ok' })
    .expect(200);

  // Merchant updates the approved room -> becomes pendingChanges and status pending
  const roomUpdateRes = await request(app)
    .put(`/api/rooms/${roomId2}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ baseInfo: { price: 180 } })
    .expect(200);
  expect(roomUpdateRes.body.auditInfo.status).toBe('pending');
  expect(roomUpdateRes.body.pendingChanges).toBeDefined();
  expect(roomUpdateRes.body.pendingChanges.baseInfo.price).toBe(180);

  // Admin approves the room update
  await request(app)
    .post(`/api/admin/rooms/${roomId2}/approve`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ reason: 'approve room update' })
    .expect(200);

  // Fetch rooms for hotel and verify price updated
  const roomsAfter = await request(app)
    .get(`/api/hotels/${hotelId}/rooms`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  expect(roomsAfter.body.data.find((r: any) => r._id === roomId2).baseInfo.price).toBe(180);

  // bulk offline rooms
  const bulkRes = await request(app)
    .post('/api/admin/rooms/bulk')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ ids: [roomId2], action: 'offline' })
    .expect(200);
  expect(bulkRes.body.updated.length).toBeGreaterThanOrEqual(1);
});

test('merchant can request deletion and admin approve delete; notifications & audit logged', async () => {
  const merchantEmail = `delm@test.local`;
  const merchantPwd = 'Merchant1!';
  await register(merchantEmail, merchantPwd).expect(201);
  const token = await login(merchantEmail, merchantPwd);

  // create merchant profile
  await request(app)
    .post('/api/merchants')
    .set('Authorization', `Bearer ${token}`)
    .send({ baseInfo: { merchantName: 'DM', contactName: 'D', contactPhone: '123', contactEmail: 'd@test.com' } })
    .expect(200);
  await request(app).post('/api/merchants/submit').set('Authorization', `Bearer ${token}`).expect(200);

  // admin approve merchant
  const adminToken = await login('admin@local.com', 'admin123');
  const mp = await request(app).get('/api/merchants').set('Authorization', `Bearer ${token}`);
  const merchantId = mp.body._id;
  await request(app).post(`/api/admin/merchants/${merchantId}/approve`).set('Authorization', `Bearer ${adminToken}`).send({ reason: 'ok' }).expect(200);

  // create and approve hotel
  const hotelRes = await request(app)
    .post('/api/hotels')
    .set('Authorization', `Bearer ${token}`)
    .send({ baseInfo: { nameCn: 'DelHotel', address: 'A', city: 'C', star: 3, openTime: '24/7', roomTotal: 1, phone: 'p', description: 'd', images: [], facilities: [{ category: '基础', content: '<p>WiFi</p>' }], policies: [{ policyType: 'petAllowed', content: '<p>no</p>' }] }, checkinInfo: { checkinTime: '14:00', checkoutTime: '12:00' } })
    .expect(201);
  const hotelId = hotelRes.body._id;
  await request(app).post(`/api/hotels/${hotelId}/submit`).set('Authorization', `Bearer ${token}`).expect(200);
  await request(app).post(`/api/admin/hotels/${hotelId}/approve`).set('Authorization', `Bearer ${adminToken}`).send({ reason: 'ok' }).expect(200);

  // merchant requests delete
  const delReq = await request(app).post(`/api/hotels/${hotelId}/delete-request`).set('Authorization', `Bearer ${token}`).expect(200);
  expect(delReq.body.pendingDeletion).toBe(true);

  // admin should see audit log and receive notification
  const logs = await AuditLog.find({ targetType: 'hotel', targetId: hotelId, action: 'delete_request' });
  expect(logs.length).toBeGreaterThanOrEqual(1);

  const notifs = await request(app).get('/api/admin/notifications').set('Authorization', `Bearer ${adminToken}`).expect(200);
  expect(Array.isArray(notifs.body.data)).toBe(true);
  expect(notifs.body.data.length).toBeGreaterThanOrEqual(1);

  // admin approves delete
  await request(app).post(`/api/admin/hotels/${hotelId}/approve-delete`).set('Authorization', `Bearer ${adminToken}`).send({ reason: 'ok' }).expect(200);

  // hotel should be offline/deletedAt set
  const h = await request(app).get('/api/hotels/my').set('Authorization', `Bearer ${token}`).expect(200);
  const found = h.body.data.find((x: any) => x._id === hotelId);
  expect(found.auditInfo.status).toBe('offline');
  expect(found.deletedAt).toBeDefined();

  // cannot create room under deleted/offline hotel
  await request(app)
    .post(`/api/hotels/${hotelId}/rooms`)
    .set('Authorization', `Bearer ${token}`)
    .send({ baseInfo: { type: 'Std', price: 100, images: [], status: 'draft', maxOccupancy: 2, facilities: [{ category: '房内', content: '<p>空调</p>' }], policies: [{ policyType: 'noSmoking', content: '<p>No smoking</p>' }], bedRemark: ['备注'] }, headInfo: { size: '20', floor: '1', wifi: true, windowAvailable: true, smokingAllowed: false }, bedInfo: [{ bedType: 'King', bedNumber: 1, bedSize: '2m' }], breakfastInfo: {} })
    .expect(403);
});

test('optimistic concurrency prevents stale merchant updates', async () => {
  const merchantEmail = `conc@test.local`;
  const merchantPwd = 'Merchant1!';
  await register(merchantEmail, merchantPwd).expect(201);
  const token = await login(merchantEmail, merchantPwd);

  // create merchant and hotel approved
  await request(app).post('/api/merchants').set('Authorization', `Bearer ${token}`).send({ baseInfo: { merchantName: 'C', contactName: 'C', contactPhone: '1', contactEmail: 'c@test.com' } }).expect(200);
  await request(app).post('/api/merchants/submit').set('Authorization', `Bearer ${token}`).expect(200);
  const adminToken = await login('admin@local.com', 'admin123');
  const mp = await request(app).get('/api/merchants').set('Authorization', `Bearer ${token}`);
  const merchantId = mp.body._id;
  await request(app).post(`/api/admin/merchants/${merchantId}/approve`).set('Authorization', `Bearer ${adminToken}`).send({ reason: 'ok' }).expect(200);

  const hotelRes = await request(app).post('/api/hotels').set('Authorization', `Bearer ${token}`).send({ baseInfo: { nameCn: 'ConcHotel', address: 'A', city: 'C', star: 3, openTime: '24/7', roomTotal: 1, phone: 'p', description: 'd', images: [], facilities: [{ category: '基础', content: '<p>WiFi</p>' }], policies: [{ policyType: 'petAllowed', content: '<p>no</p>' }] }, checkinInfo: { checkinTime: '14:00', checkoutTime: '12:00' } }).expect(201);
  const hotelId = hotelRes.body._id;
  await request(app).post(`/api/hotels/${hotelId}/submit`).set('Authorization', `Bearer ${token}`).expect(200);
  await request(app).post(`/api/admin/hotels/${hotelId}/approve`).set('Authorization', `Bearer ${adminToken}`).send({ reason: 'ok' }).expect(200);

  // fetch hotel with version
  const myHotels = await request(app).get('/api/hotels/my').set('Authorization', `Bearer ${token}`).expect(200);
  const h = myHotels.body.data.find((x: any) => x._id === hotelId);
  const v = h.__v;

  // first update with correct version
  await request(app).put(`/api/hotels/${hotelId}`).set('Authorization', `Bearer ${token}`).send({ baseInfo: { nameCn: 'ConcUpdated1' }, __v: v }).expect(200);

  // second update using the same old version should conflict
  await request(app).put(`/api/hotels/${hotelId}`).set('Authorization', `Bearer ${token}`).send({ baseInfo: { nameCn: 'ConcUpdated2' }, __v: v }).expect(409);
});
test('bulk approve merchants and audit log entries', async () => {
  const token1 = await (async () => {
    await register('bm1@test.com', 'password1');
    return await login('bm1@test.com', 'password1');
  })();
  const token2 = await (async () => {
    await register('bm2@test.com', 'password2');
    return await login('bm2@test.com', 'password2');
  })();

  // create and submit both merchant profiles
  const r1 = await request(app)
    .post('/api/merchants')
    .set('Authorization', `Bearer ${token1}`)
    .send({
      baseInfo: {
        merchantName: 'bm1',
        contactName: 'a',
        contactPhone: '1',
        contactEmail: 'a@b.com',
      },
    })
    .expect(200);
  await request(app)
    .post('/api/merchants/submit')
    .set('Authorization', `Bearer ${token1}`)
    .expect(200);
  const r2 = await request(app)
    .post('/api/merchants')
    .set('Authorization', `Bearer ${token2}`)
    .send({
      baseInfo: {
        merchantName: 'bm2',
        contactName: 'b',
        contactPhone: '2',
        contactEmail: 'b@b.com',
      },
    })
    .expect(200);
  await request(app)
    .post('/api/merchants/submit')
    .set('Authorization', `Bearer ${token2}`)
    .expect(200);

  const mp1 = await request(app).get('/api/merchants').set('Authorization', `Bearer ${token1}`);
  const mp2 = await request(app).get('/api/merchants').set('Authorization', `Bearer ${token2}`);

  const adminToken = await login('admin@local.com', 'admin123');

  // bulk approve
  const bulkRes = await request(app)
    .post('/api/admin/merchants/bulk')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ ids: [mp1.body._id, mp2.body._id], action: 'approve' })
    .expect(200);
  expect(bulkRes.body.updated.length).toBe(2);

  // check audit logs contains approve entries
  const logs = await AuditLog.find({ targetType: 'merchant', action: 'approve' });
  expect(logs.length).toBeGreaterThanOrEqual(2);
});

test('admin can fetch own profile via GET /api/admin/me', async () => {
  const adminToken = await login('admin@local.com', 'admin123');
  const res = await request(app)
    .get('/api/admin/me')
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(200);
  expect(res.body.baseInfo).toBeDefined();
  expect(res.body.baseInfo.name).toBe('System Administrator');
});

test('merchant can list own hotels and hotel rooms; admin can list pending merchants/hotels/rooms', async () => {
  // create merchant A who will have pending hotel & room
  const merchantEmail = `pm1@test.local`;
  const merchantPwd = 'Merchant1!';
  await register(merchantEmail, merchantPwd).expect(201);
  const token = await login(merchantEmail, merchantPwd);

  // create merchant profile and submit (pending)
  await request(app)
    .post('/api/merchants')
    .set('Authorization', `Bearer ${token}`)
    .send({
      baseInfo: {
        merchantName: 'PM1',
        contactName: 'Alice',
        contactPhone: '123',
        contactEmail: 'a@test.com',
      },
    })
    .expect(200);
  await request(app)
    .post('/api/merchants/submit')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  // admin login and approve merchant to let them create hotels
  const adminToken = await login('admin@local.com', 'admin123');
  const mp = await request(app).get('/api/merchants').set('Authorization', `Bearer ${token}`);
  const merchantId = mp.body._id;
  await request(app)
    .post(`/api/admin/merchants/${merchantId}/approve`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ reason: 'ok' })
    .expect(200);

  // merchant creates hotels
  const hotel1Res = await request(app)
    .post('/api/hotels')
    .set('Authorization', `Bearer ${token}`)
    .send({
      baseInfo: {
        nameCn: 'Hotel A',
        address: 'A',
        city: 'C',
        star: 3,
        openTime: '24/7',
        roomTotal: 2,
        phone: 'p',
        description: 'd',
        images: [],
        facilities: [{ category: '基础', content: '<p>WiFi</p>' }],
        policies: [{ policyType: 'petAllowed', content: '<p>no</p>' }],
      },
      checkinInfo: { checkinTime: '14:00', checkoutTime: '12:00' },
    })
    .expect(201);
  const hotel1 = hotel1Res.body;

  const hotel2Res = await request(app)
    .post('/api/hotels')
    .set('Authorization', `Bearer ${token}`)
    .send({
      baseInfo: {
        nameCn: 'Hotel B',
        address: 'B',
        city: 'C',
        star: 4,
        openTime: '24/7',
        roomTotal: 1,
        phone: 'p',
        description: 'd',
        images: [],
        facilities: [{ category: '基础', content: '<p>停车</p>' }],
        policies: [{ policyType: 'petAllowed', content: '<p>no</p>' }],
      },
      checkinInfo: { checkinTime: '14:00', checkoutTime: '12:00' },
    })
    .expect(201);
  const hotel2 = hotel2Res.body;

  // submit hotel1 so it becomes pending
  await request(app)
    .post(`/api/hotels/${hotel1._id}/submit`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  // submit hotel2 and then admin approve it so merchant can create rooms under it
  await request(app)
    .post(`/api/hotels/${hotel2._id}/submit`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  await request(app)
    .post(`/api/admin/hotels/${hotel2._id}/approve`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ reason: 'ok' })
    .expect(200);

  // merchant lists own hotels
  const myHotels = await request(app)
    .get('/api/hotels/my')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  expect(myHotels.body.data).toBeDefined();
  expect(myHotels.body.meta).toBeDefined();
  expect(myHotels.body.data.length).toBeGreaterThanOrEqual(2);

  // merchant lists rooms for hotel1 (none yet)
  const roomsEmpty = await request(app)
    .get(`/api/hotels/${hotel1._id}/rooms`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  expect(roomsEmpty.body.data.length).toBe(0);

  // create rooms under approved hotel2 and submit one
  const r1 = await request(app)
    .post(`/api/hotels/${hotel2._id}/rooms`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      baseInfo: { type: 'Std', price: 100, images: [], status: 'draft', maxOccupancy: 2, facilities: [{ category: '房内', content: '<p>空调</p>' }], policies: [{ policyType: 'noSmoking', content: '<p>No smoking</p>' }], bedRemark: ['成人加床说明'] },
      headInfo: {
        size: '20',
        floor: '1',
        wifi: true,
        windowAvailable: true,
        smokingAllowed: false,
      },
      bedInfo: [{ bedType: 'King', bedNumber: 1, bedSize: '2m' }],
      breakfastInfo: {},
    })
    .expect(201);
  const roomId = r1.body._id;
  await request(app)
    .post(`/api/rooms/${roomId}/submit`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  // merchant lists rooms for hotel2
  const rooms = await request(app)
    .get(`/api/hotels/${hotel2._id}/rooms`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  expect(rooms.body.data.length).toBeGreaterThanOrEqual(1);

  // create another merchant and leave pending for admin
  await register('pm2@test.local', 'pwd123').expect(201);
  const pm2Token = await login('pm2@test.local', 'pwd123');
  await request(app)
    .post('/api/merchants')
    .set('Authorization', `Bearer ${pm2Token}`)
    .send({
      baseInfo: {
        merchantName: 'PM2',
        contactName: 'B',
        contactPhone: '2',
        contactEmail: 'b@test.com',
      },
    })
    .expect(200);
  await request(app)
    .post('/api/merchants/submit')
    .set('Authorization', `Bearer ${pm2Token}`)
    .expect(200);

  // admin lists pending merchants
  const pendingMerchants = await request(app)
    .get('/api/admin/merchants')
    .set('Authorization', `Bearer ${adminToken}`)
    .query({ status: 'pending' })
    .expect(200);
  expect(pendingMerchants.body.data).toBeDefined();
  expect(pendingMerchants.body.data.length).toBeGreaterThanOrEqual(1);

  // admin lists pending hotels
  const pendingHotels = await request(app)
    .get('/api/admin/hotels')
    .set('Authorization', `Bearer ${adminToken}`)
    .query({ status: 'pending' })
    .expect(200);
  expect(pendingHotels.body.data.length).toBeGreaterThanOrEqual(1);

  // admin lists pending rooms
  const pendingRooms = await request(app)
    .get('/api/admin/rooms')
    .set('Authorization', `Bearer ${adminToken}`)
    .query({ status: 'pending' })
    .expect(200);
  expect(pendingRooms.body.data.length).toBeGreaterThanOrEqual(1);
});
