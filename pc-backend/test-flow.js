// 测试脚本：验证businessLicensePhoto数据流
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:3001/api';

// 测试token（需要根据实际情况更新）
const ADMIN_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTQxY2YwZWY1ZjNkMjU2NWQ3MWMwMyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczNzU3Njc0MCwiZXhwIjoxNzc5MTk0NzQwfQ.u0z-EW2-PW7Q7OYn8BI78wd1iFAkCMxYpW5c5FEPpYw';
const MERCHANT_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTQxY2IwZWY1ZjNkMjU2NWQ3MWIyMyIsInJvbGUiOiJtZXJjaGFudCIsImlhdCI6MTczNzU3Njc0MCwiZXhwIjoxNzc5MTk0NzQwfQ.sample';

async function main() {
  try {
    console.log('🧪 开始测试businessLicensePhoto流程...\n');

    // 1. 获取商户列表
    console.log('📋 步骤1: 获取商户列表');
    const listRes = await axios.get(`${API_BASE}/admin/merchants`, {
      headers: { 'Authorization': ADMIN_TOKEN }
    }).catch(e => {
      console.log('   ⚠️  列表查询失败，尝试获取数据库中的数据...');
      return null;
    });
    
    if (listRes) {
      console.log('   ✅ 获取成功，数据条数:', listRes.data.meta?.total || 0);
      
      if (listRes.data.data && listRes.data.data.length > 0) {
        const merchant = listRes.data.data[0];
        console.log('\n   📊 第一条商户记录:');
        console.log('   - _id:', merchant._id);
        console.log('   - 商户名:', merchant.baseInfo?.merchantName);
        console.log('   - qualificationInfo:', JSON.stringify(merchant.qualificationInfo, null, 2));
        
        if (merchant.qualificationInfo?.businessLicensePhoto) {
          console.log('   ✅ businessLicensePhoto 字段存在:', merchant.qualificationInfo.businessLicensePhoto);
        } else {
          console.log('   ❌ businessLicensePhoto 字段为空或不存在');
        }
      } else {
        console.log('   ℹ️  暂无商户数据');
      }
    }

    // 2. 测试上传接口
    console.log('\n📤 步骤2: 测试上传图片');
    
    // 创建测试图片（1x1的PNG）
    const testImagePath = path.join(__dirname, 'test-image.png');
    const pngBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xF8, 0xFF, 0xFF, 0x3F,
      0x00, 0x05, 0xFE, 0x02, 0xFE, 0x79, 0xFB, 0xEE, 0x7E, 0x00, 0x00, 0x00,
      0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    
    fs.writeFileSync(testImagePath, pngBuffer);
    
    const form = new FormData();
    form.append('file', fs.createReadStream(testImagePath));
    
    const uploadRes = await axios.post(`${API_BASE}/upload`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': MERCHANT_TOKEN
      }
    }).catch(e => {
      console.log('   ⚠️  上传失败:', e.response?.data?.message || e.message);
      return null;
    });
    
    if (uploadRes) {
      console.log('   ✅ 上传成功');
      console.log('   - URL:', uploadRes.data.url);
      console.log('   - 文件名:', uploadRes.data.filename);
      
      // 3. 验证上传的图片是否可访问
      console.log('\n📥 步骤3: 验证图片可访问性');
      const imgUrl = `http://localhost:3001${uploadRes.data.url}`;
      const imgRes = await axios.get(imgUrl).catch(e => {
        console.log('   ❌ 图片访问失败:', e.message);
        return null;
      });
      
      if (imgRes) {
        console.log('   ✅ 图片可正常访问');
        console.log('   - 大小:', imgRes.headers['content-length'], 'bytes');
        console.log('   - Content-Type:', imgRes.headers['content-type']);
      }
    }

    // 清理测试文件
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }

    console.log('\n✨ 测试完成！');

  } catch (error) {
    console.error('❌ 错误:', error.message);
    if (error.response?.data) {
      console.error('响应数据:', error.response.data);
    }
  }
}

main();
