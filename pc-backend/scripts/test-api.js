/*
  简单集成测试脚本（Node.js），依赖：
  - 需要先启动后端服务（默认 http://localhost:3000）
  - 需要可访问 MongoDB（默认 mongodb://localhost:27017/estay-test）

  用法：
    BASE_URL=http://localhost:3000 MONGO_URI=mongodb://localhost:27017/estay-test node scripts/test-api.js
*/

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/estay';

function log(...args) {
  console.log('[test-api]', ...args);
}

async function http(path, opts = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, opts);
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  return { status: res.status, body };
}

async function ensureAdmin() {
  const adminEmail = 'admin@test.local';
  const adminPwd = 'AdminPass123!';

  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection.db;
  const users = db.collection('users');
  const existing = await users.findOne({ email: adminEmail });
  if (existing) {
    log('Admin user already exists.');
    return { email: adminEmail, password: adminPwd };
  }
  const hashed = await bcrypt.hash(adminPwd, 10);
  await users.insertOne({ email: adminEmail, password: hashed, role: 'admin', status: 'active', createdAt: new Date(), updatedAt: new Date() });
  log('Inserted admin user:', adminEmail);
  return { email: adminEmail, password: adminPwd };
}

async function run() {
  log('Start API test. Base URL:', BASE_URL);

  // ensure admin user exists
  await ensureAdmin();

  // 1. register merchant
  const merchantEmail = `merchant_${Date.now()}@test.local`;
  const merchantPwd = 'MerchantPass1!';
  log('Registering merchant', merchantEmail);
  let r = await http('/api/auth/register', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: merchantEmail, password: merchantPwd })
  });
  log('Register status', r.status, 'body', r.body);
  if (![200,201].includes(r.status)) return process.exit(1);

  // 2. login merchant
  r = await http('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: merchantEmail, password: merchantPwd }) });
  log('Merchant login', r.status, r.body);
  if (r.status !== 200) return process.exit(1);
  const merchantToken = r.body.token;

  // 3. check merchant profile absent
  r = await http('/api/merchants', { method: 'GET', headers: { Authorization: `Bearer ${merchantToken}` } });
  log('Get merchant profile (expect 404 or 200)', r.status);

  // 4. create merchant profile
  const profilePayload = { baseInfo: { merchantName: 'Test Merchant', contactName: 'Alice', contactPhone: '123456789', contactEmail: 'alice@test.local' } };
  r = await http('/api/merchants', { method: 'POST', headers: { Authorization: `Bearer ${merchantToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify(profilePayload) });
  log('Create merchant profile', r.status, r.body);
  if (r.status !== 200) return process.exit(1);

  // 5. submit merchant profile
  r = await http('/api/merchants/submit', { method: 'POST', headers: { Authorization: `Bearer ${merchantToken}` } });
  log('Submit merchant profile', r.status, r.body);
  if (r.status !== 200) return process.exit(1);

  // 6. admin login
  r = await http('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'admin@test.local', password: 'AdminPass123!' }) });
  log('Admin login', r.status, r.body);
  if (r.status !== 200) {
    log('Admin login failed. Common cause: test script DB != server DB.');
    log('Ensure backend MONGO_URI matches test script MONGO_URI or set MONGO_URI env var when running the script.');
    return process.exit(1);
  }
  const adminToken = r.body.token;

  // 7. admin list pending merchants (no list endpoint implemented) -> we will fetch the merchant by id via GET /api/merchants (merchant's own) to get id
  r = await http('/api/merchants', { method: 'GET', headers: { Authorization: `Bearer ${merchantToken}` } });
  const merchantProfile = r.body;
  const merchantId = merchantProfile._id;
  log('Merchant profile id', merchantId);

  // 8. admin approve merchant
  r = await http(`/api/admin/merchants/${merchantId}/approve`, { method: 'POST', headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ reason: 'OK' }) });
  log('Admin approve merchant', r.status, r.body);
  if (r.status !== 200) return process.exit(1);

  // fetch merchant profile again to confirm status
  r = await http('/api/merchants', { method: 'GET', headers: { Authorization: `Bearer ${merchantToken}` } });
  log('Merchant profile after approve', r.status, r.body);

  // 9. merchant create hotel
  const hotelPayload = { baseInfo: { nameCn: 'Test Hotel', address: 'Addr', city: 'City', star: 4, openTime: '24/7', roomTotal: 10, phone: '123', description: 'desc', images: [] }, checkinInfo: { checkinTime: '14:00', checkoutTime: '12:00' } };
  r = await http('/api/hotels', { method: 'POST', headers: { Authorization: `Bearer ${merchantToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify(hotelPayload) });
  log('Create hotel', r.status, r.body);
  if (r.status !== 201) return process.exit(1);
  const hotelId = r.body._id;

  // 10. merchant submit hotel
  r = await http(`/api/hotels/${hotelId}/submit`, { method: 'POST', headers: { Authorization: `Bearer ${merchantToken}` } });
  log('Submit hotel', r.status, r.body);
  if (r.status !== 200) return process.exit(1);

  // 11. admin approve hotel
  r = await http(`/api/admin/hotels/${hotelId}/approve`, { method: 'POST', headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ reason: 'OK' }) });
  log('Admin approve hotel', r.status, r.body);
  if (r.status !== 200) return process.exit(1);

  // 12. merchant create room (hotel approved)
  const roomPayload = { baseInfo: { type: 'Standard', price: 100, images: [], status: 'draft', maxOccupancy: 2 }, headInfo: { size: '20 sqm', floor: '5', wifi: true, windowAvailable: true, smokingAllowed: false }, bedInfo: [{ bedType: 'King', bedNumber: 1, bedSize: '2m' }], breakfastInfo: {} };
  r = await http(`/api/hotels/${hotelId}/rooms`, { method: 'POST', headers: { Authorization: `Bearer ${merchantToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify(roomPayload) });
  log('Create room', r.status, r.body);
  if (r.status !== 201) return process.exit(1);
  const roomId = r.body._id;

  // 13. merchant submit room
  r = await http(`/api/rooms/${roomId}/submit`, { method: 'POST', headers: { Authorization: `Bearer ${merchantToken}` } });
  log('Submit room', r.status, r.body);
  if (r.status !== 200) return process.exit(1);

  // 14. admin approve room
  r = await http(`/api/admin/rooms/${roomId}/approve`, { method: 'POST', headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ reason: 'OK' }) });
  log('Admin approve room', r.status, r.body);
  if (r.status !== 200) return process.exit(1);

  log('All steps completed successfully!');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => { console.error(err); process.exit(1); });
