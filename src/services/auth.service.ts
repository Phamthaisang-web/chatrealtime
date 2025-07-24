import bcrypt from "bcrypt";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model";
import { env } from "../helpers/env.helper";
import { Response } from "express";

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  //logic đăng nhập
  //Kiểm tra email có tồn tại không
  const user = await userModel.findOne({
    email,
    isActive: true, //chỉ cho phép acc có trạng thái active mới đc login
  });
  if (!user) {
    //Báo lỗi chung chung
    //Lí do để hacker biết email đúng hay sai
    throw createError(400, "Email or password is invalid");
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
  const isValid = await bcrypt.compare(password, passwordHash); // true
  if (!isValid) {
    //Đừng thông báo: Sai mật mật khẩu. Hãy thông báo chung chung
    throw createError(400, "Invalid email or password");
  }

  //login thành công
  //Tạo token
  const accessToken = jwt.sign(
    { _id: user._id, email: user.email },
    env.JWT_SECRET as string,
    {
      expiresIn: "24h", // expires in 24 hours (24 x 60 x 60)
    }
  );

  const refreshToken = jwt.sign(
    { _id: user._id, email: user.email },
    env.JWT_SECRET as string,
    {
      expiresIn: "365d", // expires in 24 hours (24 x 60 x 60)
    }
  );
  return {
    accessToken,
    refreshToken,
  };
};

const getProfile = async (res: Response) => {
  const { user } = res.locals;
  //return without password
  return user;
};

export default {
  login,
  getProfile,
};
