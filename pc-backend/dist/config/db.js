"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/estay';
mongoose_1.default.set('strictQuery', true);
mongoose_1.default
    .connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
//# sourceMappingURL=db.js.map