"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const admin_controller_1 = require("./admin.controller");
const admin_schema_1 = require("./admin.schema");
const merchant_service_1 = require("../merchant/merchant.service");
const hotel_model_1 = require("../hotel/hotel.model");
const room_model_1 = require("../room/room.model");
const audit_model_1 = require("../audit/audit.model");
const router = (0, express_1.Router)();
router.get('/me', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('admin'), admin_controller_1.getProfile);
router.post('/hotels/:id/approve', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('admin'), (0, validate_middleware_1.validateBody)(admin_schema_1.auditActionSchema), admin_controller_1.approveHotel);
router.post('/hotels/:id/reject', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('admin'), (0, validate_middleware_1.validateBody)(admin_schema_1.auditActionSchema), admin_controller_1.rejectHotel);
router.post('/hotels/:id/offline', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('admin'), admin_controller_1.offlineHotel);
router.post('/hotels/:id/approve-delete', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('admin'), (0, validate_middleware_1.validateBody)(admin_schema_1.auditActionSchema), admin_controller_1.adminApproveDeleteHotel);
// Merchant approval
router.post('/merchants/:id/approve', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('admin'), (0, validate_middleware_1.validateBody)(admin_schema_1.auditActionSchema), admin_controller_1.adminApproveMerchant);
router.post('/merchants/:id/reject', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('admin'), (0, validate_middleware_1.validateBody)(admin_schema_1.auditActionSchema), admin_controller_1.adminRejectMerchant);
// Room approval
router.post('/rooms/:id/approve', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('admin'), (0, validate_middleware_1.validateBody)(admin_schema_1.auditActionSchema), admin_controller_1.adminApproveRoom);
router.post('/rooms/:id/reject', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('admin'), (0, validate_middleware_1.validateBody)(admin_schema_1.auditActionSchema), admin_controller_1.adminRejectRoom);
router.post('/rooms/:id/offline', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('admin'), (0, validate_middleware_1.validateBody)(admin_schema_1.auditActionSchema), admin_controller_1.offlineRoom);
router.post('/rooms/:id/approve-delete', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('admin'), (0, validate_middleware_1.validateBody)(admin_schema_1.auditActionSchema), admin_controller_1.adminApproveDeleteRoom);
// Bulk actions
router.post('/merchants/bulk', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('admin'), (0, validate_middleware_1.validateBody)(admin_schema_1.bulkActionSchema), async (req, res) => {
    const { ids, action, reason } = req.body;
    const results = { updated: [], errors: [] };
    for (const id of ids) {
        try {
            if (action === 'approve') {
                const profile = await merchant_service_1.merchantService.setVerifyStatus(id, 'verified', undefined, req.user.id);
                await audit_model_1.AuditLog.create({
                    targetType: 'merchant',
                    targetId: profile._id,
                    action: 'approve',
                    operatorId: req.user.id,
                    reason,
                });
                results.updated.push(profile);
            }
            else if (action === 'reject') {
                const profile = await merchant_service_1.merchantService.setVerifyStatus(id, 'rejected', reason, req.user.id);
                await audit_model_1.AuditLog.create({
                    targetType: 'merchant',
                    targetId: profile._id,
                    action: 'reject',
                    operatorId: req.user.id,
                    reason,
                });
                results.updated.push(profile);
            }
            else {
                results.errors.push({ id, message: 'Unsupported action for merchants' });
            }
        }
        catch (err) {
            results.errors.push({ id, message: err.message });
        }
    }
    res.json(results);
});
// Admin listing endpoints
router.get('/merchants', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('admin'), admin_controller_1.listMerchants);
router.get('/hotels', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('admin'), admin_controller_1.listHotels);
router.get('/rooms', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('admin'), admin_controller_1.listRooms);
// admin notifications
router.get('/notifications', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('admin'), admin_controller_1.listNotifications);
router.patch('/notifications/:id/read', auth_middleware_1.authenticate, admin_controller_1.markNotificationAsRead);
router.patch('/notifications/read-all', auth_middleware_1.authenticate, admin_controller_1.markAllNotificationsAsRead);
router.post('/hotels/bulk', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('admin'), (0, validate_middleware_1.validateBody)(admin_schema_1.bulkActionSchema), async (req, res) => {
    const { ids, action, reason } = req.body;
    const results = { updated: [], errors: [] };
    for (const id of ids) {
        try {
            if (action === 'approve') {
                const updated = await hotel_model_1.Hotel.findByIdAndUpdate(id, {
                    $set: {
                        'auditInfo.status': 'approved',
                        'auditInfo.auditedBy': req.user.id,
                        'auditInfo.auditedAt': new Date(),
                        'auditInfo.rejectReason': undefined,
                    },
                }, { new: true });
                if (!updated)
                    throw new Error('Not found');
                await audit_model_1.AuditLog.create({
                    targetType: 'hotel',
                    targetId: updated._id,
                    action: 'approve',
                    operatorId: req.user.id,
                    reason,
                });
                results.updated.push(updated);
            }
            else if (action === 'reject') {
                const updated = await hotel_model_1.Hotel.findByIdAndUpdate(id, {
                    $set: {
                        'auditInfo.status': 'rejected',
                        'auditInfo.auditedBy': req.user.id,
                        'auditInfo.auditedAt': new Date(),
                        'auditInfo.rejectReason': reason,
                    },
                }, { new: true });
                if (!updated)
                    throw new Error('Not found');
                await audit_model_1.AuditLog.create({
                    targetType: 'hotel',
                    targetId: updated._id,
                    action: 'reject',
                    operatorId: req.user.id,
                    reason,
                });
                results.updated.push(updated);
            }
            else if (action === 'offline') {
                const updated = await hotel_model_1.Hotel.findByIdAndUpdate(id, {
                    $set: {
                        'auditInfo.status': 'offline',
                        'auditInfo.auditedBy': req.user.id,
                        'auditInfo.auditedAt': new Date(),
                    },
                }, { new: true });
                if (!updated)
                    throw new Error('Not found');
                await audit_model_1.AuditLog.create({
                    targetType: 'hotel',
                    targetId: updated._id,
                    action: 'offline',
                    operatorId: req.user.id,
                    reason,
                });
                results.updated.push(updated);
            }
            else {
                results.errors.push({ id, message: 'Unsupported action' });
            }
        }
        catch (err) {
            results.errors.push({ id, message: err.message });
        }
    }
    res.json(results);
});
router.post('/rooms/bulk', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('admin'), (0, validate_middleware_1.validateBody)(admin_schema_1.bulkActionSchema), async (req, res) => {
    const { ids, action, reason } = req.body;
    const results = { updated: [], errors: [] };
    for (const id of ids) {
        try {
            if (action === 'approve') {
                const updated = await room_model_1.Room.findByIdAndUpdate(id, {
                    $set: {
                        'auditInfo.status': 'approved',
                        'auditInfo.auditedBy': req.user.id,
                        'auditInfo.auditedAt': new Date(),
                        'auditInfo.rejectReason': undefined,
                    },
                }, { new: true });
                if (!updated)
                    throw new Error('Not found');
                await audit_model_1.AuditLog.create({
                    targetType: 'room',
                    targetId: updated._id,
                    action: 'approve',
                    operatorId: req.user.id,
                    reason,
                });
                results.updated.push(updated);
            }
            else if (action === 'reject') {
                const updated = await room_model_1.Room.findByIdAndUpdate(id, {
                    $set: {
                        'auditInfo.status': 'rejected',
                        'auditInfo.auditedBy': req.user.id,
                        'auditInfo.auditedAt': new Date(),
                        'auditInfo.rejectReason': reason,
                    },
                }, { new: true });
                if (!updated)
                    throw new Error('Not found');
                await audit_model_1.AuditLog.create({
                    targetType: 'room',
                    targetId: updated._id,
                    action: 'reject',
                    operatorId: req.user.id,
                    reason,
                });
                results.updated.push(updated);
            }
            else if (action === 'offline') {
                const updated = await room_model_1.Room.findByIdAndUpdate(id, {
                    $set: {
                        'auditInfo.status': 'offline',
                        'auditInfo.auditedBy': req.user.id,
                        'auditInfo.auditedAt': new Date(),
                    },
                }, { new: true });
                if (!updated)
                    throw new Error('Not found');
                await audit_model_1.AuditLog.create({
                    targetType: 'room',
                    targetId: updated._id,
                    action: 'offline',
                    operatorId: req.user.id,
                    reason,
                });
                results.updated.push(updated);
            }
            else {
                results.errors.push({ id, message: 'Unsupported action' });
            }
        }
        catch (err) {
            results.errors.push({ id, message: err.message });
        }
    }
    res.json(results);
});
exports.default = router;
//# sourceMappingURL=admin.routes.js.map