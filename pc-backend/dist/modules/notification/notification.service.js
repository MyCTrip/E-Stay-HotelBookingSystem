"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = void 0;
const admin_model_1 = require("../admin/admin.model");
const notification_model_1 = require("./notification.model");
exports.notificationService = {
    notifyAdmins: async (message, meta) => {
        const admins = await admin_model_1.AdminProfile.find();
        const created = [];
        for (const a of admins) {
            const n = await notification_model_1.Notification.create({ userId: a.userId, message, meta });
            created.push(n);
        }
        // For immediate feedback in tests, return the created notifications
        return created;
    },
};
//# sourceMappingURL=notification.service.js.map