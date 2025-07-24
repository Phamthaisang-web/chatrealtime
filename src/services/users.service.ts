import userModel from "../models/user.model";
import tempUserModel from "../models/tempOtp.model";
import nodemailer from "nodemailer";
import { env } from "../helpers/env.helper";
import createHttpError from "http-errors";

// Lấy danh sách user với phân trang và lọc
const getAllUsers = async (query: any) => {
  const { page = 1, limit = 10 } = query;
  let sortObject = {};
  const sortType = query.sort_type || "desc";
  const sortBy = query.sort_by || "createdAt";
  sortObject = { ...sortObject, [sortBy]: sortType === "desc" ? -1 : 1 };

  let where: any = {};
  if (query.fullName?.trim()) {
    where.fullName = { $regex: query.fullName.trim(), $options: "i" };
  }
  if (query.email?.trim()) {
    where.email = query.email.trim();
  }

  const users = await userModel
    .find(where)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sortObject);

  const count = await userModel.countDocuments(where);

  return {
    users,
    pagination: {
      totalRecord: count,
      limit,
      page,
    },
  };
};

// Lấy user theo ID
const getByID = async (id: string) => {
  const user = await userModel.findById(id);
  if (!user) throw createHttpError(404, "Không tìm thấy người dùng");
  return user;
};

// Tạo mã OTP ngẫu nhiên
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Gửi OTP qua email và lưu thông tin tạm thời
const requestOtp = async (userData: any) => {
  if (!userData.email || typeof userData.email !== "string") {
    throw createHttpError(400, "Email là bắt buộc và phải là chuỗi ký tự");
  }

  const existing = await userModel.findOne({ email: userData.email });
  if (existing) throw createHttpError(409, "Email đã được sử dụng");

  const otpCode = generateVerificationCode();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

  const transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: env.EMAIL_SSL,
    service: "gmail",
    auth: {
      user: env.EMAIL_ACCOUNT,
      pass: env.EMAIL_PASSWORD,
    },
  } as nodemailer.TransportOptions);

  const mailOptions = {
    from: env.EMAIL_ACCOUNT,
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
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw createHttpError(
      500,
      "Không thể gửi email xác minh. Vui lòng kiểm tra lại địa chỉ email."
    );
  }

  await tempUserModel.findOneAndUpdate(
    { email: userData.email },
    {
      ...userData,
      verificationCode: otpCode,
      verificationCodeExpires: otpExpires,
    },
    { upsert: true, new: true }
  );

  return { message: "OTP đã được gửi đến email của bạn" };
};

// Xác minh OTP và tạo người dùng thật
const verifyOtp = async (email: string, otp: string) => {
  const temp = await tempUserModel.findOne({ email });

  if (!temp) throw createHttpError(404, "Không tìm thấy yêu cầu xác minh");
  if (temp.verificationCode !== otp)
    throw createHttpError(400, "Mã xác minh không đúng");
  if (new Date() > temp.verificationCodeExpires)
    throw createHttpError(400, "Mã xác minh đã hết hạn");

  const newUser = await create({
    firstName: temp.firstName,
    lastName: temp.lastName,
    dateOfBirth: temp.dateOfBirth,
    email: temp.email,
    phone: temp.phone,
    password: temp.password,

    isVerified: true,
  });

  await tempUserModel.deleteOne({ email });

  return newUser;
};

// Tạo user trực tiếp (dùng riêng nếu không cần OTP)
const create = async (userData: any) => {
  if (!userData.email || typeof userData.email !== "string") {
    throw createHttpError(400, "Email là bắt buộc và phải là chuỗi ký tự");
  }

  const existing = await userModel.findOne({ email: userData.email });
  if (existing) {
    throw createHttpError(409, "Email đã được sử dụng");
  }

  const newUser = new userModel(userData);
  await newUser.save();
  return newUser;
};

// Cập nhật user theo ID
const update = async (id: string, userData: any) => {
  const user = await userModel.findByIdAndUpdate(id, userData, { new: true });
  if (!user) throw createHttpError(404, "Không tìm thấy người dùng");
  return user;
};
// Thêm vào user.service.ts
const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await userModel.findById(userId);
  if (!user) throw createHttpError(404, "Không tìm thấy người dùng");

  // Kiểm tra mật khẩu hiện tại
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw createHttpError(400, "Mật khẩu hiện tại không đúng");

  // Cập nhật mật khẩu mới (đã được hash tự động trong pre-save hook của model)
  user.password = newPassword;
  await user.save();

  return { message: "Đổi mật khẩu thành công" };
};
// Xóa user theo ID
const deleteUser = async (id: string) => {
  const user = await userModel.findByIdAndDelete(id);
  if (!user) throw createHttpError(404, "Không tìm thấy người dùng");
  return user;
};
const requestResetPassword = async (email: string) => {
  const user = await userModel.findOne({ email });
  if (!user) throw createHttpError(404, "Email không tồn tại trong hệ thống");

  const otpCode = generateVerificationCode();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

  const transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: env.EMAIL_SSL,
    service: "gmail",
    auth: {
      user: env.EMAIL_ACCOUNT,
      pass: env.EMAIL_PASSWORD,
    },
  } as nodemailer.TransportOptions);

  const mailOptions = {
    from: env.EMAIL_ACCOUNT,
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
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw createHttpError(500, "Không thể gửi email. Vui lòng thử lại.");
  }

  await tempUserModel.findOneAndUpdate(
    { email },
    {
      email,
      verificationCode: otpCode,
      verificationCodeExpires: otpExpires,
    },
    { upsert: true, new: true }
  );

  return { message: "Mã đặt lại mật khẩu đã được gửi qua email" };
};
const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const temp = await tempUserModel.findOne({ email });
  if (!temp)
    throw createHttpError(404, "Không tìm thấy yêu cầu đặt lại mật khẩu");

  if (temp.verificationCode !== otp) {
    throw createHttpError(400, "Mã OTP không đúng");
  }

  if (new Date() > temp.verificationCodeExpires) {
    throw createHttpError(400, "Mã OTP đã hết hạn");
  }

  const user = await userModel.findOne({ email });
  if (!user) throw createHttpError(404, "Không tìm thấy người dùng");

  user.password = newPassword;
  await user.save();

  await tempUserModel.deleteOne({ email });

  return { message: "Mật khẩu đã được đặt lại thành công" };
};

export default {
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
