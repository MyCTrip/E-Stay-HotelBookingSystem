"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const requireRole = (roles) => {
    const allowed = Array.isArray(roles) ? roles : [roles];
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        if (!allowed.includes(req.user.role))
            return res.status(403).json({ message: 'Forbidden' });
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=role.middleware.js.map