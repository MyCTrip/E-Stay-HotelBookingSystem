import { upload } from '../config/upload';
import { Request, Response, NextFunction } from 'express';

export const singleImageUpload = (fieldName: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    upload.single(fieldName)(req, res, (err: any) => {
      if (err) {
        if (err.message === 'Unsupported file type') {
          return res.status(415).json({ message: '仅支持图片类型 (jpg/png/gif/webp)' });
        }
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({ message: '图片大小不能超过 5MB' });
        }
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };
