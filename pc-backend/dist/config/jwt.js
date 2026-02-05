"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtExpiresIn = exports.jwtSecret = void 0;
exports.jwtSecret = process.env.JWT_SECRET || 'changeme';
exports.jwtExpiresIn = '7d';
//# sourceMappingURL=jwt.js.map