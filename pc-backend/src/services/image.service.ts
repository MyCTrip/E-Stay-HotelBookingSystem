import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

interface ImageResizeOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
}

interface ImageInfo {
  width: number;
  height: number;
  size: number;
  format: string;
}

export class ImageService {
  /**
   * 压缩图片
   */
  async compressImage(inputPath: string, outputPath: string, options: ImageResizeOptions = {}): Promise<ImageInfo> {
    const {
      width,
      height,
      quality = 80,
      format = 'jpeg'
    } = options;

    try {
      // 使用sharp处理图片
      const pipeline = sharp(inputPath);
      
      // 如果指定了宽度或高度，进行尺寸调整
      if (width || height) {
        pipeline.resize({
          width,
          height,
          fit: sharp.fit.inside,
          withoutEnlargement: true
        });
      }
      
      // 设置输出格式和质量
      pipeline.toFormat(format, {
        quality,
        progressive: true
      });
      
      // 保存处理后的图片
      await pipeline.toFile(outputPath);
      
      // 获取图片信息
      const info = await sharp(outputPath).metadata();
      const stats = await fs.stat(outputPath);
      
      return {
        width: info.width || 0,
        height: info.height || 0,
        size: stats.size,
        format: info.format || 'unknown'
      };
    } catch (error) {
      console.error('Image compression error:', error);
      throw error;
    }
  }

  /**
   * 生成缩略图
   */
  async generateThumbnail(inputPath: string, outputPath: string, size: number = 200): Promise<ImageInfo> {
    return this.compressImage(inputPath, outputPath, {
      width: size,
      height: size,
      quality: 75,
      format: 'webp'
    });
  }

  /**
   * 批量处理图片
   */
  async batchProcessImages(images: Array<{
    inputPath: string;
    outputPath: string;
    options: ImageResizeOptions;
  }>): Promise<ImageInfo[]> {
    const results = await Promise.all(
      images.map(img => this.compressImage(img.inputPath, img.outputPath, img.options))
    );
    return results;
  }

  /**
   * 清理临时图片
   */
  async cleanupTempImages(imagePaths: string[]): Promise<void> {
    try {
      await Promise.all(
        imagePaths.map(async (imgPath) => {
          try {
            await fs.unlink(imgPath);
          } catch (error) {
            console.error(`Error deleting temp image ${imgPath}:`, error);
          }
        })
      );
    } catch (error) {
      console.error('Cleanup temp images error:', error);
    }
  }

  /**
   * 获取图片信息
   */
  async getImageInfo(imagePath: string): Promise<ImageInfo> {
    try {
      const info = await sharp(imagePath).metadata();
      const stats = await fs.stat(imagePath);
      
      return {
        width: info.width || 0,
        height: info.height || 0,
        size: stats.size,
        format: info.format || 'unknown'
      };
    } catch (error) {
      console.error('Get image info error:', error);
      throw error;
    }
  }
}

export const imageService = new ImageService();
