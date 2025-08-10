"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_controller_1 = __importDefault(require("../controllers/users.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const users_validation_1 = __importDefault(require("../validations/users.validation"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/users", (0, validate_middleware_1.default)(users_validation_1.default.getAllUsersSchema), users_controller_1.default.getAllUsers);
router.get("/users/:id", (0, validate_middleware_1.default)(users_validation_1.default.getUserByIdSchema), users_controller_1.default.getByID);
router.delete("/users/:id", (0, validate_middleware_1.default)(users_validation_1.default.deleteUserByIdSchema), users_controller_1.default.deleteUser);
// ✅ Gửi OTP tới email để tạo tài khoản
router.post("/users/request-otp", (0, validate_middleware_1.default)(users_validation_1.default.requestOtpSchema), users_controller_1.default.requestOtp);
// ✅ Xác minh OTP và tạo tài khoản
router.post("/users/verify-otp", (0, validate_middleware_1.default)(users_validation_1.default.verifyOtpSchema), users_controller_1.default.verifyOtp);
router.put("/user/:id", (0, validate_middleware_1.default)(users_validation_1.default.getUserByIdSchema), users_controller_1.default.update);
router.put("/users/me", auth_middleware_1.authenticateToken, users_controller_1.default.updateMe);
// ✅ Route xoá chính mình (nếu có)
router.delete("/users/me", auth_middleware_1.authenticateToken, users_controller_1.default.deleteMe);
// ✅ Thêm route đổi mật khẩu
router.put("/users/change-password", auth_middleware_1.authenticateToken, users_controller_1.default.changePassword);
router.post("/forgot-password", users_controller_1.default.requestResetPassword);
router.post("/reset-password", users_controller_1.default.resetPassword);
exports.default = router;
//# sourceMappingURL=users.route.js.map