import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { AuditLog } from './audit.model';

const router = Router();

router.get('/audit-logs', authenticate, requireRole('admin'), async (req, res) => {
  const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
  res.json(logs);
});

export default router;