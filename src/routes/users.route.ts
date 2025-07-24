import usersController from "../controllers/users.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import validateSchemaYup from "../middlewares/validate.middleware";
import usersValidation from "../validations/users.validation";
import express from "express";

const router = express.Router();

router.get(
  "/users",
  validateSchemaYup(usersValidation.getAllUsersSchema),
  usersController.getAllUsers
);

router.get(
  "/users/:id",
  validateSchemaYup(usersValidation.getUserByIdSchema),
  usersController.getByID
);

router.delete(
  "/users/:id",
  validateSchemaYup(usersValidation.deleteUserByIdSchema),
  usersController.deleteUser
);

// ✅ Gửi OTP tới email để tạo tài khoản
router.post(
  "/users/request-otp",
  validateSchemaYup(usersValidation.requestOtpSchema),
  usersController.requestOtp
);

// ✅ Xác minh OTP và tạo tài khoản
router.post(
  "/users/verify-otp",
  validateSchemaYup(usersValidation.verifyOtpSchema),
  usersController.verifyOtp
);
router.put(
  "/user/:id",
  validateSchemaYup(usersValidation.getUserByIdSchema),
  usersController.update
);
router.put("/users/me", authenticateToken, usersController.updateMe);

// ✅ Route xoá chính mình (nếu có)
router.delete("/users/me", authenticateToken, usersController.deleteMe);

// ✅ Thêm route đổi mật khẩu
router.put(
  "/users/change-password",
  authenticateToken,

  usersController.changePassword
);
router.post("/forgot-password", usersController.requestResetPassword);
router.post("/reset-password", usersController.resetPassword);

export default router;
