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
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
const user_model_1 = __importDefault(require("../models/user.model"));
const env_helper_1 = require("../helpers/env.helper");
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //Get the jwt token from the head
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    //If token is not valid, respond with 401 (unauthorized)
    if (!token) {
        return next((0, http_errors_1.default)(401, "Unauthorized"));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_helper_1.env.JWT_SECRET);
        //try verify user exits in database
        const user = yield user_model_1.default
            .findOne({
            _id: decoded._id,
        })
            .select("-password -__v");
        if (!user) {
            return next((0, http_errors_1.default)(401, "Unauthorized"));
        }
        //Đăng ký biến user global trong app
        res.locals.user = user;
        next();
    }
    catch (err) {
        return next((0, http_errors_1.default)(401, "Forbidden"));
    }
});
exports.authenticateToken = authenticateToken;
exports.default = {
    authenticateToken: exports.authenticateToken,
};
//# sourceMappingURL=auth.middleware.js.map