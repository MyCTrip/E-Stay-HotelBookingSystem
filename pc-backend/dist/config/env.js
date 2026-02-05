"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.isProduction = void 0;
exports.isProduction = process.env.NODE_ENV === 'production';
exports.port = process.env.PORT ? Number(process.env.PORT) : 3000;
//# sourceMappingURL=env.js.map