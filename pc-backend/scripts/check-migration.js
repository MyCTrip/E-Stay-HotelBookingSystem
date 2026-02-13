/**
 * 检查迁移后的数据
 * 用法: node check-migration.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/estay';

const hotelSchema = new mongoose.Schema({}, { strict: false });
const roomSchema = new mongoose.Schema({}, { strict: false });

const Hotel = mongoose.model('Hotel', hotelSchema);
const Room = mongoose.model('Room', roomSchema);

async function checkMigration() {
  try {
    console.log('连接数据库...\n');
    await mongoose.connect(MONGO_URI);

    // 检查 Hotel 数据
    console.log('========== HOTEL 数据检查 ==========\n');
    const hotelCount = await Hotel.countDocuments();
    console.log(`总 Hotel 数: ${hotelCount}`);

    const hotelWithPropertyType = await Hotel.countDocuments({
      'baseInfo.propertyType': { $exists: true },
    });
    console.log(`有 propertyType 字段的 Hotel: ${hotelWithPropertyType}`);

    const hotelWithTypeConfig = await Hotel.countDocuments({
      typeConfig: { $exists: true },
    });
    console.log(`有 typeConfig 字段的 Hotel: ${hotelWithTypeConfig}\n`);

    // 显示 Hotel 示例数据
    console.log('--- Hotel 样本数据（前3条）---');
    const sampleHotels = await Hotel.find()
      .select('_id baseInfo.nameCn baseInfo.propertyType typeConfig')
      .limit(3)
      .exec();

    sampleHotels.forEach((hotel, index) => {
      console.log(`\n[Hotel ${index + 1}]`);
      console.log('  ID:', hotel._id);
      console.log('  名称:', hotel.baseInfo?.nameCn || 'N/A');
      console.log('  propertyType:', hotel.baseInfo?.propertyType || 'N/A');
      console.log('  typeConfig:', JSON.stringify(hotel.typeConfig || {}, null, 2));
    });

    // 检查 Room 数据
    console.log('\n\n========== ROOM 数据检查 ==========\n');
    const roomCount = await Room.countDocuments();
    console.log(`总 Room 数: ${roomCount}`);

    const roomWithCategory = await Room.countDocuments({
      'baseInfo.category': { $exists: true },
    });
    console.log(`有 category 字段的 Room: ${roomWithCategory}`);

    const roomWithTypeConfig = await Room.countDocuments({
      typeConfig: { $exists: true },
    });
    console.log(`有 typeConfig 字段的 Room: ${roomWithTypeConfig}\n`);

    // 显示 Room 示例数据
    console.log('--- Room 样本数据（前3条）---');
    const sampleRooms = await Room.find()
      .select('_id baseInfo.category baseInfo.roomName typeConfig')
      .limit(3)
      .exec();

    sampleRooms.forEach((room, index) => {
      console.log(`\n[Room ${index + 1}]`);
      console.log('  ID:', room._id);
      console.log('  房间名:', room.baseInfo?.roomName || 'N/A');
      console.log('  category:', room.baseInfo?.category || 'N/A');
      console.log('  typeConfig:', JSON.stringify(room.typeConfig || {}, null, 2));
    });

    // 分布统计
    console.log('\n\n========== 分布统计 ==========\n');
    console.log('--- Hotel propertyType 分布 ---');
    const hotelTypeDistribution = await Hotel.aggregate([
      {
        $group: {
          _id: '$baseInfo.propertyType',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    hotelTypeDistribution.forEach((item) => {
      console.log(`  ${item._id || 'undefined'}: ${item.count}`);
    });

    console.log('\n--- Room category 分布 ---');
    const roomCategoryDistribution = await Room.aggregate([
      {
        $group: {
          _id: '$baseInfo.category',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    roomCategoryDistribution.forEach((item) => {
      console.log(`  ${item._id || 'undefined'}: ${item.count}`);
    });

    console.log('\n✓ 数据检查完成\n');

    await mongoose.disconnect();
  } catch (error) {
    console.error('错误:', error.message);
    process.exit(1);
  }
}

checkMigration();
