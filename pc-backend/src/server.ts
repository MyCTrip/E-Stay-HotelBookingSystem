import app from './app';
import './config/db';
import { initializeRedis } from './config/redis';
import { User } from './modules/user/user.model';
import { AdminProfile } from './modules/admin/admin.model';
import bcrypt from 'bcryptjs';

const PORT = process.env.PORT || 3000;

const ensureAdmin = async () => {
  try {
    let user = await User.findOne({ email: 'admin@local.com' });
    if (!user) {
      const hash = await bcrypt.hash('admin123', 10);
      user = await User.create({ email: 'admin@local.com', password: hash, role: 'admin' });
      console.log('Default admin created: admin@local.com / admin123');
    } else {
      console.log('Default admin user exists.');
    }

    // Ensure there is an AdminProfile linked to this user
    const profile = await AdminProfile.findOne({ userId: user._id });
    if (!profile) {
      await AdminProfile.create({
        userId: user._id,
        baseInfo: { name: 'System Administrator', employeeNo: 'ADM001' },
      });
      console.log('AdminProfile created for admin user.');
    }
  } catch (err) {
    console.error('Error creating default admin or profile', err);
  }
};

// 初始化应用
const initializeApp = async () => {
  try {
    // 初始化Redis连接
    await initializeRedis();
    
    // 确保默认管理员存在
    await ensureAdmin();
    
    // 启动服务器
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize app:', error);
    process.exit(1);
  }
};

// 启动应用
initializeApp();
