import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/jwt';
import { User } from '../modules/user/user.model';

export interface AuthRequest extends Request {
  user?: any;
}

// export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
//   const auth = req.headers.authorization;
//   if (!auth) return res.status(401).json({ message: 'Unauthorized' });
//   const token = auth.split(' ')[1];
//   try {
//     const payload = jwt.verify(token, jwtSecret) as any;
//     // Fetch fresh user from DB and attach (without password)
//     const user = await User.findById(payload.id).select('-password');
//     if (!user) return res.status(401).json({ message: 'Unauthorized' });
//     if ((user as any).status !== 'active')
//       return res.status(403).json({ message: 'Account disabled' });
//     req.user = { id: user._id.toString(), email: user.email, role: user.role, createdAt: user.createdAt ,updatedAt: user.updatedAt };
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };


// 开发环境专用测试 Token
const DEV_MOCK_TOKEN = 'test_mock_token_123456789';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = auth.split(' ')[1];

  // 开发环境“后门”逻辑
  // 只有在非 production 环境才允许
  if (process.env.NODE_ENV !== 'production' && token === DEV_MOCK_TOKEN) {
    req.user = {
      id: 'mock_admin_001',
      email: 'test@estay.com',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return next(); // 直接放行
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as any;

    // 从数据库获取最新用户信息
    const user = await User.findById(payload.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if ((user as any).status !== 'active') {
      return res.status(403).json({ message: 'Account disabled' });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};