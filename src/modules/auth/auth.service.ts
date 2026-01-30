import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../user/user.model';
import { jwtSecret, jwtExpiresIn } from '../../config/jwt';

export const authService = {
  register: async ({ email, password, role = 'merchant' }: any) => {
    const existing = await User.findOne({ email });
    if (existing) throw new Error('Email already registered');
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash, role });
    return user;
  },
  login: async ({ email, password }: any) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error('Invalid credentials');
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, jwtSecret, { expiresIn: jwtExpiresIn });
    return token;
  }
};
