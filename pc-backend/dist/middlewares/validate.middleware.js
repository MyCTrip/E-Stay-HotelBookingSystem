"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (err) {
            console.error('Validation error:', err);
            return res.status(400).json({ message: err.errors?.[0]?.message || err.message });
        }
    };
};
exports.validateBody = validateBody;
//# sourceMappingURL=validate.middleware.js.map