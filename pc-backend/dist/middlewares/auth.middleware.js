"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../config/jwt");
const user_model_1 = require("../modules/user/user.model");
const authenticate = async (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth)
        return res.status(401).json({ message: 'Unauthorized' });
    const token = auth.split(' ')[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, jwt_1.jwtSecret);
        // Fetch fresh user from DB and attach (without password)
        const user = await user_model_1.User.findById(payload.id).select('-password');
        if (!user)
            return res.status(401).json({ message: 'Unauthorized' });
        if (user.status !== 'active')
            return res.status(403).json({ message: 'Account disabled' });
        req.user = { id: user._id.toString(), email: user.email, role: user.role, createdAt: user.createdAt, updatedAt: user.updatedAt };
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.middleware.js.map