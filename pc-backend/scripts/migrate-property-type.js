/**
 * 数据迁移脚本：为现有数据添加 propertyType 和 typeConfig
 * 
 * 使用方法：
 * node migrate-property-type.js
 * 
 * 说明：
 * 1. 为所有 Hotel 添加 propertyType = 'hotel'（默认）
 * 2. 为所有 Room 添加 category = 'standard'（默认）
 * 3. 清除 redis 缓存（如果需要）
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/estay';

// 定义 Hotel schema
const hotelSchema = new mongoose.Schema(
  {
    merchantId: mongoose.Schema.Types.ObjectId,
    baseInfo: {
      nameCn: String,
      propertyType: {
        type: String,
        enum: ['hotel', 'hourlyHotel', 'homeStay'],
        default: 'hotel',
      },
      // 其他字段可选
    },
    typeConfig: mongoose.Schema.Types.Mixed,
    // 其他字段
  },
  { strict: false }
);

// 定义 Room schema
const roomSchema = new mongoose.Schema(
  {
    hotelId: mongoose.Schema.Types.ObjectId,
    baseInfo: {
      category: {
        type: String,
        enum: ['standard', 'hourly', 'homestay'],
        default: 'standard',
      },
      // 其他字段
    },
    typeConfig: mongoose.Schema.Types.Mixed,
    // 其他字段
  },
  { strict: false }
);

const Hotel = mongoose.model('Hotel', hotelSchema);
const Room = mongoose.model('Room', roomSchema);

async function migrate() {
  try {
    console.log('开始迁移数据...');
    await mongoose.connect(MONGO_URI);
    console.log('数据库连接成功');

    // Step 1: 为 Hotel 添加 propertyType（默认为 'hotel'）
    console.log('\n[Step 1] 为 Hotel 添加 propertyType...');
    const hotelResult = await Hotel.updateMany(
      { 'baseInfo.propertyType': { $exists: false } },
      { $set: { 'baseInfo.propertyType': 'hotel' } }
    );
    console.log(`✓ 已更新 ${hotelResult.modifiedCount} 个 Hotel 文档`);

    // Step 2: 为 Hotel 初始化 typeConfig（如果不存在）
    console.log('\n[Step 2] 为 Hotel 初始化 typeConfig...');
    const typeConfigResult = await Hotel.updateMany(
      { typeConfig: { $exists: false } },
      { $set: { typeConfig: {} } }
    );
    console.log(`✓ 已初始化 ${typeConfigResult.modifiedCount} 个 Hotel 的 typeConfig`);

    // Step 3: 为 Room 添加 category（默认为 'standard'）
    console.log('\n[Step 3] 为 Room 添加 category...');
    const roomResult = await Room.updateMany(
      { 'baseInfo.category': { $exists: false } },
      { $set: { 'baseInfo.category': 'standard' } }
    );
    console.log(`✓ 已更新 ${roomResult.modifiedCount} 个 Room 文档`);

    // Step 4: 为 Room 初始化 typeConfig
    console.log('\n[Step 4] 为 Room 初始化 typeConfig...');
    const roomTypeConfigResult = await Room.updateMany(
      { typeConfig: { $exists: false } },
      {
        $set: {
          typeConfig: {
            standard: {
              cancellationDeadlineHours: 24,
              extensionAllowed: true,
            },
          },
        },
      }
    );
    console.log(`✓ 已初始化 ${roomTypeConfigResult.modifiedCount} 个 Room 的 typeConfig`);

    console.log('\n✓ 迁移完成！');
    console.log('\n迁移摘要：');
    console.log(`  - 更新的 Hotel: ${hotelResult.modifiedCount}`);
    console.log(`  - 初始化的 Hotel typeConfig: ${typeConfigResult.modifiedCount}`);
    console.log(`  - 更新的 Room: ${roomResult.modifiedCount}`);
    console.log(`  - 初始化的 Room typeConfig: ${roomTypeConfigResult.modifiedCount}`);

    await mongoose.disconnect();
    console.log('\n数据库连接已关闭');
  } catch (err) {
    console.error('❌ 迁移失败:', err);
    process.exit(1);
  }
}

// 运行迁移
migrate();
