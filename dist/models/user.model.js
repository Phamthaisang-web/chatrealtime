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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    lastName: { type: String, required: true, trim: true, maxLength: 255 },
    firstName: { type: String, required: true, trim: true, maxLength: 255 },
    dateOfBirth: { type: Date },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email!`,
        },
    },
    password: { type: String, required: true, maxLength: 255 },
    phone: { type: String, maxLength: 20 },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false,
    collection: "users",
});
// Hash password trước khi lưu
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (!user.isModified("password"))
            return next();
        const hash = yield bcrypt_1.default.hash(user.password, 10);
        user.password = hash;
        next();
    });
});
// Thêm phương thức comparePassword
userSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        return bcrypt_1.default.compare(candidatePassword, user.password).catch((e) => false);
    });
};
exports.default = (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=user.model.js.map