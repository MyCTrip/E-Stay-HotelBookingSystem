import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Hotel } from '../src/modules/hotel/hotel.model';
import { Room } from '../src/modules/room/room.model';

dotenv.config();

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/estay';

const BATCH = parseInt(process.env.BATCH_SIZE || '500', 10);
const DRY = process.argv.includes('--dry-run');

async function fillHotels() {
  const cursor = Hotel.find().cursor();
  let updated = 0;
  for await (const doc of cursor) {
    let modified = false;
    if (!Array.isArray(doc.baseInfo?.facilities) || doc.baseInfo.facilities.length === 0) {
      modified = true;
      if (!DRY) doc.baseInfo.facilities = [{ category: 'General', content: '<p>未填写</p>' }];
    }
    if (!Array.isArray(doc.baseInfo?.policies) || doc.baseInfo.policies.length === 0) {
      modified = true;
      if (!DRY) doc.baseInfo.policies = [{ policyType: 'default', content: '<p>未填写</p>' }];
    }
    if (modified) {
      updated += 1;
      if (!DRY) await doc.save();
    }
  }
  return updated;
}

async function fillRooms() {
  const cursor = Room.find().cursor();
  let updated = 0;
  for await (const doc of cursor) {
    let modified = false;
    if (!Array.isArray(doc.baseInfo?.facilities) || doc.baseInfo.facilities.length === 0) {
      modified = true;
      if (!DRY) doc.baseInfo.facilities = [{ category: 'Room', content: '<p>未填写</p>' }];
    }
    if (!Array.isArray(doc.baseInfo?.policies) || doc.baseInfo.policies.length === 0) {
      modified = true;
      if (!DRY) doc.baseInfo.policies = [{ policyType: 'default', content: '<p>未填写</p>' }];
    }
    if (!Array.isArray(doc.baseInfo?.bedRemark) || doc.baseInfo.bedRemark.length === 0) {
      modified = true;
      if (!DRY) doc.baseInfo.bedRemark = ['无'];
    }
    if (modified) {
      updated += 1;
      if (!DRY) await doc.save();
    }
  }
  return updated;
}

async function main() {
  await mongoose.connect(MONGO);
  console.log('Connected to', MONGO, DRY ? '(dry run)' : '');
  const hu = await fillHotels();
  const ru = await fillRooms();
  console.log(`Hotels updated: ${hu}, Rooms updated: ${ru}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});