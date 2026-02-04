const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// Simple arg parser to avoid extra dependencies
function parseArgs(argv) {
  const args = {};
  for (const a of argv) {
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq === -1) {
        const k = a.slice(2);
        args[k] = true;
      } else {
        const k = a.slice(2, eq);
        args[k] = a.slice(eq + 1);
      }
    } else if (a.startsWith('-')) {
      const k = a.slice(1);
      args[k] = true;
    }
  }
  return args;
}
const ARGS = parseArgs(process.argv.slice(2));
const APPLY = !!ARGS.apply;
const DRY = !APPLY || !!ARGS['dry-run'];
const BATCH = parseInt(ARGS['batch-size'] || ARGS.batch || '500', 10);
const RESUME = !!ARGS.resume;
const LOG_DIR = path.resolve(process.cwd(), 'migrations');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
const LOG_PATH = ARGS.log || path.join(LOG_DIR, `migrate-fill-facility-policy-${new Date().toISOString().replace(/[:.]/g, '-')}.jsonl`);

// Use lightweight migration models to avoid transpilation dependency
const Schema = mongoose.Schema;
const HotelSchema = new Schema({ baseInfo: { type: Schema.Types.Mixed } }, { strict: false });
const RoomSchema = new Schema({ baseInfo: { type: Schema.Types.Mixed } }, { strict: false });
const Hotel = mongoose.model('Hotel', HotelSchema, 'hotels');
const Room = mongoose.model('Room', RoomSchema, 'rooms');

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/estay';

// Read processed IDs if resume
let processedIds = new Set();
if (RESUME && fs.existsSync(LOG_PATH)) {
  const lines = fs.readFileSync(LOG_PATH, 'utf8').split(/\r?\n/).filter(Boolean);
  for (const l of lines) {
    try {
      const r = JSON.parse(l);
      if (r && r.id) processedIds.add(r.id);
    } catch (e) {
      // ignore
    }
  }
}

function appendLog(entry) {
  fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + '\n');
}

async function processCursor(Model, transformFn, collectionName) {
  const cursor = Model.find().cursor();
  let updated = 0;
  let checked = 0;
  let batchCount = 0;

  for await (const doc of cursor) {
    checked++;
    const id = String(doc._id);
    if (processedIds.has(id)) continue; // already handled

    const { needUpdate, before, after } = transformFn(doc);
    if (!needUpdate) continue;

    batchCount++;
    if (DRY) {
      // report only in dry-run
      console.log(`[DRY] would update ${collectionName} ${id}:`, Object.keys(after));
    } else {
      // apply the update and log before/after for rollback
      try {
        await Model.updateOne({ _id: doc._id }, { $set: after });
        appendLog({ ts: new Date().toISOString(), collection: collectionName, id, before, after });
      } catch (err) {
        appendLog({ ts: new Date().toISOString(), collection: collectionName, id, error: String(err) });
        console.error(`Failed to update ${collectionName} ${id}:`, err.message || err);
      }
    }
    updated++;

    // flush progress
    if (batchCount >= BATCH) {
      console.log(`Processed ${checked} documents, applied ${updated} updates so far...`);
      batchCount = 0;
    }
  }
  return { checked, updated };
}

function hotelTransform(doc) {
  const before = {};
  const after = {};
  let need = false;
  const b = doc.baseInfo || {};
  if (!Array.isArray(b.facilities) || b.facilities.length === 0) {
    need = true;
    before.facilities = b.facilities || null;
    after['baseInfo.facilities'] = [{ category: 'General', content: '<p>未填写</p>' }];
  }
  if (!Array.isArray(b.policies) || b.policies.length === 0) {
    need = true;
    before.policies = b.policies || null;
    after['baseInfo.policies'] = [{ policyType: 'default', content: '<p>未填写</p>' }];
  }
  return { needUpdate: need, before, after };
}

function roomTransform(doc) {
  const before = {};
  const after = {};
  let need = false;
  const b = doc.baseInfo || {};
  if (!Array.isArray(b.facilities) || b.facilities.length === 0) {
    need = true;
    before.facilities = b.facilities || null;
    after['baseInfo.facilities'] = [{ category: 'Room', content: '<p>未填写</p>' }];
  }
  if (!Array.isArray(b.policies) || b.policies.length === 0) {
    need = true;
    before.policies = b.policies || null;
    after['baseInfo.policies'] = [{ policyType: 'default', content: '<p>未填写</p>' }];
  }
  if (!Array.isArray(b.bedRemark) || b.bedRemark.length === 0) {
    need = true;
    before.bedRemark = b.bedRemark || null;
    after['baseInfo.bedRemark'] = ['无'];
  }
  return { needUpdate: need, before, after };
}

async function main() {
  await mongoose.connect(MONGO);
  console.log('Connected to', MONGO, DRY ? '(dry run)' : '(apply)');
  console.log(`Batch size: ${BATCH}, Log: ${LOG_PATH}, Resume: ${RESUME}`);

  const hotels = await processCursor(Hotel, hotelTransform, 'hotels');
  const rooms = await processCursor(Room, roomTransform, 'rooms');

  console.log('Done. Summary:');
  console.log('Hotels checked:', hotels.checked, 'updated:', hotels.updated);
  console.log('Rooms checked:', rooms.checked, 'updated:', rooms.updated);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});