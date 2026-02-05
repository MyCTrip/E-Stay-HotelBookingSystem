"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminProfile = void 0;
const mongoose_1 = require("mongoose");
const BaseInfoSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    employeeNo: { type: String, unique: true, sparse: true },
});
const AdminSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    baseInfo: { type: BaseInfoSchema, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
exports.AdminProfile = (0, mongoose_1.model)('AdminProfile', AdminSchema);
//# sourceMappingURL=admin.model.js.map