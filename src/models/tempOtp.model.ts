import { model, Schema, Document } from "mongoose";

export interface ITempUser extends Document {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  phone?: string;

  isActive: boolean;
  isVerified: boolean;
  dateOfBirth?: Date;
  verificationCode: string;
  verificationCodeExpires: Date;
}

const tempUserSchema = new Schema<ITempUser>(
  {
    lastName: { type: String, required: true, trim: true, maxLength: 255 },
    firstName: { type: String, required: true, trim: true, maxLength: 255 },
    dateOfBirth: { type: Date },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    verificationCode: { type: String, required: true },
    verificationCodeExpires: { type: Date, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "temp_users",
  }
);

export default model<ITempUser>("TempUser", tempUserSchema);
