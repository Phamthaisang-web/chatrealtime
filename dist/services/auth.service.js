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
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const env_helper_1 = require("../helpers/env.helper");
const login = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password, }) {
    //logic đăng nhập
    //Kiểm tra email có tồn tại không
    const user = yield user_model_1.default.findOne({
        email,
        isActive: true, //chỉ cho phép acc có trạng thái active mới đc login
    });
    if (!user) {
        //Báo lỗi chung chung
        //Lí do để hacker biết email đúng hay sai
        throw (0, http_errors_1.default)(400, "Email or password is invalid");
    }
    console.log("Client password:", password);
    console.log("Hash in DB:", user.password);
    //Kiểm tra mật khẩu
    //nếu mật khâu chưa được mã hóa
    // if(user.password !== password){
    //     throw createError(400, 'Email or password is invalid');
    // }
    //Sử dụng hàm so sánh mật khẩu đã được mã hóa
    const passwordHash = user.password;
    const isValid = yield bcrypt_1.default.compare(password, passwordHash); // true
    if (!isValid) {
        //Đừng thông báo: Sai mật mật khẩu. Hãy thông báo chung chung
        throw (0, http_errors_1.default)(400, "Invalid email or password");
    }
    //login thành công
    //Tạo token
    const accessToken = jsonwebtoken_1.default.sign({ _id: user._id, email: user.email }, env_helper_1.env.JWT_SECRET, {
        expiresIn: "24h", // expires in 24 hours (24 x 60 x 60)
    });
    const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id, email: user.email }, env_helper_1.env.JWT_SECRET, {
        expiresIn: "365d", // expires in 24 hours (24 x 60 x 60)
    });
    return {
        accessToken,
        refreshToken,
    };
});
const getProfile = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    //return without password
    return user;
});
exports.default = {
    login,
    getProfile,
};
//# sourceMappingURL=auth.service.js.map