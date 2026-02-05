"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.register = void 0;
const auth_service_1 = require("./auth.service");
const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await auth_service_1.authService.register({ email, password });
        res.status(201).json({ id: user._id, email: user.email });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await auth_service_1.authService.login({ email, password });
        res.status(200).json({ token });
    }
    catch (err) {
        res.status(401).json({ message: err.message });
    }
};
exports.login = login;
const me = async (req, res) => {
    const user = req.user;
    if (!user)
        return res.status(401).json({ message: 'Unauthorized' });
    res.json({ id: user.id || user._id, email: user.email, role: user.role });
};
exports.me = me;
//# sourceMappingURL=auth.controller.js.map