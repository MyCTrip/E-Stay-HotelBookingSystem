"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const admin_model_1 = require("./admin.model");
exports.adminService = {
    findByUserId: async (userId) => {
        return admin_model_1.AdminProfile.findOne({ userId });
    },
    findById: async (id) => {
        return admin_model_1.AdminProfile.findById(id);
    },
};
//# sourceMappingURL=admin.service.js.map