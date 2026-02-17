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
          const ext = path.extname(fileName).toLowerCase();
          const baseName = path.basename(fileName, ext);
          const uploadsDir = path.dirname(originalPath);
          const compressedPath = path.join(uploadsDir, `${baseName}-compressed${ext}`);

          console.log(`Starting compression: ${fileName}`);
          console.log(`Original path: ${originalPath}`);
          console.log(`Compressed path: ${compressedPath}`);

          // 检查原文件是否存在
          try {
            await fs.access(originalPath);
          } catch (accessError) {
            console.error(`File access error: ${originalPath}`, accessError);
            throw new Error(`无法访问上传的文件: ${originalPath}`);
          }

          // 确定输出格式
          const formatMap: { [key: string]: 'jpeg' | 'png' | 'webp' } = {
            '.jpg': 'jpeg',
            '.jpeg': 'jpeg',
            '.png': 'png',
            '.gif': 'jpeg', // gif转为jpeg
            '.webp': 'webp'
          };
          const outputFormat = formatMap[ext] || 'jpeg';

          // 压缩图片，最大宽度1920px，质量80%
          await imageService.compressImage(originalPath, compressedPath, {
            width: 1920,
            quality: 80,
            format: outputFormat
          });

          // 删除原文件，使用压缩后的文件
          try {
            await fs.unlink(originalPath);
            console.log(`Original file deleted: ${fileName}`);
          } catch (unlinkError) {
            console.warn(`Failed to delete original file: ${originalPath}`, unlinkError);
          }

          // 更新文件信息
          req.file.path = compressedPath;
          req.file.filename = `${baseName}-compressed${ext}`;
          req.file.size = (await fs.stat(compressedPath)).size;

          console.log(`Image compressed successfully: ${baseName}-compressed${ext}`);
        } catch (error) {
          console.error('Image compression error:', error);
          console.error('Error details:', (error as any).message);
          // 压缩失败不影响上传，继续使用原文件
          console.log(`Compression failed, using original file: ${req.file.filename}`);
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
