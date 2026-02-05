import { AdminProfile } from '../admin/admin.model';
import { Notification } from './notification.model';

export const notificationService = {
  notifyAdmins: async (message: string, meta?: Record<string, any>) => {
    const admins = await AdminProfile.find();
    const created: any[] = [];
    for (const a of admins) {
      const n = await Notification.create({ userId: a.userId, message, meta });
      created.push(n);
    }
    // For immediate feedback in tests, return the created notifications
    return created;
  },
};
