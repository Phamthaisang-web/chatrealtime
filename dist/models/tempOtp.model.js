"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tempUserSchema = new mongoose_1.Schema({
    lastName: { type: String, required: true, trim: true, maxLength: 255 },
    firstName: { type: String, required: true, trim: true, maxLength: 255 },
    dateOfBirth: { type: Date },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    verificationCode: { type: String, required: true },
    verificationCodeExpires: { type: Date, required: true },
}, {
    timestamps: true,
    versionKey: false,
    collection: "temp_users",
});
exports.default = (0, mongoose_1.model)("TempUser", tempUserSchema);
//# sourceMappingURL=tempOtp.model.js.map