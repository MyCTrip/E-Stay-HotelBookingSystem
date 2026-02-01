import app from './app';
import './config/db';
import { User } from './modules/user/user.model';
import bcrypt from 'bcryptjs';

const PORT = process.env.PORT || 3000;

const ensureAdmin = async () => {
  try {
    const exists = await User.findOne({ email: 'admin@local' });
    if (!exists) {
      const hash = await bcrypt.hash('admin123', 10);
      await User.create({ email: 'admin@local', password: hash, role: 'admin' });
      console.log('Default admin created: admin@local / admin123');
    }
  } catch (err) {
    console.error('Error creating default admin', err);
  }
};

ensureAdmin().finally(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});