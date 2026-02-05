import { Router } from 'express';
import { uploadImage } from './upload.controller';
import { singleImageUpload } from '../../middlewares/upload.middleware';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

// POST /api/upload  单图片上传，字段名 file
router.post('/', requireAuth, singleImageUpload('file'), uploadImage);

export default router;
