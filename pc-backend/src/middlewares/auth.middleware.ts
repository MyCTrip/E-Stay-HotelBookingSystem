import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/jwt';
import { User } from '../modules/user/user.model';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, jwtSecret) as any;
    // Fetch fresh user from DB and attach (without password)
    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    if ((user as any).status !== 'active')
      return res.status(403).json({ message: 'Account disabled' });
    req.user = { id: user._id.toString(), email: user.email, role: user.role, createdAt: user.createdAt ,updatedAt: user.updatedAt };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
