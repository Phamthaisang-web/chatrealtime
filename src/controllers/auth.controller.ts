import { NextFunction, Request, Response } from "express";
import authService from "../services/auth.service";
import { sendJsonSuccess } from "../helpers/response.helper";
import createHttpError from "http-errors";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokens = await authService.login({
      email: req.body.email,
      password: req.body.password,
    });
    sendJsonSuccess(res, tokens);
  } catch (error) {
    next(error);
  }
}; // auth.controller.ts
const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getProfile(res); // ✅ truyền đúng
    sendJsonSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

export default {
  login,
  getProfile,
};
