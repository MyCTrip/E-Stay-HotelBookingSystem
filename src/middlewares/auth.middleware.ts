import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/jwt';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, jwtSecret) as any;
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};