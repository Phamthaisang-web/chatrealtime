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
const user_model_1 = __importDefault(require("../models/user.model"));
const tempOtp_model_1 = __importDefault(require("../models/tempOtp.model"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_helper_1 = require("../helpers/env.helper");
const http_errors_1 = __importDefault(require("http-errors"));
// Lấy danh sách user với phân trang và lọc
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { page = 1, limit = 10 } = query;
    let sortObject = {};
    const sortType = query.sort_type || "desc";
    const sortBy = query.sort_by || "createdAt";
    sortObject = Object.assign(Object.assign({}, sortObject), { [sortBy]: sortType === "desc" ? -1 : 1 });
    let where = {};
    if ((_a = query.fullName) === null || _a === void 0 ? void 0 : _a.trim()) {
        where.fullName = { $regex: query.fullName.trim(), $options: "i" };
    }
    if ((_b = query.email) === null || _b === void 0 ? void 0 : _b.trim()) {
        where.email = query.email.trim();
    }
    const users = yield user_model_1.default
        .find(where)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sortObject);
    const count = yield user_model_1.default.countDocuments(where);
    return {
        users,
        pagination: {
            totalRecord: count,
            limit,
            page,
        },
    };
});
// Lấy user theo ID
const getByID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(id);
    if (!user)
        throw (0, http_errors_1.default)(404, "Không tìm thấy người dùng");
    return user;
});
// Tạo mã OTP ngẫu nhiên
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
// Gửi OTP qua email và lưu thông tin tạm thời
const requestOtp = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userData.email || typeof userData.email !== "string") {
        throw (0, http_errors_1.default)(400, "Email là bắt buộc và phải là chuỗi ký tự");
    }
    const existing = yield user_model_1.default.findOne({ email: userData.email });
    if (existing)
        throw (0, http_errors_1.default)(409, "Email đã được sử dụng");
    const otpCode = generateVerificationCode();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 phút
    const transporter = nodemailer_1.default.createTransport({
        host: env_helper_1.env.EMAIL_HOST,
        port: env_helper_1.env.EMAIL_PORT,
        secure: env_helper_1.env.EMAIL_SSL,
        service: "gmail",
        auth: {
            user: env_helper_1.env.EMAIL_ACCOUNT,
            pass: env_helper_1.env.EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: env_helper_1.env.EMAIL_ACCOUNT,
        to: userData.email,
        subject: "Xác minh tài khoản - LUXURY FASHION",
        html: `
      <p>Xin chào <strong>${userData.fullName || "bạn"}</strong>,</p>
      <p>Mã xác minh tài khoản của bạn là:</p>
      <h2>${otpCode}</h2>
      <p>Mã này có hiệu lực trong 10 phút.</p>
    `,
    };
    try {
        yield transporter.sendMail(mailOptions);
    }
    catch (err) {
        throw (0, http_errors_1.default)(500, "Không thể gửi email xác minh. Vui lòng kiểm tra lại địa chỉ email.");
    }
    yield tempOtp_model_1.default.findOneAndUpdate({ email: userData.email }, Object.assign(Object.assign({}, userData), { verificationCode: otpCode, verificationCodeExpires: otpExpires }), { upsert: true, new: true });
    return { message: "OTP đã được gửi đến email của bạn" };
});
// Xác minh OTP và tạo người dùng thật
const verifyOtp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const temp = yield tempOtp_model_1.default.findOne({ email });
    if (!temp)
        throw (0, http_errors_1.default)(404, "Không tìm thấy yêu cầu xác minh");
    if (temp.verificationCode !== otp)
        throw (0, http_errors_1.default)(400, "Mã xác minh không đúng");
    if (new Date() > temp.verificationCodeExpires)
        throw (0, http_errors_1.default)(400, "Mã xác minh đã hết hạn");
    const newUser = yield create({
        firstName: temp.firstName,
        lastName: temp.lastName,
        dateOfBirth: temp.dateOfBirth,
        email: temp.email,
        phone: temp.phone,
        password: temp.password,
        isVerified: true,
    });
    yield tempOtp_model_1.default.deleteOne({ email });
    return newUser;
});
// Tạo user trực tiếp (dùng riêng nếu không cần OTP)
const create = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userData.email || typeof userData.email !== "string") {
        throw (0, http_errors_1.default)(400, "Email là bắt buộc và phải là chuỗi ký tự");
    }
    const existing = yield user_model_1.default.findOne({ email: userData.email });
    if (existing) {
        throw (0, http_errors_1.default)(409, "Email đã được sử dụng");
    }
    const newUser = new user_model_1.default(userData);
    yield newUser.save();
    return newUser;
});
// Cập nhật user theo ID
const update = (id, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findByIdAndUpdate(id, userData, { new: true });
    if (!user)
        throw (0, http_errors_1.default)(404, "Không tìm thấy người dùng");
    return user;
});
// Thêm vào user.service.ts
const changePassword = (userId, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId);
    if (!user)
        throw (0, http_errors_1.default)(404, "Không tìm thấy người dùng");
    // Kiểm tra mật khẩu hiện tại
    const isMatch = yield user.comparePassword(currentPassword);
    if (!isMatch)
        throw (0, http_errors_1.default)(400, "Mật khẩu hiện tại không đúng");
    // Cập nhật mật khẩu mới (đã được hash tự động trong pre-save hook của model)
    user.password = newPassword;
    yield user.save();
    return { message: "Đổi mật khẩu thành công" };
});
// Xóa user theo ID
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findByIdAndDelete(id);
    if (!user)
        throw (0, http_errors_1.default)(404, "Không tìm thấy người dùng");
    return user;
});
const requestResetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email });
    if (!user)
        throw (0, http_errors_1.default)(404, "Email không tồn tại trong hệ thống");
    const otpCode = generateVerificationCode();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 phút
    const transporter = nodemailer_1.default.createTransport({
        host: env_helper_1.env.EMAIL_HOST,
        port: env_helper_1.env.EMAIL_PORT,
        secure: env_helper_1.env.EMAIL_SSL,
        service: "gmail",
        auth: {
            user: env_helper_1.env.EMAIL_ACCOUNT,
            pass: env_helper_1.env.EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: env_helper_1.env.EMAIL_ACCOUNT,
        to: email,
        subject: "Yêu cầu đặt lại mật khẩu - LUXURY FASHION",
        html: `
      <p>Xin chào,</p>
      <p>Bạn đã yêu cầu đặt lại mật khẩu. Mã xác minh của bạn là:</p>
      <h2>${otpCode}</h2>
      <p>Mã này sẽ hết hạn sau 10 phút.</p>
    `,
    };
    try {
        yield transporter.sendMail(mailOptions);
    }
    catch (err) {
        throw (0, http_errors_1.default)(500, "Không thể gửi email. Vui lòng thử lại.");
    }
    yield tempOtp_model_1.default.findOneAndUpdate({ email }, {
        email,
        verificationCode: otpCode,
        verificationCodeExpires: otpExpires,
    }, { upsert: true, new: true });
    return { message: "Mã đặt lại mật khẩu đã được gửi qua email" };
});
const resetPassword = (email, otp, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const temp = yield tempOtp_model_1.default.findOne({ email });
    if (!temp)
        throw (0, http_errors_1.default)(404, "Không tìm thấy yêu cầu đặt lại mật khẩu");
    if (temp.verificationCode !== otp) {
        throw (0, http_errors_1.default)(400, "Mã OTP không đúng");
    }
    if (new Date() > temp.verificationCodeExpires) {
        throw (0, http_errors_1.default)(400, "Mã OTP đã hết hạn");
    }
    const user = yield user_model_1.default.findOne({ email });
    if (!user)
        throw (0, http_errors_1.default)(404, "Không tìm thấy người dùng");
    user.password = newPassword;
    yield user.save();
    yield tempOtp_model_1.default.deleteOne({ email });
    return { message: "Mật khẩu đã được đặt lại thành công" };
});
exports.default = {
    getAllUsers,
    getByID,
    requestOtp,
    verifyOtp,
    create,
    update,
    deleteUser,
    changePassword,
    requestResetPassword,
    resetPassword,
};
//# sourceMappingURL=users.service.js.map