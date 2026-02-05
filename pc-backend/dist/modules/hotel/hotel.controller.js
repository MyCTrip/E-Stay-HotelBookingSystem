"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMyHotels = exports.listApprovedHotels = exports.submitHotel = exports.requestDeleteHotel = exports.updateHotel = exports.createHotel = void 0;
const hotel_model_1 = require("./hotel.model");
const audit_model_1 = require("../audit/audit.model");
const notification_service_1 = require("../notification/notification.service");
const hotel_service_1 = require("./hotel.service");
const htmlSanitizer_1 = require("../../utils/htmlSanitizer");
const createHotel = async (req, res) => {
    const user = req.user;
    const { baseInfo, checkinInfo } = req.body;
    // allow legacy flat fields for convenience
    const normalizedBase = baseInfo || {
        nameCn: req.body.nameCn,
        nameEn: req.body.nameEn,
        address: req.body.address,
        city: req.body.city,
        star: req.body.star,
        openTime: req.body.openTime,
        roomTotal: req.body.roomTotal || 0,
        phone: req.body.phone || '',
        description: req.body.description || '',
        images: req.body.images || [],
    };
    try {
        // 净化HTML富文本内容，防止XSS攻击
        const sanitizedBase = (0, htmlSanitizer_1.sanitizeObject)(normalizedBase);
        const sanitizedCheckin = (0, htmlSanitizer_1.sanitizeObject)(checkinInfo || {});
        const hotel = await hotel_model_1.Hotel.create({
            merchantId: user.id,
            baseInfo: sanitizedBase,
            checkinInfo: sanitizedCheckin,
        });
        res.status(201).json(hotel);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.createHotel = createHotel;
const updateHotel = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const user = req.user;
    try {
        const hotel = await hotel_model_1.Hotel.findById(id);
        console.log('updateHotel called, user:', user.id, 'role:', user.role, 'payload:', JSON.stringify(updates));
        if (!hotel)
            return res.status(404).json({ message: 'Not found' });
        if (hotel.merchantId.toString() !== user.id && user.role !== 'admin')
            return res.status(403).json({ message: 'Forbidden' });
        try {
            hotel_service_1.hotelService.checkOptimisticVersion(hotel, updates);
        }
        catch (err) {
            if (err && err.status === 409)
                return res.status(409).json({ message: 'Version conflict' });
            if (err && err.status === 404)
                return res.status(404).json({ message: 'Not found' });
        }
        // Admins may directly apply changes
        if (user.role === 'admin') {
            if (updates.baseInfo) {
                const sanitizedBase = (0, htmlSanitizer_1.sanitizeObject)(updates.baseInfo);
                hotel.baseInfo = { ...hotel.baseInfo, ...sanitizedBase };
            }
            if (updates.checkinInfo) {
                const sanitizedCheckin = (0, htmlSanitizer_1.sanitizeObject)(updates.checkinInfo);
                hotel.checkinInfo = { ...hotel.checkinInfo, ...sanitizedCheckin };
            }
            if (updates.auditInfo)
                hotel.auditInfo = { ...hotel.auditInfo, ...updates.auditInfo };
            // If admin applies changes, also clear pendingChanges
            hotel.pendingChanges = null;
            await hotel.save();
            return res.json(hotel);
        }
        // Merchant update: delegate to service to save pending changes
        if (user.role !== 'admin') {
            const allowed = {};
            if (updates.baseInfo) {
                const sanitizedBase = (0, htmlSanitizer_1.sanitizeObject)(updates.baseInfo);
                allowed.baseInfo = sanitizedBase;
            }
            if (updates.checkinInfo) {
                const sanitizedCheckin = (0, htmlSanitizer_1.sanitizeObject)(updates.checkinInfo);
                allowed.checkinInfo = sanitizedCheckin;
            }
            if (Object.keys(allowed).length === 0)
                return res.status(400).json({ message: 'No updatable fields provided' });
            try {
                const updated = await hotel_service_1.hotelService.savePendingChanges(id, user.id, allowed);
                return res.json(updated);
            }
            catch (err) {
                if (err && err.status)
                    return res.status(err.status).json({ message: err.message });
                return res.status(400).json({ message: err.message });
            }
        }
    }
    catch (err) {
        console.error('updateHotel catch error:', err);
        res.status(400).json({ message: err.message });
    }
};
exports.updateHotel = updateHotel;
const requestDeleteHotel = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    try {
        const hotel = await hotel_model_1.Hotel.findById(id);
        if (!hotel)
            return res.status(404).json({ message: 'Not found' });
        if (hotel.merchantId.toString() !== user.id && user.role !== 'admin')
            return res.status(403).json({ message: 'Forbidden' });
        // mark deletion request
        hotel.pendingDeletion = true;
        hotel.auditInfo = hotel.auditInfo || {};
        // @ts-ignore
        hotel.auditInfo.status = 'pending';
        hotel.markModified('auditInfo');
        await hotel.save();
        const log = await audit_model_1.AuditLog.create({
            targetType: 'hotel',
            targetId: hotel._id,
            action: 'delete_request',
            operatorId: user.id,
        });
        // notify admins
        await notification_service_1.notificationService.notifyAdmins(`Hotel delete requested: ${hotel._id}`, { auditId: log._id, type: 'delete_request' });
        res.json(hotel);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.requestDeleteHotel = requestDeleteHotel;
const submitHotel = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    try {
        const hotel = await hotel_model_1.Hotel.findById(id);
        if (!hotel)
            return res.status(404).json({ message: 'Not found' });
        if (hotel.merchantId.toString() !== user.id)
            return res.status(403).json({ message: 'Forbidden' });
        const updated = await hotel_model_1.Hotel.findByIdAndUpdate(id, { $set: { 'auditInfo.status': 'pending' } }, { new: true });
        if (!updated)
            return res.status(404).json({ message: 'Not found' });
        // write audit log
        await audit_model_1.AuditLog.create({
            targetType: 'hotel',
            targetId: updated._id,
            action: 'submit',
            operatorId: user.id,
        });
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.submitHotel = submitHotel;
const listApprovedHotels = async (req, res) => {
    const hotels = await hotel_model_1.Hotel.find({ 'auditInfo.status': 'approved' });
    res.json(hotels);
};
exports.listApprovedHotels = listApprovedHotels;
const listMyHotels = async (req, res) => {
    const user = req.user;
    const { status, search } = req.query;
    const limit = Math.min(parseInt(req.query.limit || '100', 10) || 100, 500);
    const page = Math.max(parseInt(req.query.page || '1', 10) || 1, 1);
    const filter = { merchantId: user.id };
    if (status)
        filter['auditInfo.status'] = status;
    if (search)
        filter.$or = [
            { 'baseInfo.nameCn': new RegExp(search, 'i') },
            { 'baseInfo.nameEn': new RegExp(search, 'i') },
        ];
    const total = await hotel_model_1.Hotel.countDocuments(filter);
    const data = await hotel_model_1.Hotel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    res.json({ data, meta: { total, page, limit } });
};
exports.listMyHotels = listMyHotels;
//# sourceMappingURL=hotel.controller.js.map