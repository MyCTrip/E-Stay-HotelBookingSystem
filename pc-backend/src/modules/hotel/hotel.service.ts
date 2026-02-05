import { Hotel } from './hotel.model';
import { AuditLog } from '../audit/audit.model';
import { notificationService } from '../notification/notification.service';

class ServiceError extends Error {
	status: number;
	constructor(message: string, status = 400) {
		super(message);
		this.status = status;
	}
}

export const hotelService = {
	createHotel: async (merchantId: string, baseInfo: any, checkinInfo: any) => {
		const hotel = await Hotel.create({ merchantId, baseInfo, checkinInfo: checkinInfo || {} });
		return hotel;
	},

	checkOptimisticVersion: (hotel: any, payload: any) => {
		if (!hotel) throw new ServiceError('Not found', 404);
		if (payload.__v !== undefined && payload.__v !== (hotel as any).__v) {
			throw new ServiceError('Version conflict', 409);
		}
		if (payload.updatedAt && new Date(payload.updatedAt).getTime() !== new Date(hotel.updatedAt).getTime()) {
			throw new ServiceError('Version conflict', 409);
		}
	},

	savePendingChanges: async (hotelId: string, merchantId: string, diffs: Record<string, any>) => {
		const hotel = await Hotel.findById(hotelId);
		if (!hotel) throw new ServiceError('Not found', 404);
		if (hotel.merchantId.toString() !== merchantId) throw new ServiceError('Forbidden', 403);

		hotel.pendingChanges = { ...(hotel.pendingChanges || {}), ...diffs };
		hotel.auditInfo = hotel.auditInfo || ({} as any);
		// @ts-ignore
		hotel.auditInfo.status = 'pending';
		// @ts-ignore
		hotel.auditInfo.auditedBy = null;
		// @ts-ignore
		hotel.auditInfo.auditedAt = null;
		hotel.markModified('auditInfo');
		hotel.markModified('pendingChanges');

		await hotel.save();

		const log = await AuditLog.create({
			targetType: 'hotel',
			targetId: hotel._id,
			action: 'update_request',
			operatorId: merchantId,
		});

		await notificationService.notifyAdmins(`Hotel update requested: ${hotel._id}`, { auditId: log._id, type: 'update_request' });

		return hotel;
	},

	requestDelete: async (hotelId: string, merchantId: string) => {
		const hotel = await Hotel.findById(hotelId);
		if (!hotel) throw new ServiceError('Not found', 404);
		if (hotel.merchantId.toString() !== merchantId) throw new ServiceError('Forbidden', 403);

		hotel.pendingDeletion = true;
		hotel.auditInfo = hotel.auditInfo || ({} as any);
		// @ts-ignore
		hotel.auditInfo.status = 'pending';
		hotel.markModified('auditInfo');
		hotel.markModified('pendingDeletion');
		await hotel.save();

		const log = await AuditLog.create({ targetType: 'hotel', targetId: hotel._id, action: 'delete_request', operatorId: merchantId });
		await notificationService.notifyAdmins(`Hotel delete requested: ${hotel._id}`, { auditId: log._id, type: 'delete_request' });
		return hotel;
	},

	applyPendingChanges: async (hotelId: string, adminId: string, reason?: string) => {
		const hotel = await Hotel.findById(hotelId);
		if (!hotel) throw new ServiceError('Not found', 404);

		// apply baseInfo and checkinInfo diffs if present
		if (hotel.pendingChanges) {
			if (hotel.pendingChanges.baseInfo) {
				Object.keys(hotel.pendingChanges.baseInfo).forEach((k) => {
					// @ts-ignore
					hotel.baseInfo[k] = hotel.pendingChanges.baseInfo[k];
				});
			}
			if (hotel.pendingChanges.checkinInfo) {
				Object.keys(hotel.pendingChanges.checkinInfo).forEach((k) => {
					// @ts-ignore
					hotel.checkinInfo[k] = hotel.pendingChanges.checkinInfo[k];
				});
			}
			hotel.pendingChanges = null;
		}

		hotel.auditInfo = hotel.auditInfo || ({} as any);
		// @ts-ignore
		hotel.auditInfo.status = 'approved';
		// @ts-ignore
		hotel.auditInfo.auditedBy = adminId;
		// @ts-ignore
		hotel.auditInfo.auditedAt = new Date();
		hotel.markModified('auditInfo');

		await hotel.save();

		await AuditLog.create({ targetType: 'hotel', targetId: hotel._id, action: 'approve', operatorId: adminId, reason });
		return hotel;
	},

	approveDelete: async (hotelId: string, adminId: string, reason?: string) => {
		const hotel = await Hotel.findById(hotelId);
		if (!hotel) throw new ServiceError('Not found', 404);
		if (!hotel.pendingDeletion) throw new ServiceError('No pending delete request', 400);

		hotel.pendingDeletion = false;
		hotel.deletedAt = new Date();
		hotel.auditInfo = hotel.auditInfo || ({} as any);
		// @ts-ignore
		hotel.auditInfo.status = 'offline';
		// @ts-ignore
		hotel.auditInfo.auditedBy = adminId;
		// @ts-ignore
		hotel.auditInfo.auditedAt = new Date();
		hotel.markModified('auditInfo');
		hotel.markModified('pendingDeletion');
		hotel.markModified('deletedAt');

		await hotel.save();
		await AuditLog.create({ targetType: 'hotel', targetId: hotel._id, action: 'delete', operatorId: adminId, reason });
		return hotel;
	},

	rejectPending: async (hotelId: string, adminId: string, reason: string) => {
		const hotel = await Hotel.findById(hotelId);
		if (!hotel) throw new ServiceError('Not found', 404);

		hotel.pendingDeletion = false;
		hotel.auditInfo = hotel.auditInfo || ({} as any);
		// @ts-ignore
		hotel.auditInfo.status = 'rejected';
		// @ts-ignore
		hotel.auditInfo.auditedBy = adminId;
		// @ts-ignore
		hotel.auditInfo.auditedAt = new Date();
		// @ts-ignore
		hotel.auditInfo.rejectReason = reason;
		hotel.markModified('auditInfo');
		hotel.markModified('pendingDeletion');

		await hotel.save();
		await AuditLog.create({ targetType: 'hotel', targetId: hotel._id, action: 'reject', operatorId: adminId, reason });
		return hotel;
	},
};

export { ServiceError };
