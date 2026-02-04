import { Request, Response } from 'express';
import { authService } from './auth.service';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await authService.register({ email, password });
    res.status(201).json({ id: user._id, email: user.email });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const token = await authService.login({ email, password });
    res.status(200).json({ token });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export const me = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  res.json({ id: user.id || user._id, email: user.email, role: user.role });
};
