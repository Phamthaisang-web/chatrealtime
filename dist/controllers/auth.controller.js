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
const auth_service_1 = __importDefault(require("../services/auth.service"));
const response_helper_1 = require("../helpers/response.helper");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokens = yield auth_service_1.default.login({
            email: req.body.email,
            password: req.body.password,
        });
        (0, response_helper_1.sendJsonSuccess)(res, tokens);
    }
    catch (error) {
        next(error);
    }
}); // auth.controller.ts
const getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield auth_service_1.default.getProfile(res); // ✅ truyền đúng
        (0, response_helper_1.sendJsonSuccess)(res, user);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    login,
    getProfile,
};
//# sourceMappingURL=auth.controller.js.map