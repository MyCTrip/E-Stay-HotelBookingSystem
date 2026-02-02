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

  // create room
  const roomRes = await request(app)
    .post(`/api/hotels/${hotelId}/rooms`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      baseInfo: { type: 'Std', price: 100, images: [], status: 'draft', maxOccupancy: 2 },
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
      baseInfo: { type: 'Deluxe', price: 200, images: [], status: 'draft', maxOccupancy: 2 },
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

  // bulk offline rooms
  const bulkRes = await request(app)
    .post('/api/admin/rooms/bulk')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ ids: [roomId2], action: 'offline' })
    .expect(200);
  expect(bulkRes.body.updated.length).toBeGreaterThanOrEqual(1);
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
      baseInfo: { type: 'Std', price: 100, images: [], status: 'draft', maxOccupancy: 2 },
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
