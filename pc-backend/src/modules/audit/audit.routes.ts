import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { AuditLog } from './audit.model';

const router = Router();

router.get('/audit-logs', authenticate, requireRole('admin'), async (req, res) => {
  // Supported query params: targetType, action, operatorId, startDate, endDate, limit, page
  const { targetType, action, operatorId, startDate, endDate } = req.query as any;
  let limit = Math.min(parseInt((req.query.limit as any) || '100', 10) || 100, 500);
  const page = Math.max(parseInt((req.query.page as any) || '1', 10) || 1, 1);
  const filter: any = {};
  if (targetType) filter.targetType = targetType;
  if (action) filter.action = action;
  if (operatorId) filter.operatorId = operatorId;
  if (startDate || endDate) filter.createdAt = {};
  if (startDate) filter.createdAt.$gte = new Date(startDate);
  if (endDate) filter.createdAt.$lte = new Date(endDate);

  const total = await AuditLog.countDocuments(filter);
  const data = await AuditLog.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ data, meta: { total, page, limit } });
});

export default router;
