import { Request, Response } from 'express';
import { UPLOAD_URL_PATH } from '../../config/upload';

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: '未收到文件' });
  const url = `${UPLOAD_URL_PATH}/${req.file.filename}`;
  res.json({ url, filename: req.file.filename, size: req.file.size });
};
