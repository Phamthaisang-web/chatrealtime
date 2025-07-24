import { Request, Response, NextFunction } from "express";
import usersService from "../services/users.service";
import { httpStatus, sendJsonSuccess } from "../helpers/response.helper";
import createHttpError from "http-errors";

// Lấy danh sách tất cả người dùng
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await usersService.getAllUsers(req.query);
    sendJsonSuccess(res, users);
  } catch (error) {
    next(error);
  }
};

// Lấy người dùng theo ID
const getByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await usersService.getByID(id);
    sendJsonSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

// Tạo người dùng mới (không cần OTP)
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await usersService.create(req.body);
    sendJsonSuccess(
      res,
      user,
      httpStatus.CREATED.statusCode,
      httpStatus.CREATED.message
    );
  } catch (error) {
    next(error);
  }
};

// Cập nhật thông tin người dùng theo ID (admin hoặc staff)
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await usersService.update(id, req.body);
    sendJsonSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

// Cập nhật chính mình
const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.staff;
    if (!user || !user._id) throw createHttpError(401, "Not authenticated");

    const updatedUser = await usersService.update(user._id, req.body);
    sendJsonSuccess(res, updatedUser);
  } catch (error) {
    next(error);
  }
};

// Xoá chính mình
const deleteMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.staff;
    if (!user || !user._id) throw createHttpError(401, "Not authenticated");

    const deletedUser = await usersService.deleteUser(user._id);
    sendJsonSuccess(res, deletedUser);
  } catch (error) {
    next(error);
  }
};
const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.staff; // Hoặc res.locals.staff tùy thuộc vào cách bạn xác thực
    if (!user || !user._id) throw createHttpError(401, "Not authenticated");

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw createHttpError(
        400,
        "Current password and new password are required"
      );
    }

    const result = await usersService.changePassword(
      user._id,
      currentPassword,
      newPassword
    );
    sendJsonSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
// Xoá người dùng khác
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await usersService.deleteUser(id);
    sendJsonSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

// Gửi OTP tới email để xác minh
const requestOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await usersService.requestOtp(req.body);
    sendJsonSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

// Xác minh OTP và tạo người dùng thật
const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      throw createHttpError(400, "Email và mã OTP là bắt buộc");

    const result = await usersService.verifyOtp(email, otp);
    sendJsonSuccess(res, result, httpStatus.CREATED.statusCode);
  } catch (error) {
    next(error);
  }
};
const requestResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    if (!email) throw createHttpError(400, "Email là bắt buộc");

    const result = await usersService.requestResetPassword(email);
    sendJsonSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      throw createHttpError(400, "Email, OTP và mật khẩu mới là bắt buộc");
    }

    const result = await usersService.resetPassword(email, otp, newPassword);
    sendJsonSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export default {
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
