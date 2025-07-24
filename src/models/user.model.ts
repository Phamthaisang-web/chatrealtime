import { model, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  phone?: string;

  isActive: boolean;
  isVerified: boolean;
  dateOfBirth?: Date; // ➕ Thêm ngày sinh
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    lastName: { type: String, required: true, trim: true, maxLength: 255 },
    firstName: { type: String, required: true, trim: true, maxLength: 255 },
    dateOfBirth: { type: Date },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid email!`,
      },
    },
    password: { type: String, required: true, maxLength: 255 },
    phone: { type: String, maxLength: 20 },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "users",
  }
);

// Hash password trước khi lưu
userSchema.pre("save", async function (next) {
  const user = this as IUser;

  if (!user.isModified("password")) return next();

  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  next();
});

// Thêm phương thức comparePassword
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as IUser;
  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

export default model<IUser>("User", userSchema);
