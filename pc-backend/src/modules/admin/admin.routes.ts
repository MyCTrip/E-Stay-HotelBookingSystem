import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validateBody } from '../../middlewares/validate.middleware';
import {
  approveHotel,
  rejectHotel,
  offlineHotel,
  adminApproveMerchant,
  adminRejectMerchant,
  adminApproveRoom,
  adminRejectRoom,
  offlineRoom,
  getProfile,
  listMerchants,
  listHotels,
  listRooms,
  listNotifications,
  adminApproveDeleteHotel,
  adminApproveDeleteRoom,
} from './admin.controller';
import { auditActionSchema, bulkActionSchema } from './admin.schema';
import { merchantService } from '../merchant/merchant.service';
import { Hotel } from '../hotel/hotel.model';
import { Room } from '../room/room.model';
import { AuditLog } from '../audit/audit.model';

const router = Router();

router.get('/me', authenticate, requireRole('admin'), getProfile);

router.post(
  '/hotels/:id/approve',
  authenticate,
  requireRole('admin'),
  validateBody(auditActionSchema),
  approveHotel
);
router.post(
  '/hotels/:id/reject',
  authenticate,
  requireRole('admin'),
  validateBody(auditActionSchema),
  rejectHotel
);
router.post('/hotels/:id/offline', authenticate, requireRole('admin'), offlineHotel);
router.post('/hotels/:id/approve-delete', authenticate, requireRole('admin'), validateBody(auditActionSchema), adminApproveDeleteHotel);

// Merchant approval
router.post(
  '/merchants/:id/approve',
  authenticate,
  requireRole('admin'),
  validateBody(auditActionSchema),
  adminApproveMerchant
);
router.post(
  '/merchants/:id/reject',
  authenticate,
  requireRole('admin'),
  validateBody(auditActionSchema),
  adminRejectMerchant
);

// Room approval
router.post(
  '/rooms/:id/approve',
  authenticate,
  requireRole('admin'),
  validateBody(auditActionSchema),
  adminApproveRoom
);
router.post(
  '/rooms/:id/reject',
  authenticate,
  requireRole('admin'),
  validateBody(auditActionSchema),
  adminRejectRoom
);
router.post(
  '/rooms/:id/offline',
  authenticate,
  requireRole('admin'),
  validateBody(auditActionSchema),
  offlineRoom
);
router.post('/rooms/:id/approve-delete', authenticate, requireRole('admin'), validateBody(auditActionSchema), adminApproveDeleteRoom);

// Bulk actions
router.post(
  '/merchants/bulk',
  authenticate,
  requireRole('admin'),
  validateBody(bulkActionSchema),
  async (req, res) => {
    const { ids, action, reason } = req.body as any;
    const results: { updated: any[]; errors: any[] } = { updated: [], errors: [] };
    for (const id of ids) {
      try {
        if (action === 'approve') {
          const profile = await merchantService.setVerifyStatus(
            id,
            'verified',
            undefined,
            (req as any).user.id
          );
          await AuditLog.create({
            targetType: 'merchant',
            targetId: profile._id,
            action: 'approve',
            operatorId: (req as any).user.id,
            reason,
          });
          results.updated.push(profile);
        } else if (action === 'reject') {
          const profile = await merchantService.setVerifyStatus(
            id,
            'rejected',
            reason,
            (req as any).user.id
          );
          await AuditLog.create({
            targetType: 'merchant',
            targetId: profile._id,
            action: 'reject',
            operatorId: (req as any).user.id,
            reason,
          });
          results.updated.push(profile);
        } else {
          results.errors.push({ id, message: 'Unsupported action for merchants' });
        }
      } catch (err: any) {
        results.errors.push({ id, message: err.message });
      }
    }
    res.json(results);
  }
);

// Admin listing endpoints
router.get('/merchants', authenticate, requireRole('admin'), listMerchants);
router.get('/hotels', authenticate, requireRole('admin'), listHotels);
router.get('/rooms', authenticate, requireRole('admin'), listRooms);
// admin notifications
router.get('/notifications', authenticate, requireRole('admin'), listNotifications);

router.post(
  '/hotels/bulk',
  authenticate,
  requireRole('admin'),
  validateBody(bulkActionSchema),
  async (req, res) => {
    const { ids, action, reason } = req.body as any;
    const results: { updated: any[]; errors: any[] } = { updated: [], errors: [] };
    for (const id of ids) {
      try {
        if (action === 'approve') {
          const updated = await Hotel.findByIdAndUpdate(
            id,
            {
              $set: {
                'auditInfo.status': 'approved',
                'auditInfo.auditedBy': (req as any).user.id,
                'auditInfo.auditedAt': new Date(),
                'auditInfo.rejectReason': undefined,
              },
            },
            { new: true }
          );
          if (!updated) throw new Error('Not found');
          await AuditLog.create({
            targetType: 'hotel',
            targetId: updated._id,
            action: 'approve',
            operatorId: (req as any).user.id,
            reason,
          });
          results.updated.push(updated);
        } else if (action === 'reject') {
          const updated = await Hotel.findByIdAndUpdate(
            id,
            {
              $set: {
                'auditInfo.status': 'rejected',
                'auditInfo.auditedBy': (req as any).user.id,
                'auditInfo.auditedAt': new Date(),
                'auditInfo.rejectReason': reason,
              },
            },
            { new: true }
          );
          if (!updated) throw new Error('Not found');
          await AuditLog.create({
            targetType: 'hotel',
            targetId: updated._id,
            action: 'reject',
            operatorId: (req as any).user.id,
            reason,
          });
          results.updated.push(updated);
        } else if (action === 'offline') {
          const updated = await Hotel.findByIdAndUpdate(
            id,
            {
              $set: {
                'auditInfo.status': 'offline',
                'auditInfo.auditedBy': (req as any).user.id,
                'auditInfo.auditedAt': new Date(),
              },
            },
            { new: true }
          );
          if (!updated) throw new Error('Not found');
          await AuditLog.create({
            targetType: 'hotel',
            targetId: updated._id,
            action: 'offline',
            operatorId: (req as any).user.id,
            reason,
          });
          results.updated.push(updated);
        } else {
          results.errors.push({ id, message: 'Unsupported action' });
        }
      } catch (err: any) {
        results.errors.push({ id, message: err.message });
      }
    }
    res.json(results);
  }
);

router.post(
  '/rooms/bulk',
  authenticate,
  requireRole('admin'),
  validateBody(bulkActionSchema),
  async (req, res) => {
    const { ids, action, reason } = req.body as any;
    const results: { updated: any[]; errors: any[] } = { updated: [], errors: [] };
    for (const id of ids) {
      try {
        if (action === 'approve') {
          const updated = await Room.findByIdAndUpdate(
            id,
            {
              $set: {
                'auditInfo.status': 'approved',
                'auditInfo.auditedBy': (req as any).user.id,
                'auditInfo.auditedAt': new Date(),
                'auditInfo.rejectReason': undefined,
              },
            },
            { new: true }
          );
          if (!updated) throw new Error('Not found');
          await AuditLog.create({
            targetType: 'room',
            targetId: updated._id,
            action: 'approve',
            operatorId: (req as any).user.id,
            reason,
          });
          results.updated.push(updated);
        } else if (action === 'reject') {
          const updated = await Room.findByIdAndUpdate(
            id,
            {
              $set: {
                'auditInfo.status': 'rejected',
                'auditInfo.auditedBy': (req as any).user.id,
                'auditInfo.auditedAt': new Date(),
                'auditInfo.rejectReason': reason,
              },
            },
            { new: true }
          );
          if (!updated) throw new Error('Not found');
          await AuditLog.create({
            targetType: 'room',
            targetId: updated._id,
            action: 'reject',
            operatorId: (req as any).user.id,
            reason,
          });
          results.updated.push(updated);
        } else if (action === 'offline') {
          const updated = await Room.findByIdAndUpdate(
            id,
            {
              $set: {
                'auditInfo.status': 'offline',
                'auditInfo.auditedBy': (req as any).user.id,
                'auditInfo.auditedAt': new Date(),
              },
            },
            { new: true }
          );
          if (!updated) throw new Error('Not found');
          await AuditLog.create({
            targetType: 'room',
            targetId: updated._id,
            action: 'offline',
            operatorId: (req as any).user.id,
            reason,
          });
          results.updated.push(updated);
        } else {
          results.errors.push({ id, message: 'Unsupported action' });
        }
      } catch (err: any) {
        results.errors.push({ id, message: err.message });
      }
    }
    res.json(results);
  }
);
export default router;
