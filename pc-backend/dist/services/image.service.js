"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageService = exports.ImageService = void 0;
const sharp_1 = __importDefault(require("sharp"));
const promises_1 = __importDefault(require("fs/promises"));
class ImageService {
    /**
     * 压缩图片
     */
    async compressImage(inputPath, outputPath, options = {}) {
        const { width, height, quality = 80, format = 'jpeg' } = options;
        try {
            // 使用sharp处理图片
            const pipeline = (0, sharp_1.default)(inputPath);
            // 如果指定了宽度或高度，进行尺寸调整
            if (width || height) {
                pipeline.resize({
                    width,
                    height,
                    fit: sharp_1.default.fit.inside,
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
            const info = await (0, sharp_1.default)(outputPath).metadata();
            const stats = await promises_1.default.stat(outputPath);
            return {
                width: info.width || 0,
                height: info.height || 0,
                size: stats.size,
                format: info.format || 'unknown'
            };
        }
        catch (error) {
            console.error('Image compression error:', error);
            throw error;
        }
    }
    /**
     * 生成缩略图
     */
    async generateThumbnail(inputPath, outputPath, size = 200) {
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
    async batchProcessImages(images) {
        const results = await Promise.all(images.map(img => this.compressImage(img.inputPath, img.outputPath, img.options)));
        return results;
    }
    /**
     * 清理临时图片
     */
    async cleanupTempImages(imagePaths) {
        try {
            await Promise.all(imagePaths.map(async (imgPath) => {
                try {
                    await promises_1.default.unlink(imgPath);
                }
                catch (error) {
                    console.error(`Error deleting temp image ${imgPath}:`, error);
                }
            }));
        }
        catch (error) {
            console.error('Cleanup temp images error:', error);
        }
    }
    /**
     * 获取图片信息
     */
    async getImageInfo(imagePath) {
        try {
            const info = await (0, sharp_1.default)(imagePath).metadata();
            const stats = await promises_1.default.stat(imagePath);
            return {
                width: info.width || 0,
                height: info.height || 0,
                size: stats.size,
                format: info.format || 'unknown'
            };
        }
        catch (error) {
            console.error('Get image info error:', error);
            throw error;
        }
    }
}
exports.ImageService = ImageService;
exports.imageService = new ImageService();
//# sourceMappingURL=image.service.js.map