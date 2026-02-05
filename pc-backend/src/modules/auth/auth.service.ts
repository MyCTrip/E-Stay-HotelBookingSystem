import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../user/user.model';
import { jwtSecret, jwtExpiresIn } from '../../config/jwt';

export const authService = {
  register: async ({ email, password }: any) => {
    const existing = await User.findOne({ email });
    if (existing) throw new Error('Email already registered');
    const hash = await bcrypt.hash(password, 10);
    // Force role to 'merchant' for public registration
    const user = await User.create({ email, password: hash, role: 'merchant' });
    return user;
  },
  login: async ({ email, password }: any) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error('Invalid credentials');
    // Update last login time (updatedAt)
    await User.findByIdAndUpdate(user._id, { updatedAt: new Date() });
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });
    return token;
  },
};
