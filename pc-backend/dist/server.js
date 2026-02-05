"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
require("./config/db");
const user_model_1 = require("./modules/user/user.model");
const admin_model_1 = require("./modules/admin/admin.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const PORT = process.env.PORT || 3000;
const ensureAdmin = async () => {
    try {
        let user = await user_model_1.User.findOne({ email: 'admin@local.com' });
        if (!user) {
            const hash = await bcryptjs_1.default.hash('admin123', 10);
            user = await user_model_1.User.create({ email: 'admin@local.com', password: hash, role: 'admin' });
            console.log('Default admin created: admin@local.com / admin123');
        }
        else {
            console.log('Default admin user exists.');
        }
        // Ensure there is an AdminProfile linked to this user
        const profile = await admin_model_1.AdminProfile.findOne({ userId: user._id });
        if (!profile) {
            await admin_model_1.AdminProfile.create({
                userId: user._id,
                baseInfo: { name: 'System Administrator', employeeNo: 'ADM001' },
            });
            console.log('AdminProfile created for admin user.');
        }
    }
    catch (err) {
        console.error('Error creating default admin or profile', err);
    }
};
ensureAdmin().finally(() => {
    app_1.default.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
//# sourceMappingURL=server.js.map