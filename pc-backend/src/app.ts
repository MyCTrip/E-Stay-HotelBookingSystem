import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/error.middleware';

import authRoutes from './modules/auth/auth.routes';
import merchantRoutes from './modules/merchant/merchant.routes';
import hotelRoutes from './modules/hotel/hotel.routes';
import adminRoutes from './modules/admin/admin.routes';
import auditRoutes from './modules/audit/audit.routes';
import roomRoutes from './modules/room/room.routes';

import path from 'path';
import uploadRoutes from './modules/upload/upload.routes';
import { UPLOAD_URL_PATH, UPLOAD_DIR } from './config/upload';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// 静态文件服务，访问 /uploads/xxx.jpg
app.use(UPLOAD_URL_PATH, express.static(UPLOAD_DIR));

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/merchants', merchantRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', auditRoutes);
app.use('/api', roomRoutes);

// 图片上传接口
app.use('/api/upload', uploadRoutes);

app.use(errorHandler);

export default app;
