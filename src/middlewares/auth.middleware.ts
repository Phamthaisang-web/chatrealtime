import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import userModel from "../models/user.model";
import { env } from "../helpers/env.helper";

interface decodedJWT extends JwtPayload {
  _id?: string;
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //Get the jwt token from the head
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  //If token is not valid, respond with 401 (unauthorized)
  if (!token) {
    return next(createError(401, "Unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET as string) as decodedJWT;
    //try verify user exits in database
    const user = await userModel
      .findOne({
        _id: decoded._id,
      })
      .select("-password -__v");

    if (!user) {
      return next(createError(401, "Unauthorized"));
    }
    //Đăng ký biến user global trong app
    res.locals.user = user;

    next();
  } catch (err) {
    return next(createError(401, "Forbidden"));
  }
};
export default {
  authenticateToken,
};
