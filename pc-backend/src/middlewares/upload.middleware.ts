import { upload } from '../config/upload';
import { Request, Response, NextFunction } from 'express';
import { imageService } from '../services/image.service';
import fs from 'fs/promises';
import path from 'path';

export const singleImageUpload = (fieldName: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    upload.single(fieldName)(req, res, async (err: any) => {
      if (err) {
        if (err.message === 'Unsupported file type') {
          return res.status(415).json({ message: '仅支持图片类型 (jpg/png/gif/webp)' });
        }
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({ message: '图片大小不能超过 5MB' });
        }
        return res.status(400).json({ message: err.message });
      }

      // 如果有上传的文件，进行压缩处理
      if (req.file) {
        try {
          const originalPath = req.file.path;
          const fileName = req.file.filename;
          const ext = path.extname(fileName);
          const baseName = path.basename(fileName, ext);
          const compressedPath = path.join(path.dirname(originalPath), `${baseName}-compressed${ext}`);

          // 压缩图片，最大宽度1920px，质量80%
          await imageService.compressImage(originalPath, compressedPath, {
            width: 1920,
            quality: 80
          });

          // 删除原文件，使用压缩后的文件
          await fs.unlink(originalPath);
          
          // 更新文件信息
          req.file.path = compressedPath;
          req.file.filename = `${baseName}-compressed${ext}`;
          
          console.log(`Image compressed: ${fileName} -> ${req.file.filename}`);
        } catch (error) {
          console.error('Image compression error:', error);
          // 压缩失败不影响上传，继续使用原文件
        }
      }

      next();
    });
  };

/**
 * 多图片上传中间件，支持图片压缩
 */
export const multipleImageUpload = (fieldName: string, maxCount: number = 10) =>
  (req: Request, res: Response, next: NextFunction) => {
    upload.array(fieldName, maxCount)(req, res, async (err: any) => {
      if (err) {
        if (err.message === 'Unsupported file type') {
          return res.status(415).json({ message: '仅支持图片类型 (jpg/png/gif/webp)' });
        }
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({ message: '图片大小不能超过 5MB' });
        }
        return res.status(400).json({ message: err.message });
      }

      // 如果有上传的文件，进行压缩处理
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          try {
            const originalPath = file.path;
            const fileName = file.filename;
            const ext = path.extname(fileName);
            const baseName = path.basename(fileName, ext);
            const compressedPath = path.join(path.dirname(originalPath), `${baseName}-compressed${ext}`);

            // 压缩图片，最大宽度1920px，质量80%
            await imageService.compressImage(originalPath, compressedPath, {
              width: 1920,
              quality: 80
            });

            // 删除原文件，使用压缩后的文件
            await fs.unlink(originalPath);
            
            // 更新文件信息
            file.path = compressedPath;
            file.filename = `${baseName}-compressed${ext}`;
            
            console.log(`Image compressed: ${fileName} -> ${file.filename}`);
          } catch (error) {
            console.error('Image compression error:', error);
            // 压缩失败不影响上传，继续使用原文件
          }
        }
      }

      next();
    });
  };
