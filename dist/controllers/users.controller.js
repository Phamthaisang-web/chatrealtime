"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_service_1 = __importDefault(require("../services/users.service"));
const response_helper_1 = require("../helpers/response.helper");
const http_errors_1 = __importDefault(require("http-errors"));
// Lấy danh sách tất cả người dùng
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield users_service_1.default.getAllUsers(req.query);
        (0, response_helper_1.sendJsonSuccess)(res, users);
    }
    catch (error) {
        next(error);
    }
});
// Lấy người dùng theo ID
const getByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield users_service_1.default.getByID(id);
        (0, response_helper_1.sendJsonSuccess)(res, user);
    }
    catch (error) {
        next(error);
    }
});
// Tạo người dùng mới (không cần OTP)
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_service_1.default.create(req.body);
        (0, response_helper_1.sendJsonSuccess)(res, user, response_helper_1.httpStatus.CREATED.statusCode, response_helper_1.httpStatus.CREATED.message);
    }
    catch (error) {
        next(error);
    }
});
// Cập nhật thông tin người dùng theo ID (admin hoặc staff)
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield users_service_1.default.update(id, req.body);
        (0, response_helper_1.sendJsonSuccess)(res, user);
    }
    catch (error) {
        next(error);
    }
});
// Cập nhật chính mình
const updateMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = res.locals.staff;
        if (!user || !user._id)
            throw (0, http_errors_1.default)(401, "Not authenticated");
        const updatedUser = yield users_service_1.default.update(user._id, req.body);
        (0, response_helper_1.sendJsonSuccess)(res, updatedUser);
    }
    catch (error) {
        next(error);
    }
});
// Xoá chính mình
const deleteMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = res.locals.staff;
        if (!user || !user._id)
            throw (0, http_errors_1.default)(401, "Not authenticated");
        const deletedUser = yield users_service_1.default.deleteUser(user._id);
        (0, response_helper_1.sendJsonSuccess)(res, deletedUser);
    }
    catch (error) {
        next(error);
    }
});
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = res.locals.staff; // Hoặc res.locals.staff tùy thuộc vào cách bạn xác thực
        if (!user || !user._id)
            throw (0, http_errors_1.default)(401, "Not authenticated");
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            throw (0, http_errors_1.default)(400, "Current password and new password are required");
        }
        const result = yield users_service_1.default.changePassword(user._id, currentPassword, newPassword);
        (0, response_helper_1.sendJsonSuccess)(res, result);
    }
    catch (error) {
        next(error);
    }
});
// Xoá người dùng khác
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield users_service_1.default.deleteUser(id);
        (0, response_helper_1.sendJsonSuccess)(res, user);
    }
    catch (error) {
        next(error);
    }
});
// Gửi OTP tới email để xác minh
const requestOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield users_service_1.default.requestOtp(req.body);
        (0, response_helper_1.sendJsonSuccess)(res, result);
    }
    catch (error) {
        next(error);
    }
});
// Xác minh OTP và tạo người dùng thật
const verifyOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        if (!email || !otp)
            throw (0, http_errors_1.default)(400, "Email và mã OTP là bắt buộc");
        const result = yield users_service_1.default.verifyOtp(email, otp);
        (0, response_helper_1.sendJsonSuccess)(res, result, response_helper_1.httpStatus.CREATED.statusCode);
    }
    catch (error) {
        next(error);
    }
});
const requestResetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email)
            throw (0, http_errors_1.default)(400, "Email là bắt buộc");
        const result = yield users_service_1.default.requestResetPassword(email);
        (0, response_helper_1.sendJsonSuccess)(res, result);
    }
    catch (error) {
        next(error);
    }
});
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            throw (0, http_errors_1.default)(400, "Email, OTP và mật khẩu mới là bắt buộc");
        }
        const result = yield users_service_1.default.resetPassword(email, otp, newPassword);
        (0, response_helper_1.sendJsonSuccess)(res, result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getAllUsers,
    getByID,
    create,
    update,
    updateMe,
    deleteMe,
    deleteUser,
    requestOtp,
    verifyOtp,
    changePassword,
    requestResetPassword, // ✅ mới
    resetPassword,
};
//# sourceMappingURL=users.controller.js.map