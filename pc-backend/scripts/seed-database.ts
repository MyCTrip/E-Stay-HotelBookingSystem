import mongoose from 'mongoose';
import { User } from '../src/modules/user/user.model';
import { AdminProfile } from '../src/modules/admin/admin.model';
import { Merchant } from '../src/modules/merchant/merchant.model';
import { Hotel } from '../src/modules/hotel/hotel.model';
import { Room } from '../src/modules/room/room.model';
import { AuditLog } from '../src/modules/audit/audit.model';
  import { Notification } from '../src/modules/notification/notification.model';
import * as bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/estay-hotel';

async function seedDatabase() {
  try {
    console.log('连接数据库...');
    await mongoose.connect(MONGODB_URI);
    console.log('数据库连接成功');

    console.log('\n清理现有数据...');
    await User.deleteMany({});
    await AdminProfile.deleteMany({});
    await Merchant.deleteMany({});
    await Hotel.deleteMany({});
    await Room.deleteMany({});
    await AuditLog.deleteMany({});
    await Notification.deleteMany({});
    console.log('数据清理完成');

    const hashedPassword = await bcrypt.hash('password123', 10);

    console.log('\n========== 创建管理员 ==========');
    const adminUser = await User.create({
      email: 'admin@estay.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
    });
    console.log('管理员用户创建成功:', adminUser.email);

    const adminProfile = await AdminProfile.create({
      userId: adminUser._id,
      baseInfo: {
        name: '系统管理员',
        employeeNo: 'ADMIN001',
      },
    });
    console.log('管理员资料创建成功:', adminProfile.baseInfo.name);

    console.log('\n========== 创建商户1 ==========');
    const merchant1User = await User.create({
      email: 'merchant1@estay.com',
      password: hashedPassword,
      role: 'merchant',
      status: 'active',
    });
    console.log('商户1用户创建成功:', merchant1User.email);

    const merchant1 = await Merchant.create({
      userId: merchant1User._id,
      baseInfo: {
        merchantName: '北京悦达酒店管理有限公司',
        contactName: '张经理',
        contactPhone: '13800138001',
        contactEmail: 'zhang@yueda.com',
      },
      qualificationInfo: {
        businessLicenseNo: '91110000123456789X',
        idCardNo: '110101198001011234',
        realNameStatus: 'verified',
      },
      auditInfo: {
        verifyStatus: 'verified',
      },
    });
    console.log('商户1资料创建成功:', merchant1.baseInfo.merchantName);

    console.log('\n========== 创建商户2 ==========');
    const merchant2User = await User.create({
      email: 'merchant2@estay.com',
      password: hashedPassword,
      role: 'merchant',
      status: 'active',
    });
    console.log('商户2用户创建成功:', merchant2User.email);

    const merchant2 = await Merchant.create({
      userId: merchant2User._id,
      baseInfo: {
        merchantName: '上海豪华酒店集团',
        contactName: '李总监',
        contactPhone: '13900139001',
        contactEmail: 'li@luxury.com',
      },
      qualificationInfo: {
        businessLicenseNo: '91310000987654321Y',
        idCardNo: '310101198502025678',
        realNameStatus: 'verified',
      },
      auditInfo: {
        verifyStatus: 'verified',
      },
    });
    console.log('商户2资料创建成功:', merchant2.baseInfo.merchantName);

    console.log('\n========== 创建酒店1（商户1） ==========');
    const hotel1 = await Hotel.create({
      merchantId: merchant1._id,
      baseInfo: {
        nameCn: '金茂大酒店',
        nameEn: 'Jinmao Grand Hotel',
        address: '北京市朝阳区建国路88号',
        city: '北京',
        star: 5,
        openTime: '2008-06-01',
        roomTotal: 300,
        phone: '010-88888888',
        description: '金茂大酒店位于朝阳区建国路，交通便利，设施齐全，是商务出行和旅游度假的理想选择。酒店拥有豪华客房和套房，配备现代化设施，提供优质服务。',
        images: [
          'https://example.com/hotel1-1.jpg',
          'https://example.com/hotel1-2.jpg',
          'https://example.com/hotel1-3.jpg',
        ],
        facilities: [
          {
            category: '基础设施',
            content: '<p>免费停车<br/>免费WiFi<br/>健身中心<br/>洗衣服务<br/>会议室<br/>商务中心<br/>叫车服务<br/>行李寄存</p>',
            summary: '免费停车、免费WiFi、健身中心',
            icon: 'basic',
            order: 1,
            visible: true,
          },
          {
            category: '餐饮设施',
            content: '<p>中餐厅<br/>西餐厅<br/>咖啡厅<br/>24小时送餐服务</p>',
            summary: '中餐厅、西餐厅、咖啡厅',
            icon: 'restaurant',
            order: 2,
            visible: true,
          },
          {
            category: '商务设施',
            content: '<p>会议室<br/>商务中心<br/>打印复印<br/>高速WiFi</p>',
            summary: '会议室、商务中心',
            icon: 'business',
            order: 3,
            visible: true,
          },
        ],
        policies: [
          {
            policyType: '订房必读',
            content: '<p><strong>入住时间：</strong>14:00以后</p><p><strong>退房时间：</strong>12:00以前</p><p><strong>入住凭证：</strong>需提供有效身份证件</p><p><strong>宠物政策：</strong>不可携带宠物</p><p><strong>加床政策：</strong>部分房型可加床，详情咨询酒店</p><p><strong>吸烟政策：</strong>部分房型为无烟房</p><p><strong>押金政策：</strong>入住时需支付押金，退房时退还</p>',
            summary: '入住时间14:00后，退房时间12:00前',
          },
          {
            policyType: '取消政策',
            content: '<p>入住前24小时免费取消，24小时内取消收取首晚房费。</p>',
            summary: '24小时前免费取消',
          },
          {
            policyType: '儿童政策',
            content: '<p>12岁以下儿童可随成人入住，不占床位免费</p><p>12岁以上儿童需按成人标准收费</p>',
            summary: '12岁以下儿童免费',
          },
          {
            policyType: '支付方式',
            content: '<p>支持支付宝、微信支付、银联卡、VISA、MasterCard等支付方式</p>',
            summary: '支持多种支付方式',
          },
        ],
        surroundings: [
          {
            surType: 'metro',
            surName: '国贸地铁站',
            distance: 500,
          },
          {
            surType: 'business',
            surName: '国贸CBD',
            distance: 800,
          },
        ],
        discounts: [
          {
            title: '早鸟优惠',
            type: 'discount',
            content: '提前7天预订享8折优惠',
          },
        ],
      },
      checkinInfo: {
        checkinTime: '14:00',
        checkoutTime: '12:00',
        breakfastType: '自助早餐',
        breakfastPrice: 68,
      },
      auditInfo: {
        status: 'approved',
        auditedBy: adminProfile._id,
        auditedAt: new Date(),
      },
    });
    console.log('酒店1创建成功:', hotel1.baseInfo.nameCn);

    await AuditLog.create({
      targetType: 'hotel',
      targetId: hotel1._id,
      action: 'submit',
      operatorId: adminProfile._id,
      reason: '商户提交酒店审核',
    });

    await AuditLog.create({
      targetType: 'hotel',
      targetId: hotel1._id,
      action: 'approve',
      operatorId: adminProfile._id,
      reason: '审核通过',
    });

    console.log('\n========== 创建酒店2（商户1，待审核） ==========');
    const hotel2 = await Hotel.create({
      merchantId: merchant1._id,
      baseInfo: {
        nameCn: '北京悦达商务酒店',
        nameEn: 'Beijing Yueda Business Hotel',
        address: '北京市海淀区中关村大街100号',
        city: '北京',
        star: 4,
        openTime: '2015-03-01',
        roomTotal: 150,
        phone: '010-66666666',
        description: '北京悦达商务酒店位于中关村核心区域，紧邻各大高校和科技企业。酒店专为商务人士设计，提供全方位的商务设施和服务。',
        images: [
          'https://example.com/hotel2-1.jpg',
          'https://example.com/hotel2-2.jpg',
        ],
        facilities: [
          {
            category: '基础设施',
            content: '<p>免费WiFi<br/>健身中心<br/>洗衣服务<br/>行李寄存<br/>叫车服务</p>',
            summary: '免费WiFi、健身中心、洗衣服务',
            icon: 'basic',
            order: 1,
          },
          {
            category: '商务设施',
            content: '<p>会议室<br/>商务中心<br/>打印复印<br/>高速WiFi<br/>投影设备</p>',
            summary: '会议室、商务中心、高速WiFi',
            icon: 'business',
            order: 2,
          },
          {
            category: '餐饮设施',
            content: '<p>商务餐厅<br/>咖啡厅<br/>24小时送餐服务</p>',
            summary: '商务餐厅、咖啡厅',
            icon: 'restaurant',
            order: 3,
          },
        ],
        policies: [
          {
            policyType: '订房必读',
            content: '<p><strong>入住时间：</strong>14:00以后</p><p><strong>退房时间：</strong>12:00以前</p><p><strong>入住凭证：</strong>需提供有效身份证件</p><p><strong>宠物政策：</strong>不可携带宠物</p><p><strong>加床政策：</strong>部分房型可加床，详情咨询酒店</p><p><strong>吸烟政策：</strong>部分房型为无烟房</p><p><strong>押金政策：</strong>入住时需支付押金，退房时退还</p>',
            summary: '入住时间14:00后，退房时间12:00前',
          },
          {
            policyType: '取消政策',
            content: '<p>入住前24小时免费取消，24小时内取消收取首晚房费。</p>',
            summary: '24小时前免费取消',
          },
        ],
      },
      checkinInfo: {
        checkinTime: '14:00',
        checkoutTime: '12:00',
      },
      auditInfo: {
        status: 'pending',
      },
    });
    console.log('酒店2创建成功（待审核）:', hotel2.baseInfo.nameCn);

    await AuditLog.create({
      targetType: 'hotel',
      targetId: hotel2._id,
      action: 'submit',
      operatorId: adminProfile._id,
      reason: '商户提交酒店审核',
    });

    console.log('\n========== 创建酒店3（商户2） ==========');
    const hotel3 = await Hotel.create({
      merchantId: merchant2._id,
      baseInfo: {
        nameCn: '上海豪华大酒店',
        nameEn: 'Shanghai Luxury Grand Hotel',
        address: '上海市黄浦区南京东路100号',
        city: '上海',
        star: 5,
        openTime: '2010-09-01',
        roomTotal: 400,
        phone: '021-88888888',
        description: '上海豪华大酒店位于南京东路步行街，毗邻外滩，是体验上海风情的绝佳选择。酒店拥有豪华客房和套房，配备现代化设施，提供五星级服务。',
        images: [
          'https://example.com/hotel3-1.jpg',
          'https://example.com/hotel3-2.jpg',
          'https://example.com/hotel3-3.jpg',
        ],
        facilities: [
          {
            category: '基础设施',
            content: '<p>免费停车<br/>免费WiFi<br/>健身中心<br/>室内游泳池<br/>SPA<br/>洗衣服务<br/>行李寄存<br/>叫车服务</p>',
            summary: '免费停车、免费WiFi、健身中心、游泳池',
            icon: 'basic',
            order: 1,
          },
          {
            category: '餐饮设施',
            content: '<p>米其林星级餐厅<br/>中餐厅<br/>西餐厅<br/>咖啡厅<br/>酒吧<br/>24小时送餐服务</p>',
            summary: '米其林星级餐厅、中餐厅、西餐厅',
            icon: 'restaurant',
            order: 2,
          },
          {
            category: '休闲娱乐',
            content: '<p>健身中心<br/>室内游泳池<br/>SPA<br/>桑拿<br/>按摩服务</p>',
            summary: '健身房、游泳池、SPA',
            icon: 'leisure',
            order: 3,
          },
        ],
        policies: [
          {
            policyType: '订房必读',
            content: '<p><strong>入住时间：</strong>15:00以后</p><p><strong>退房时间：</strong>11:00以前</p><p><strong>入住凭证：</strong>需提供有效身份证件</p><p><strong>宠物政策：</strong>不可携带宠物</p><p><strong>加床政策：</strong>部分房型可加床，详情咨询酒店</p><p><strong>吸烟政策：</strong>部分房型为无烟房</p><p><strong>押金政策：</strong>入住时需支付押金，退房时退还</p>',
            summary: '入住时间15:00后，退房时间11:00前',
          },
          {
            policyType: '取消政策',
            content: '<p>入住前48小时免费取消，48小时内取消收取首晚房费。</p>',
            summary: '48小时前免费取消',
          },
          {
            policyType: '儿童政策',
            content: '<p>12岁以下儿童可随成人入住，不占床位免费</p><p>12岁以上儿童需按成人标准收费</p>',
            summary: '12岁以下儿童免费',
          },
        ],
        surroundings: [
          {
            surType: 'metro',
            surName: '南京东路地铁站',
            distance: 200,
          },
          {
            surType: 'attraction',
            surName: '外滩',
            distance: 500,
          },
        ],
      },
      checkinInfo: {
        checkinTime: '15:00',
        checkoutTime: '11:00',
        breakfastType: '自助早餐',
        breakfastPrice: 88,
      },
      auditInfo: {
        status: 'approved',
        auditedBy: adminProfile._id,
        auditedAt: new Date(),
      },
    });
    console.log('酒店3创建成功:', hotel3.baseInfo.nameCn);

    await AuditLog.create({
      targetType: 'hotel',
      targetId: hotel3._id,
      action: 'submit',
      operatorId: adminProfile._id,
      reason: '商户提交酒店审核',
    });

    await AuditLog.create({
      targetType: 'hotel',
      targetId: hotel3._id,
      action: 'approve',
      operatorId: adminProfile._id,
      reason: '审核通过',
    });

    console.log('\n========== 创建酒店4（商户2） ==========');
    const hotel4 = await Hotel.create({
      merchantId: merchant2._id,
      baseInfo: {
        nameCn: '上海浦东香格里拉大酒店',
        nameEn: 'Shanghai Pudong Shangri-La Hotel',
        address: '上海市浦东新区富城路33号',
        city: '上海',
        star: 5,
        openTime: '1998-08-01',
        roomTotal: 950,
        phone: '021-68828888',
        description: '上海浦东香格里拉大酒店位于陆家嘴金融中心，俯瞰黄浦江和外滩美景。酒店拥有豪华客房和套房，配备世界级设施，提供卓越的服务体验。',
        images: [
          'https://example.com/hotel4-1.jpg',
          'https://example.com/hotel4-2.jpg',
          'https://example.com/hotel4-3.jpg',
        ],
        facilities: [
          {
            category: '基础设施',
            content: '<p>免费停车<br/>免费WiFi<br/>健身中心<br/>室内游泳池<br/>SPA<br/>洗衣服务<br/>行李寄存<br/>叫车服务<br/>商务中心</p>',
            summary: '免费停车、免费WiFi、健身中心、游泳池',
            icon: 'basic',
            order: 1,
          },
          {
            category: '餐饮设施',
            content: '<p>米其林星级餐厅<br/>中餐厅<br/>西餐厅<br/>日餐厅<br/>咖啡厅<br/>酒吧<br/>24小时送餐服务</p>',
            summary: '米其林星级餐厅、中餐厅、西餐厅、日餐厅',
            icon: 'restaurant',
            order: 2,
          },
          {
            category: '休闲娱乐',
            content: '<p>健身中心<br/>室内游泳池<br/>SPA<br/>桑拿<br/>按摩服务<br/>网球场</p>',
            summary: '健身房、游泳池、SPA、网球场',
            icon: 'leisure',
            order: 3,
          },
        ],
        policies: [
          {
            policyType: '订房必读',
            content: '<p><strong>入住时间：</strong>14:00以后</p><p><strong>退房时间：</strong>12:00以前</p><p><strong>入住凭证：</strong>需提供有效身份证件</p><p><strong>宠物政策：</strong>不可携带宠物</p><p><strong>加床政策：</strong>部分房型可加床，详情咨询酒店</p><p><strong>吸烟政策：</strong>部分房型为无烟房</p><p><strong>押金政策：</strong>入住时需支付押金，退房时退还</p>',
            summary: '入住时间14:00后，退房时间12:00前',
          },
          {
            policyType: '取消政策',
            content: '<p>入住前48小时免费取消，48小时内取消收取首晚房费。</p>',
            summary: '48小时前免费取消',
          },
          {
            policyType: '儿童政策',
            content: '<p>12岁以下儿童可随成人入住，不占床位免费</p><p>12岁以上儿童需按成人标准收费</p>',
            summary: '12岁以下儿童免费',
          },
        ],
        surroundings: [
          {
            surType: 'metro',
            surName: '陆家嘴地铁站',
            distance: 300,
          },
          {
            surType: 'attraction',
            surName: '东方明珠',
            distance: 500,
          },
        ],
      },
      checkinInfo: {
        checkinTime: '14:00',
        checkoutTime: '12:00',
        breakfastType: '自助早餐',
        breakfastPrice: 128,
      },
      auditInfo: {
        status: 'approved',
        auditedBy: adminProfile._id,
        auditedAt: new Date(),
      },
    });
    console.log('酒店4创建成功:', hotel4.baseInfo.nameCn);

    await AuditLog.create({
      targetType: 'hotel',
      targetId: hotel4._id,
      action: 'submit',
      operatorId: adminProfile._id,
      reason: '商户提交酒店审核',
    });

    await AuditLog.create({
      targetType: 'hotel',
      targetId: hotel4._id,
      action: 'approve',
      operatorId: adminProfile._id,
      reason: '审核通过',
    });

    console.log('\n========== 创建酒店5（商户1） ==========');
    const hotel5 = await Hotel.create({
      merchantId: merchant1._id,
      baseInfo: {
        nameCn: '北京国贸大酒店',
        nameEn: 'Beijing China World Hotel',
        address: '北京市朝阳区建国门外大街1号',
        city: '北京',
        star: 5,
        openTime: '1990-10-01',
        roomTotal: 740,
        phone: '010-65052299',
        description: '北京国贸大酒店位于CBD核心区，与国贸商城相连，交通便利。酒店拥有豪华客房和套房，配备现代化设施，是商务和休闲的理想选择。',
        images: [
          'https://example.com/hotel5-1.jpg',
          'https://example.com/hotel5-2.jpg',
          'https://example.com/hotel5-3.jpg',
        ],
        facilities: [
          {
            category: '基础设施',
            content: '<p>免费停车<br/>免费WiFi<br/>健身中心<br/>室内游泳池<br/>SPA<br/>洗衣服务<br/>行李寄存<br/>叫车服务</p>',
            summary: '免费停车、免费WiFi、健身中心、游泳池',
            icon: 'basic',
            order: 1,
          },
          {
            category: '餐饮设施',
            content: '<p>中餐厅<br/>西餐厅<br/>日餐厅<br/>咖啡厅<br/>酒吧<br/>24小时送餐服务</p>',
            summary: '中餐厅、西餐厅、日餐厅、咖啡厅',
            icon: 'restaurant',
            order: 2,
          },
          {
            category: '商务设施',
            content: '<p>会议室<br/>商务中心<br/>打印复印<br/>高速WiFi<br/>投影设备</p>',
            summary: '会议室、商务中心、高速WiFi',
            icon: 'business',
            order: 3,
          },
        ],
        policies: [
          {
            policyType: '订房必读',
            content: '<p><strong>入住时间：</strong>14:00以后</p><p><strong>退房时间：</strong>12:00以前</p><p><strong>入住凭证：</strong>需提供有效身份证件</p><p><strong>宠物政策：</strong>不可携带宠物</p><p><strong>加床政策：</strong>部分房型可加床，详情咨询酒店</p><p><strong>吸烟政策：</strong>部分房型为无烟房</p><p><strong>押金政策：</strong>入住时需支付押金，退房时退还</p>',
            summary: '入住时间14:00后，退房时间12:00前',
          },
          {
            policyType: '取消政策',
            content: '<p>入住前24小时免费取消，24小时内取消收取首晚房费。</p>',
            summary: '24小时前免费取消',
          },
          {
            policyType: '儿童政策',
            content: '<p>12岁以下儿童可随成人入住，不占床位免费</p><p>12岁以上儿童需按成人标准收费</p>',
            summary: '12岁以下儿童免费',
          },
        ],
        surroundings: [
          {
            surType: 'metro',
            surName: '国贸地铁站',
            distance: 100,
          },
          {
            surType: 'business',
            surName: '国贸CBD',
            distance: 50,
          },
        ],
      },
      checkinInfo: {
        checkinTime: '14:00',
        checkoutTime: '12:00',
        breakfastType: '自助早餐',
        breakfastPrice: 98,
      },
      auditInfo: {
        status: 'approved',
        auditedBy: adminProfile._id,
        auditedAt: new Date(),
      },
    });
    console.log('酒店5创建成功:', hotel5.baseInfo.nameCn);

    await AuditLog.create({
      targetType: 'hotel',
      targetId: hotel5._id,
      action: 'submit',
      operatorId: adminProfile._id,
      reason: '商户提交酒店审核',
    });

    await AuditLog.create({
      targetType: 'hotel',
      targetId: hotel5._id,
      action: 'approve',
      operatorId: adminProfile._id,
      reason: '审核通过',
    });

    console.log('\n========== 创建房型（酒店1） ==========');
    const room1 = await Room.create({
      hotelId: hotel1._id,
      baseInfo: {
        type: '高级大床房',
        price: 1413,
        images: [
          'https://example.com/room1-1.jpg',
          'https://example.com/room1-2.jpg',
        ],
        status: 'approved',
        maxOccupancy: 2,
        facilities: [
          {
            category: '浴室设施',
            content: '<p>独立卫浴<br/>24小时热水<br/>吹风机<br/>免费洗漱用品<br/>浴缸</p>',
            summary: '独立卫浴、24小时热水、浴缸',
            icon: 'bathroom',
            order: 1,
          },
          {
            category: '客房设施',
            content: '<p>空调<br/>电视<br/>迷你吧<br/>保险箱<br/>书桌<br/>衣柜<br/>熨斗<br/>电热水壶</p>',
            summary: '空调、电视、迷你吧、保险箱',
            icon: 'room',
            order: 2,
          },
          {
            category: '床品设施',
            content: '<p>1.8米大床<br/>高级床垫<br/>纯棉床品<br/>鸭绒被</p>',
            summary: '1.8米大床、高级床垫',
            icon: 'bed',
            order: 3,
          },
          {
            category: '其他设施',
            content: '<p>免费WiFi<br/>有线网络<br/>市内电话<br/>收费长途电话</p>',
            summary: '免费WiFi、有线网络',
            icon: 'other',
            order: 4,
          },
        ],
        policies: [
          {
            policyType: '订房必读',
            content: '<p><strong>入住时间：</strong>14:00以后</p><p><strong>退房时间：</strong>12:00以前</p><p><strong>入住凭证：</strong>需提供有效身份证件</p><p><strong>宠物政策：</strong>不可携带宠物</p><p><strong>加床政策：</strong>不可加床</p><p><strong>吸烟政策：</strong>无烟房</p><p><strong>押金政策：</strong>入住时需支付押金，退房时退还</p>',
            summary: '入住时间14:00后，退房时间12:00前',
          },
          {
            policyType: '取消政策',
            content: '<p>入住前24小时免费取消，24小时内取消收取首晚房费。</p>',
            summary: '24小时前免费取消',
          },
        ],
        bedRemark: ['1.8米大床', '65寸有线电视', '小冰箱'],
      },
      headInfo: {
        size: '45平方米',
        floor: '6-15层',
        wifi: true,
        windowAvailable: true,
        smokingAllowed: false,
      },
      bedInfo: [
        {
          bedType: '大床',
          bedNumber: 1,
          bedSize: '1.8m x 2.0m',
        },
      ],
      breakfastInfo: {
        breakfastType: '含双早',
        cuisine: '中西式自助',
        bussinessTime: '06:30-10:00',
        addBreakfast: '68元/位',
      },
      auditInfo: {
        status: 'approved',
        auditedBy: adminProfile._id,
        auditedAt: new Date(),
      },
    });
    console.log('房型1创建成功:', room1.baseInfo.type);

    await AuditLog.create({
      targetType: 'room',
      targetId: room1._id,
      action: 'submit',
      operatorId: adminProfile._id,
      reason: '商户提交房型审核',
    });

    await AuditLog.create({
      targetType: 'room',
      targetId: room1._id,
      action: 'approve',
      operatorId: adminProfile._id,
      reason: '审核通过',
    });

    const room2 = await Room.create({
      hotelId: hotel1._id,
      baseInfo: {
        type: '行政套房',
        price: 2688,
        images: [
          'https://example.com/room2-1.jpg',
          'https://example.com/room2-2.jpg',
        ],
        status: 'approved',
        maxOccupancy: 3,
        facilities: [
          {
            category: '浴室设施',
            content: '<p>独立卫浴<br/>24小时热水<br/>吹风机<br/>免费洗漱用品<br/>浴缸<br/>淋浴<br/>豪华卫浴用品</p>',
            summary: '独立卫浴、24小时热水、浴缸',
            icon: 'bathroom',
            order: 1,
          },
          {
            category: '客房设施',
            content: '<p>空调<br/>电视<br/>迷你吧<br/>保险箱<br/>书桌<br/>衣柜<br/>熨斗<br/>电热水壶<br/>客厅<br/>沙发</p>',
            summary: '空调、电视、迷你吧、保险箱、客厅',
            icon: 'room',
            order: 2,
          },
          {
            category: '床品设施',
            content: '<p>2.0米特大床<br/>豪华床垫<br/>纯棉床品<br/>鸭绒被<br/>高级枕头</p>',
            summary: '2.0米特大床、豪华床垫',
            icon: 'bed',
            order: 3,
          },
          {
            category: '其他设施',
            content: '<p>免费WiFi<br/>有线网络<br/>市内电话<br/>收费长途电话<br/>行政酒廊礼遇</p>',
            summary: '免费WiFi、有线网络、行政酒廊',
            icon: 'other',
            order: 4,
          },
        ],
        policies: [
          {
            policyType: '订房必读',
            content: '<p><strong>入住时间：</strong>14:00以后</p><p><strong>退房时间：</strong>12:00以前</p><p><strong>入住凭证：</strong>需提供有效身份证件</p><p><strong>宠物政策：</strong>不可携带宠物</p><p><strong>加床政策：</strong>可加床，需额外收费</p><p><strong>吸烟政策：</strong>无烟房</p><p><strong>押金政策：</strong>入住时需支付押金，退房时退还</p><p><strong>行政礼遇：</strong>包含行政酒廊使用权、免费早餐、下午茶等</p>',
            summary: '入住时间14:00后，退房时间12:00前，含行政礼遇',
          },
          {
            policyType: '取消政策',
            content: '<p>入住前48小时免费取消，48小时内取消收取首晚房费。</p>',
            summary: '48小时前免费取消',
          },
        ],
        bedRemark: ['2.0米特大床', '豪华床垫', '羽绒被', '行政酒廊礼遇'],
      },
      headInfo: {
        size: '75平方米',
        floor: '16-20层',
        wifi: true,
        windowAvailable: true,
        smokingAllowed: false,
      },
      bedInfo: [
        {
          bedType: '特大床',
          bedNumber: 1,
          bedSize: '2.0m x 2.2m',
        },
      ],
      breakfastInfo: {
        breakfastType: '含三早',
        cuisine: '中西式自助',
        bussinessTime: '06:30-10:00',
        addBreakfast: '88元/位',
      },
      auditInfo: {
        status: 'approved',
        auditedBy: adminProfile._id,
        auditedAt: new Date(),
      },
    });
    console.log('房型2创建成功:', room2.baseInfo.type);

    await AuditLog.create({
      targetType: 'room',
      targetId: room2._id,
      action: 'submit',
      operatorId: adminProfile._id,
      reason: '商户提交房型审核',
    });

    await AuditLog.create({
      targetType: 'room',
      targetId: room2._id,
      action: 'approve',
      operatorId: adminProfile._id,
      reason: '审核通过',
    });

    const room3 = await Room.create({
      hotelId: hotel1._id,
      baseInfo: {
        type: '标准双床房',
        price: 888,
        images: [
          'https://example.com/room3-1.jpg',
        ],
        status: 'pending',
        maxOccupancy: 2,
        facilities: [
          {
            category: '浴室设施',
            content: '<p>独立卫浴<br/>24小时热水<br/>吹风机<br/>免费洗漱用品</p>',
            summary: '独立卫浴、24小时热水',
            icon: 'bathroom',
            order: 1,
          },
          {
            category: '客房设施',
            content: '<p>空调<br/>电视<br/>电热水壶<br/>书桌<br/>衣柜</p>',
            summary: '空调、电视、电热水壶',
            icon: 'room',
            order: 2,
          },
          {
            category: '床品设施',
            content: '<p>1.2米单人床x2<br/>舒适床垫<br/>纯棉床品</p>',
            summary: '1.2米单人床x2、舒适床垫',
            icon: 'bed',
            order: 3,
          },
          {
            category: '其他设施',
            content: '<p>免费WiFi<br/>有线网络<br/>市内电话</p>',
            summary: '免费WiFi、有线网络',
            icon: 'other',
            order: 4,
          },
        ],
        policies: [
          {
            policyType: '订房必读',
            content: '<p><strong>入住时间：</strong>14:00以后</p><p><strong>退房时间：</strong>12:00以前</p><p><strong>入住凭证：</strong>需提供有效身份证件</p><p><strong>宠物政策：</strong>不可携带宠物</p><p><strong>加床政策：</strong>不可加床</p><p><strong>吸烟政策：</strong>无烟房</p><p><strong>押金政策：</strong>入住时需支付押金，退房时退还</p>',
            summary: '入住时间14:00后，退房时间12:00前',
          },
          {
            policyType: '取消政策',
            content: '<p>入住前24小时免费取消，24小时内取消收取首晚房费。</p>',
            summary: '24小时前免费取消',
          },
        ],
        bedRemark: ['1.2米单人床x2', '舒适床垫'],
      },
      headInfo: {
        size: '35平方米',
        floor: '3-5层',
        wifi: true,
        windowAvailable: true,
        smokingAllowed: false,
      },
      bedInfo: [
        {
          bedType: '单人床',
          bedNumber: 2,
          bedSize: '1.2m x 2.0m',
        },
      ],
      breakfastInfo: {
        breakfastType: '不含早',
      },
      auditInfo: {
        status: 'pending',
      },
    });
    console.log('房型3创建成功（待审核）:', room3.baseInfo.type);

    await AuditLog.create({
      targetType: 'room',
      targetId: room3._id,
      action: 'submit',
      operatorId: adminProfile._id,
      reason: '商户提交房型审核',
    });

    console.log('\n========== 创建房型（酒店2） ==========');
    const room4 = await Room.create({
      hotelId: hotel2._id,
      baseInfo: {
        type: '商务大床房',
        price: 688,
        images: [
          'https://example.com/room4-1.jpg',
          'https://example.com/room4-2.jpg',
        ],
        status: 'approved',
        maxOccupancy: 2,
        facilities: [
          {
            category: '浴室设施',
            content: '<p>独立卫浴<br/>24小时热水<br/>吹风机<br/>免费洗漱用品</p>',
            summary: '独立卫浴、24小时热水',
            icon: 'bathroom',
            order: 1,
          },
          {
            category: '客房设施',
            content: '<p>空调<br/>电视<br/>书桌<br/>衣柜<br/>电热水壶<br/>商务办公椅</p>',
            summary: '空调、电视、书桌、商务办公椅',
            icon: 'room',
            order: 2,
          },
          {
            category: '床品设施',
            content: '<p>1.8米大床<br/>舒适床垫<br/>纯棉床品</p>',
            summary: '1.8米大床、舒适床垫',
            icon: 'bed',
            order: 3,
          },
          {
            category: '其他设施',
            content: '<p>免费WiFi<br/>有线网络<br/>市内电话<br/>商务印刷服务</p>',
            summary: '免费WiFi、有线网络、商务印刷',
            icon: 'other',
            order: 4,
          },
        ],
        policies: [
          {
            policyType: '订房必读',
            content: '<p><strong>入住时间：</strong>14:00以后</p><p><strong>退房时间：</strong>12:00以前</p><p><strong>入住凭证：</strong>需提供有效身份证件</p><p><strong>宠物政策：</strong>不可携带宠物</p><p><strong>加床政策：</strong>不可加床</p><p><strong>吸烟政策：</strong>无烟房</p><p><strong>押金政策：</strong>入住时需支付押金，退房时退还</p>',
            summary: '入住时间14:00后，退房时间12:00前',
          },
          {
            policyType: '取消政策',
            content: '<p>入住前24小时免费取消，24小时内取消收取首晚房费。</p>',
            summary: '24小时前免费取消',
          },
        ],
        bedRemark: ['1.8米大床', '商务办公椅', '高速WiFi'],
      },
      headInfo: {
        size: '35平方米',
        floor: '3-8层',
        wifi: true,
        windowAvailable: true,
        smokingAllowed: false,
      },
      bedInfo: [
        {
          bedType: '大床',
          bedNumber: 1,
          bedSize: '1.8m x 2.0m',
        },
      ],
      breakfastInfo: {
        breakfastType: '含双早',
        cuisine: '商务早餐',
        bussinessTime: '07:00-09:30',
        addBreakfast: '48元/位',
      },
      auditInfo: {
        status: 'approved',
        auditedBy: adminProfile._id,
        auditedAt: new Date(),
      },
    });
    console.log('房型4创建成功:', room4.baseInfo.type);

    await AuditLog.create({
      targetType: 'room',
      targetId: room4._id,
      action: 'submit',
      operatorId: adminProfile._id,
      reason: '商户提交房型审核',
    });

    await AuditLog.create({
      targetType: 'room',
      targetId: room4._id,
      action: 'approve',
      operatorId: adminProfile._id,
      reason: '审核通过',
    });

    const room5 = await Room.create({
      hotelId: hotel2._id,
      baseInfo: {
        type: '商务双床房',
        price: 588,
        images: [
          'https://example.com/room5-1.jpg',
        ],
        status: 'approved',
        maxOccupancy: 2,
        facilities: [
          {
            category: '浴室设施',
            content: '<p>独立卫浴<br/>24小时热水<br/>吹风机<br/>免费洗漱用品</p>',
            summary: '独立卫浴、24小时热水',
            icon: 'bathroom',
            order: 1,
          },
          {
            category: '客房设施',
            content: '<p>空调<br/>电视<br/>书桌<br/>衣柜<br/>电热水壶</p>',
            summary: '空调、电视、书桌',
            icon: 'room',
            order: 2,
          },
          {
            category: '床品设施',
            content: '<p>1.2米单人床x2<br/>舒适床垫<br/>纯棉床品</p>',
            summary: '1.2米单人床x2、舒适床垫',
            icon: 'bed',
            order: 3,
          },
          {
            category: '其他设施',
            content: '<p>免费WiFi<br/>有线网络<br/>市内电话</p>',
            summary: '免费WiFi、有线网络',
            icon: 'other',
            order: 4,
          },
        ],
        policies: [
          {
            policyType: '订房必读',
            content: '<p><strong>入住时间：</strong>14:00以后</p><p><strong>退房时间：</strong>12:00以前</p><p><strong>入住凭证：</strong>需提供有效身份证件</p><p><strong>宠物政策：</strong>不可携带宠物</p><p><strong>加床政策：</strong>不可加床</p><p><strong>吸烟政策：</strong>无烟房</p><p><strong>押金政策：</strong>入住时需支付押金，退房时退还</p>',
            summary: '入住时间14:00后，退房时间12:00前',
          },
          {
            policyType: '取消政策',
            content: '<p>入住前24小时免费取消，24小时内取消收取首晚房费。</p>',
            summary: '24小时前免费取消',
          },
        ],
        bedRemark: ['1.2米单人床x2', '舒适床垫', '高速WiFi'],
      },
      headInfo: {
        size: '32平方米',
        floor: '1-2层',
        wifi: true,
        windowAvailable: true,
        smokingAllowed: false,
      },
      bedInfo: [
        {
          bedType: '单人床',
          bedNumber: 2,
          bedSize: '1.2m x 2.0m',
        },
      ],
      breakfastInfo: {
        breakfastType: '含双早',
        cuisine: '商务早餐',
        bussinessTime: '07:00-09:30',
        addBreakfast: '48元/位',
      },
      auditInfo: {
        status: 'approved',
        auditedBy: adminProfile._id,
        auditedAt: new Date(),
      },
    });
    console.log('房型5创建成功:', room5.baseInfo.type);

    await AuditLog.create({
      targetType: 'room',
      targetId: room5._id,
      action: 'submit',
      operatorId: adminProfile._id,
      reason: '商户提交房型审核',
    });

    await AuditLog.create({
      targetType: 'room',
      targetId: room5._id,
      action: 'approve',
      operatorId: adminProfile._id,
      reason: '审核通过',
    });

    console.log('\n========== 创建房型（酒店3） ==========');
    const room6 = await Room.create({
      hotelId: hotel3._id,
      baseInfo: {
        type: '江景大床房',
        price: 1688,
        images: [
          'https://example.com/room6-1.jpg',
          'https://example.com/room6-2.jpg',
        ],
        status: 'approved',
        maxOccupancy: 2,
        facilities: [
          {
            category: '浴室设施',
            content: '<p>独立卫浴<br/>24小时热水<br/>吹风机<br/>免费洗漱用品<br/>浴缸<br/>淋浴<br/>豪华卫浴用品</p>',
            summary: '独立卫浴、24小时热水、浴缸',
            icon: 'bathroom',
            order: 1,
          },
          {
            category: '客房设施',
            content: '<p>空调<br/>电视<br/>迷你吧<br/>保险箱<br/>书桌<br/>衣柜<br/>熨斗<br/>电热水壶<br/>江景阳台</p>',
            summary: '空调、电视、迷你吧、保险箱、江景阳台',
            icon: 'room',
            order: 2,
          },
          {
            category: '床品设施',
            content: '<p>1.8米大床<br/>高级床垫<br/>纯棉床品<br/>鸭绒被<br/>高级枕头</p>',
            summary: '1.8米大床、高级床垫',
            icon: 'bed',
            order: 3,
          },
          {
            category: '其他设施',
            content: '<p>免费WiFi<br/>有线网络<br/>市内电话<br/>收费长途电话<br/>江景阳台</p>',
            summary: '免费WiFi、有线网络、江景阳台',
            icon: 'other',
            order: 4,
          },
        ],
        policies: [
          {
            policyType: '订房必读',
            content: '<p><strong>入住时间：</strong>15:00以后</p><p><strong>退房时间：</strong>11:00以前</p><p><strong>入住凭证：</strong>需提供有效身份证件</p><p><strong>宠物政策：</strong>不可携带宠物</p><p><strong>加床政策：</strong>不可加床</p><p><strong>吸烟政策：</strong>无烟房</p><p><strong>押金政策：</strong>入住时需支付押金，退房时退还</p><strong>江景房特色：</strong>可欣赏黄浦江美景</p>',
            summary: '入住时间15:00后，退房时间11:00前，江景房',
          },
          {
            policyType: '取消政策',
            content: '<p>入住前48小时免费取消，48小时内取消收取首晚房费。</p>',
            summary: '48小时前免费取消',
          },
        ],
        bedRemark: ['1.8米大床', '江景阳台', '浴缸', '黄浦江美景'],
      },
      headInfo: {
        size: '55平方米',
        floor: '10-18层',
        wifi: true,
        windowAvailable: true,
        smokingAllowed: false,
      },
      bedInfo: [
        {
          bedType: '大床',
          bedNumber: 1,
          bedSize: '1.8m x 2.0m',
        },
      ],
      breakfastInfo: {
        breakfastType: '含双早',
        cuisine: '中西式自助',
        bussinessTime: '06:30-10:30',
        addBreakfast: '88元/位',
      },
      auditInfo: {
        status: 'approved',
        auditedBy: adminProfile._id,
        auditedAt: new Date(),
      },
    });
    console.log('房型6创建成功:', room6.baseInfo.type);

    await AuditLog.create({
      targetType: 'room',
      targetId: room6._id,
      action: 'submit',
      operatorId: adminProfile._id,
      reason: '商户提交房型审核',
    });

    await AuditLog.create({
      targetType: 'room',
      targetId: room6._id,
      action: 'approve',
      operatorId: adminProfile._id,
      reason: '审核通过',
    });

    const room7 = await Room.create({
      hotelId: hotel3._id,
      baseInfo: {
        type: '豪华套房',
        price: 2888,
        images: [
          'https://example.com/room7-1.jpg',
          'https://example.com/room7-2.jpg',
          'https://example.com/room7-3.jpg',
        ],
        status: 'approved',
        maxOccupancy: 4,
        facilities: [
          {
            category: '浴室设施',
            content: '<p>独立卫浴<br/>24小时热水<br/>吹风机<br/>免费洗漱用品<br/>浴缸<br/>淋浴<br/>豪华卫浴用品<br/>双人洗手台</p>',
            summary: '独立卫浴、24小时热水、浴缸、双人洗手台',
            icon: 'bathroom',
            order: 1,
          },
          {
            category: '客房设施',
            content: '<p>空调<br/>电视<br/>迷你吧<br/>保险箱<br/>书桌<br/>衣柜<br/>熨斗<br/>电热水壶<br/>客厅<br/>沙发<br/>江景阳台</p>',
            summary: '空调、电视、迷你吧、保险箱、客厅、江景阳台',
            icon: 'room',
            order: 2,
          },
          {
            category: '床品设施',
            content: '<p>2.0米特大床<br/>豪华床垫<br/>纯棉床品<br/>鸭绒被<br/>高级枕头</p>',
            summary: '2.0米特大床、豪华床垫',
            icon: 'bed',
            order: 3,
          },
          {
            category: '其他设施',
            content: '<p>免费WiFi<br/>有线网络<br/>市内电话<br/>收费长途电话<br/>行政酒廊礼遇<br/>管家服务</p>',
            summary: '免费WiFi、有线网络、行政酒廊礼遇、管家服务',
            icon: 'other',
            order: 4,
          },
        ],
        policies: [
          {
            policyType: '订房必读',
            content: '<p><strong>入住时间：</strong>15:00以后</p><p><strong>退房时间：</strong>11:00以前</p><p><strong>入住凭证：</strong>需提供有效身份证件</p><p><strong>宠物政策：</strong>不可携带宠物</p><p><strong>加床政策：</strong>可加床，需额外收费</p><p><strong>吸烟政策：</strong>无烟房</p><p><strong>押金政策：</strong>入住时需支付押金，退房时退还</p><strong>豪华套房特色：</strong>全景江景、管家服务</p>',
            summary: '入住时间15:00后，退房时间11:00前，豪华套房',
          },
          {
            policyType: '取消政策',
            content: '<p>入住前72小时免费取消，72小时内取消收取首晚房费。</p>',
            summary: '72小时前免费取消',
          },
        ],
        bedRemark: ['2.0米特大床', '江景阳台', '浴缸', '客厅', '管家服务'],
      },
      headInfo: {
        size: '90平方米',
        floor: '19-25层',
        wifi: true,
        windowAvailable: true,
        smokingAllowed: false,
      },
      bedInfo: [
        {
          bedType: '特大床',
          bedNumber: 1,
          bedSize: '2.0m x 2.2m',
        },
      ],
      breakfastInfo: {
        breakfastType: '含四早',
        cuisine: '豪华自助',
        bussinessTime: '06:30-10:30',
        addBreakfast: '128元/位',
      },
      auditInfo: {
        status: 'approved',
        auditedBy: adminProfile._id,
        auditedAt: new Date(),
      },
    });
    console.log('房型7创建成功:', room7.baseInfo.type);

    await AuditLog.create({
      targetType: 'room',
      targetId: room7._id,
      action: 'submit',
      operatorId: adminProfile._id,
      reason: '商户提交房型审核',
    });

    await AuditLog.create({
      targetType: 'room',
      targetId: room7._id,
      action: 'approve',
      operatorId: adminProfile._id,
      reason: '审核通过',
    });

    const room8 = await Room.create({
      hotelId: hotel3._id,
      baseInfo: {
        type: '行政江景房',
        price: 2188,
        images: [
          'https://example.com/room8-1.jpg',
          'https://example.com/room8-2.jpg',
        ],
        status: 'approved',
        maxOccupancy: 3,
        facilities: [
          {
            category: '浴室设施',
            content: '<p>独立卫浴<br/>24小时热水<br/>吹风机<br/>免费洗漱用品<br/>浴缸<br/>淋浴<br/>豪华卫浴用品</p>',
            summary: '独立卫浴、24小时热水、浴缸',
            icon: 'bathroom',
            order: 1,
          },
          {
            category: '客房设施',
            content: '<p>空调<br/>电视<br/>迷你吧<br/>保险箱<br/>书桌<br/>衣柜<br/>熨斗<br/>电热水壶<br/>江景阳台</p>',
            summary: '空调、电视、迷你吧、保险箱、江景阳台',
            icon: 'room',
            order: 2,
          },
          {
            category: '床品设施',
            content: '<p>1.8米大床<br/>高级床垫<br/>纯棉床品<br/>鸭绒被<br/>高级枕头</p>',
            summary: '1.8米大床、高级床垫',
            icon: 'bed',
            order: 3,
          },
          {
            category: '其他设施',
            content: '<p>免费WiFi<br/>有线网络<br/>市内电话<br/>收费长途电话<br/>行政酒廊礼遇</p>',
            summary: '免费WiFi、有线网络、行政酒廊礼遇',
            icon: 'other',
            order: 4,
          },
        ],
        policies: [
          {
            policyType: '订房必读',
            content: '<p><strong>入住时间：</strong>15:00以后</p><p><strong>退房时间：</strong>11:00以前</p><p><strong>入住凭证：</strong>需提供有效身份证件</p><p><strong>宠物政策：</strong>不可携带宠物</p><p><strong>加床政策：</strong>可加床，需额外收费</p><p><strong>吸烟政策：</strong>无烟房</p><p><strong>押金政策：</strong>入住时需支付押金，退房时退还</p><strong>行政房特色：</strong>行政酒廊礼遇、优先办理入住</p>',
            summary: '入住时间15:00后，退房时间11:00前，行政房',
          },
          {
            policyType: '取消政策',
            content: '<p>入住前48小时免费取消，48小时内取消收取首晚房费。</p>',
            summary: '48小时前免费取消',
          },
        ],
        bedRemark: ['1.8米大床', '江景阳台', '浴缸', '行政酒廊礼遇'],
      },
      headInfo: {
        size: '65平方米',
        floor: '15-18层',
        wifi: true,
        windowAvailable: true,
        smokingAllowed: false,
      },
      bedInfo: [
        {
          bedType: '大床',
          bedNumber: 1,
          bedSize: '1.8m x 2.0m',
        },
      ],
      breakfastInfo: {
        breakfastType: '含三早',
        cuisine: '中西式自助',
        bussinessTime: '06:30-10:30',
        addBreakfast: '98元/位',
      },
      auditInfo: {
        status: 'approved',
        auditedBy: adminProfile._id,
        auditedAt: new Date(),
      },
    });
    console.log('房型8创建成功:', room8.baseInfo.type);

    await AuditLog.create({
      targetType: 'room',
      targetId: room8._id,
      action: 'submit',
      operatorId: adminProfile._id,
      reason: '商户提交房型审核',
    });

    await AuditLog.create({
      targetType: 'room',
      targetId: room8._id,
      action: 'approve',
      operatorId: adminProfile._id,
      reason: '审核通过',
    });

    console.log('\n========== 创建房型（酒店4） ==========');
    const room9 = await Room.create({
      hotelId: hotel4._id,
      baseInfo: {
        type: '豪华江景房',
        price: 2388,
        images: [
          'https://example.com/room9-1.jpg',
          'https://example.com/room9-2.jpg',
        ],
        status: 'approved',
        maxOccupancy: 2,
        facilities: [
          {
            category: '浴室设施',
            content: '<p>独立卫浴<br/>24小时热水<br/>吹风机<br/>免费洗漱用品<br/>浴缸<br/>淋浴<br/>豪华卫浴用品</p>',
            summary: '独立卫浴、24小时热水、浴缸',
            icon: 'bathroom',
            order: 1,
          },
          {
            category: '客房设施',
            content: '<p>空调<br/>电视<br/>迷你吧<br/>保险箱<br/>书桌<br/>衣柜<br/>熨斗<br/>电热水壶<br/>江景阳台</p>',
            summary: '空调、电视、迷你吧、保险箱、江景阳台',
            icon: 'room',
            order: 2,
          },
          {
            category: '床品设施',
            content: '<p>1.8米大床<br/>豪华床垫<br/>纯棉床品<br/>鸭绒被<br/>高级枕头</p>',
            summary: '1.8米大床、豪华床垫',
            icon: 'bed',
            order: 3,
          },
          {
            category: '其他设施',
            content: '<p>免费WiFi<br/>有线网络<br/>市内电话<br/>收费长途电话<br/>行政酒廊礼遇</p>',
            summary: '免费WiFi、有线网络、行政酒廊礼遇',
            icon: 'other',
            order: 4,
          },
        ],
        policies: [
          {
            policyType: '订房必读',
            content: '<p><strong>入住时间：</strong>14:00以后</p><p><strong>退房时间：</strong>12:00以前</p><p><strong>入住凭证：</strong>需提供有效身份证件</p><p><strong>宠物政策：</strong>不可携带宠物</p><p><strong>加床政策：</strong>不可加床</p><p><strong>吸烟政策：</strong>无烟房</p><p><strong>押金政策：</strong>入住时需支付押金，退房时退还</p>',
            summary: '入住时间14:00后，退房时间12:00前',
          },
          {
            policyType: '取消政策',
            content: '<p>入住前48小时免费取消，48小时内取消收取首晚房费。</p>',
            summary: '48小时前免费取消',
          },
        ],
        bedRemark: ['1.8米大床', '江景阳台', '浴缸', '行政酒廊礼遇'],
      },
      headInfo: {
        size: '60平方米',
        floor: '15-25层',
        wifi: true,
        windowAvailable: true,
        smokingAllowed: false,
      },
      bedInfo: [
        {
          bedType: '大床',
          bedNumber: 1,
          bedSize: '1.8m x 2.0m',
        },
      ],
      breakfastInfo: {
        breakfastType: '含双早',
        cuisine: '豪华自助',
        bussinessTime: '06:30-10:30',
        addBreakfast: '128元/位',
      },
      auditInfo: {
        status: 'approved',
        auditedBy: adminProfile._id,
        auditedAt: new Date(),
      },
    });
    console.log('房型9创建成功:', room9.baseInfo.type);

    await AuditLog.create({
      targetType: 'room',
      targetId: room9._id,
      action: 'submit',
      operatorId: adminProfile._id,
      reason: '商户提交房型审核',
    });

    await AuditLog.create({
      targetType: 'room',
      targetId: room9._id,
      action: 'approve',
      operatorId: adminProfile._id,
      reason: '审核通过',
    });

    const room10 = await Room.create({
      hotelId: hotel4._id,
      baseInfo: {
        type: '行政套房',
        price: 3688,
        images: [
          'https://example.com/room10-1.jpg',
          'https://example.com/room10-2.jpg',
          'https://example.com/room10-3.jpg',
        ],
        status: 'approved',
        maxOccupancy: 4,
        facilities: [
          {
            category: '浴室设施',
            content: '<p>独立卫浴<br/>24小时热水<br/>吹风机<br/>免费洗漱用品<br/>浴缸<br/>淋浴<br/>豪华卫浴用品<br/>双人洗手台</p>',
            summary: '独立卫浴、24小时热水、浴缸、双人洗手台',
            icon: 'bathroom',
            order: 1,
          },
          {
            category: '客房设施',
            content: '<p>空调<br/>电视<br/>迷你吧<br/>保险箱<br/>书桌<br/>衣柜<br/>熨斗<br/>电热水壶<br/>客厅<br/>沙发<br/>江景阳台</p>',
            summary: '空调、电视、迷你吧、保险箱、客厅、江景阳台',
            icon: 'room',
            order: 2,
          },
          {
            category: '床品设施',
            content: '<p>2.0米特大床<br/>豪华床垫<br/>纯棉床品<br/>鸭绒被<br/>高级枕头</p>',
            summary: '2.0米特大床、豪华床垫',
            icon: 'bed',
            order: 3,
          },
          {
            category: '其他设施',
            content: '<p>免费WiFi<br/>有线网络<br/>市内电话<br/>收费长途电话<br/>行政酒廊礼遇<br/>管家服务</p>',
            summary: '免费WiFi、有线网络、行政酒廊礼遇、管家服务',
            icon: 'other',
            order: 4,
          },
        ],
        policies: [
          {
            policyType: '订房必读',
            content: '<p><strong>入住时间：</strong>14:00以后</p><p><strong>退房时间：</strong>12:00以前</p><p><strong>入住凭证：</strong>需提供有效身份证件</p><p><strong>宠物政策：</strong>不可携带宠物</p><p><strong>加床政策：</strong>可加床，需额外收费</p><p><strong>吸烟政策：</strong>无烟房</p><p><strong>押金政策：</strong>入住时需支付押金，退房时退还</p>',
            summary: '入住时间14:00后，退房时间12:00前',
          },
          {
            policyType: '取消政策',
            content: '<p>入住前72小时免费取消，72小时内取消收取首晚房费。</p>',
            summary: '72小时前免费取消',
          },
        ],
        bedRemark: ['2.0米特大床', '江景阳台', '浴缸', '客厅', '管家服务'],
      },
      headInfo: {
        size: '100平方米',
        floor: '26-30层',
        wifi: true,
        windowAvailable: true,
        smokingAllowed: false,
      },
      bedInfo: [
        {
          bedType: '特大床',
          bedNumber: 1,
          bedSize: '2.0m x 2.2m',
        },
      ],
      breakfastInfo: {
        breakfastType: '含四早',
        cuisine: '豪华自助',
        bussinessTime: '06:30-10:30',
        addBreakfast: '158元/位',
      },
      auditInfo: {
        status: 'approved',
        auditedBy: adminProfile._id,
        auditedAt: new Date(),
      },
    });
    console.log('房型10创建成功:', room10.baseInfo.type);

    await AuditLog.create({
      targetType: 'room',
      targetId: room10._id,
      action: 'submit',
      operatorId: adminProfile._id,
      reason: '商户提交房型审核',
    });

    await AuditLog.create({
      targetType: 'room',
      targetId: room10._id,
      action: 'approve',
      operatorId: adminProfile._id,
      reason: '审核通过',
    });

    console.log('\n========== 创建房型（酒店5） ==========');
    const room11 = await Room.create({
      hotelId: hotel5._id,
      baseInfo: {
        type: '豪华大床房',
        price: 1888,
        images: [
          'https://example.com/room11-1.jpg',
          'https://example.com/room11-2.jpg',
        ],
        status: 'approved',
        maxOccupancy: 2,
        facilities: [
          {
            category: '浴室设施',
            content: '<p>独立卫浴<br/>24小时热水<br/>吹风机<br/>免费洗漱用品<br/>浴缸<br/>淋浴<br/>豪华卫浴用品</p>',
            summary: '独立卫浴、24小时热水、浴缸',
            icon: 'bathroom',
            order: 1,
          },
          {
            category: '客房设施',
            content: '<p>空调<br/>电视<br/>迷你吧<br/>保险箱<br/>书桌<br/>衣柜<br/>熨斗<br/>电热水壶</p>',
            summary: '空调、电视、迷你吧、保险箱',
            icon: 'room',
            order: 2,
          },
          {
            category: '床品设施',
            content: '<p>1.8米大床<br/>高级床垫<br/>纯棉床品<br/>鸭绒被<br/>高级枕头</p>',
            summary: '1.8米大床、高级床垫',
            icon: 'bed',
            order: 3,
          },
          {
            category: '其他设施',
            content: '<p>免费WiFi<br/>有线网络<br/>市内电话<br/>收费长途电话</p>',
            summary: '免费WiFi、有线网络',
            icon: 'other',
            order: 4,
          },
        ],
        policies: [
          {
            policyType: '订房必读',
            content: '<p><strong>入住时间：</strong>14:00以后</p><p><strong>退房时间：</strong>12:00以前</p><p><strong>入住凭证：</strong>需提供有效身份证件</p><p><strong>宠物政策：</strong>不可携带宠物</p><p><strong>加床政策：</strong>不可加床</p><p><strong>吸烟政策：</strong>无烟房</p><p><strong>押金政策：</strong>入住时需支付押金，退房时退还</p>',
            summary: '入住时间14:00后，退房时间12:00前',
          },
          {
            policyType: '取消政策',
            content: '<p>入住前24小时免费取消，24小时内取消收取首晚房费。</p>',
            summary: '24小时前免费取消',
          },
        ],
        bedRemark: ['1.8米大床', '高级床垫', '豪华卫浴用品'],
      },
      headInfo: {
        size: '50平方米',
        floor: '10-20层',
        wifi: true,
        windowAvailable: true,
        smokingAllowed: false,
      },
      bedInfo: [
        {
          bedType: '大床',
          bedNumber: 1,
          bedSize: '1.8m x 2.0m',
        },
      ],
      breakfastInfo: {
        breakfastType: '含双早',
        cuisine: '中西式自助',
        bussinessTime: '06:30-10:00',
        addBreakfast: '98元/位',
      },
      auditInfo: {
        status: 'approved',
        auditedBy: adminProfile._id,
        auditedAt: new Date(),
      },
    });
    console.log('房型11创建成功:', room11.baseInfo.type);

    await AuditLog.create({
      targetType: 'room',
      targetId: room11._id,
      action: 'submit',
      operatorId: adminProfile._id,
      reason: '商户提交房型审核',
    });

    await AuditLog.create({
      targetType: 'room',
      targetId: room11._id,
      action: 'approve',
      operatorId: adminProfile._id,
      reason: '审核通过',
    });

    const room12 = await Room.create({
      hotelId: hotel5._id,
      baseInfo: {
        type: '商务双床房',
        price: 1588,
        images: [
          'https://example.com/room12-1.jpg',
        ],
        status: 'approved',
        maxOccupancy: 2,
        facilities: [
          {
            category: '浴室设施',
            content: '<p>独立卫浴<br/>24小时热水<br/>吹风机<br/>免费洗漱用品<br/>淋浴</p>',
            summary: '独立卫浴、24小时热水',
            icon: 'bathroom',
            order: 1,
          },
          {
            category: '客房设施',
            content: '<p>空调<br/>电视<br/>书桌<br/>衣柜<br/>电热水壶<br/>商务办公椅</p>',
            summary: '空调、电视、书桌、商务办公椅',
            icon: 'room',
            order: 2,
          },
          {
            category: '床品设施',
            content: '<p>1.2米单人床x2<br/>舒适床垫<br/>纯棉床品</p>',
            summary: '1.2米单人床x2、舒适床垫',
            icon: 'bed',
            order: 3,
          },
          {
            category: '其他设施',
            content: '<p>免费WiFi<br/>有线网络<br/>市内电话<br/>商务印刷服务</p>',
            summary: '免费WiFi、有线网络、商务印刷',
            icon: 'other',
            order: 4,
          },
        ],
        policies: [
          {
            policyType: '订房必读',
            content: '<p><strong>入住时间：</strong>14:00以后</p><p><strong>退房时间：</strong>12:00以前</p><p><strong>入住凭证：</strong>需提供有效身份证件</p><p><strong>宠物政策：</strong>不可携带宠物</p><p><strong>加床政策：</strong>不可加床</p><p><strong>吸烟政策：</strong>无烟房</p><p><strong>押金政策：</strong>入住时需支付押金，退房时退还</p>',
            summary: '入住时间14:00后，退房时间12:00前',
          },
          {
            policyType: '取消政策',
            content: '<p>入住前24小时免费取消，24小时内取消收取首晚房费。</p>',
            summary: '24小时前免费取消',
          },
        ],
        bedRemark: ['1.2米单人床x2', '商务办公椅', '高速WiFi'],
      },
      headInfo: {
        size: '45平方米',
        floor: '5-9层',
        wifi: true,
        windowAvailable: true,
        smokingAllowed: false,
      },
      bedInfo: [
        {
          bedType: '单人床',
          bedNumber: 2,
          bedSize: '1.2m x 2.0m',
        },
      ],
      breakfastInfo: {
        breakfastType: '含双早',
        cuisine: '商务早餐',
        bussinessTime: '07:00-09:30',
        addBreakfast: '68元/位',
      },
      auditInfo: {
        status: 'approved',
        auditedBy: adminProfile._id,
        auditedAt: new Date(),
      },
    });
    console.log('房型12创建成功:', room12.baseInfo.type);

    await AuditLog.create({
      targetType: 'room',
      targetId: room12._id,
      action: 'submit',
      operatorId: adminProfile._id,
      reason: '商户提交房型审核',
    });

    await AuditLog.create({
      targetType: 'room',
      targetId: room12._id,
      action: 'approve',
      operatorId: adminProfile._id,
      reason: '审核通过',
    });

    const room13 = await Room.create({
      hotelId: hotel5._id,
      baseInfo: {
        type: '行政大床房',
        price: 2288,
        images: [
          'https://example.com/room13-1.jpg',
          'https://example.com/room13-2.jpg',
        ],
        status: 'approved',
        maxOccupancy: 2,
        facilities: [
          {
            category: '浴室设施',
            content: '<p>独立卫浴<br/>24小时热水<br/>吹风机<br/>免费洗漱用品<br/>浴缸<br/>淋浴<br/>豪华卫浴用品</p>',
            summary: '独立卫浴、24小时热水、浴缸',
            icon: 'bathroom',
            order: 1,
          },
          {
            category: '客房设施',
            content: '<p>空调<br/>电视<br/>迷你吧<br/>保险箱<br/>书桌<br/>衣柜<br/>熨斗<br/>电热水壶</p>',
            summary: '空调、电视、迷你吧、保险箱',
            icon: 'room',
            order: 2,
          },
          {
            category: '床品设施',
            content: '<p>1.8米大床<br/>高级床垫<br/>纯棉床品<br/>鸭绒被<br/>高级枕头</p>',
            summary: '1.8米大床、高级床垫',
            icon: 'bed',
            order: 3,
          },
          {
            category: '其他设施',
            content: '<p>免费WiFi<br/>有线网络<br/>市内电话<br/>收费长途电话<br/>行政酒廊礼遇</p>',
            summary: '免费WiFi、有线网络、行政酒廊礼遇',
            icon: 'other',
            order: 4,
          },
        ],
        policies: [
          {
            policyType: '订房必读',
            content: '<p><strong>入住时间：</strong>14:00以后</p><p><strong>退房时间：</strong>12:00以前</p><p><strong>入住凭证：</strong>需提供有效身份证件</p><p><strong>宠物政策：</strong>不可携带宠物</p><p><strong>加床政策：</strong>不可加床</p><p><strong>吸烟政策：</strong>无烟房</p><p><strong>押金政策：</strong>入住时需支付押金，退房时退还</p>',
            summary: '入住时间14:00后，退房时间12:00前',
          },
          {
            policyType: '取消政策',
            content: '<p>入住前48小时免费取消，48小时内取消收取首晚房费。</p>',
            summary: '48小时前免费取消',
          },
        ],
        bedRemark: ['1.8米大床', '高级床垫', '行政酒廊礼遇'],
      },
      headInfo: {
        size: '55平方米',
        floor: '21-25层',
        wifi: true,
        windowAvailable: true,
        smokingAllowed: false,
      },
      bedInfo: [
        {
          bedType: '大床',
          bedNumber: 1,
          bedSize: '1.8m x 2.0m',
        },
      ],
      breakfastInfo: {
        breakfastType: '含双早',
        cuisine: '行政早餐',
        bussinessTime: '06:30-10:30',
        addBreakfast: '108元/位',
      },
      auditInfo: {
        status: 'approved',
        auditedBy: adminProfile._id,
        auditedAt: new Date(),
      },
    });
    console.log('房型13创建成功:', room13.baseInfo.type);

    await AuditLog.create({
      targetType: 'room',
      targetId: room13._id,
      action: 'submit',
      operatorId: adminProfile._id,
      reason: '商户提交房型审核',
    });

    await AuditLog.create({
      targetType: 'room',
      targetId: room13._id,
      action: 'approve',
      operatorId: adminProfile._id,
      reason: '审核通过',
    });

    console.log('\n========== 创建通知 ==========');
    await Notification.create({
      userId: adminProfile._id,
      message: '商户"北京悦达酒店管理有限公司"提交了新酒店"北京悦达商务酒店"待审核',
      meta: {
        targetType: 'hotel',
        targetId: hotel2._id,
        merchantName: merchant1.baseInfo.merchantName,
      },
      read: false,
    });

    await Notification.create({
      userId: adminProfile._id,
      message: '商户"北京悦达酒店管理有限公司"提交了新房型"标准双床房"待审核',
      meta: {
        targetType: 'room',
        targetId: room3._id,
        merchantName: merchant1.baseInfo.merchantName,
        hotelName: hotel1.baseInfo.nameCn,
      },
      read: false,
    });

    console.log('通知创建成功');

    console.log('\n========== 数据插入完成 ==========');
    console.log('\n统计信息:');
    console.log('- 管理员:', await User.countDocuments({ role: 'admin' }));
    console.log('- 商户:', await User.countDocuments({ role: 'merchant' }));
    console.log('- 酒店:', await Hotel.countDocuments());
    console.log('- 房型:', await Room.countDocuments());
    console.log('- 审计日志:', await AuditLog.countDocuments());
    console.log('- 通知:', await Notification.countDocuments());

    console.log('\n登录账号:');
    console.log('- 管理员: admin@estay.com / password123');
    console.log('- 商户1: merchant1@estay.com / password123');
    console.log('- 商户2: merchant2@estay.com / password123');

  } catch (error) {
    console.error('数据插入失败:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('\n数据库连接已关闭');
  }
}

seedDatabase()
  .then(() => {
    console.log('脚本执行完成');
    process.exit(0);
  })
  .catch((error) => {
    console.error('脚本执行失败:', error);
    process.exit(1);
  });
