"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../user/user.model");
const jwt_1 = require("../../config/jwt");
exports.authService = {
    register: async ({ email, password }) => {
        const existing = await user_model_1.User.findOne({ email });
        if (existing)
            throw new Error('Email already registered');
        const hash = await bcryptjs_1.default.hash(password, 10);
        // Force role to 'merchant' for public registration
        const user = await user_model_1.User.create({ email, password: hash, role: 'merchant' });
        return user;
    },
    login: async ({ email, password }) => {
        const user = await user_model_1.User.findOne({ email });
        if (!user)
            throw new Error('Invalid credentials');
        const ok = await bcryptjs_1.default.compare(password, user.password);
        if (!ok)
            throw new Error('Invalid credentials');
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role, email: user.email }, jwt_1.jwtSecret, {
            expiresIn: jwt_1.jwtExpiresIn,
        });
        return token;
    },
};
//# sourceMappingURL=auth.service.js.map