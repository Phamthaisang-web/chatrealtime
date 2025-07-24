import dotenv from "dotenv";
import * as yup from "yup";

// Environment Variables Schema
const EnvSchema = yup.object().shape({
  NODE_ENV: yup
    .string()
    .required()
    .oneOf(["development", "production", "test"])
    .default("development"),
  PORT: yup.number().required().default(8080),
  MONGODB_URI: yup.string().required(),
  JWT_SECRET: yup.string().required().default("catFly200@smiles"),
  OPENAI_API_KEY: yup.string().required("OPENAI_API_KEY is required"),

  EMAIL_HOST: yup.string().required(),
  EMAIL_PORT: yup.number().required(),
  EMAIL_SSL: yup.boolean().required(),
  EMAIL_ACCOUNT: yup.string().required(),
  EMAIL_PASSWORD: yup.string().required(),
});

// Environment Configuration Helper
export function loadEnvConfig() {
  // Load .env file
  dotenv.config();

  try {
    // Validate environment variables
    const parsedEnv = EnvSchema.validateSync(process.env, {
      abortEarly: false,
    });

    console.log("✅ Environment variables loaded successfully");

    return parsedEnv;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      console.error("❌ Invalid environment configuration:");
      error.inner.forEach((err) => {
        console.error(`- ${err.path}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

// Usage example in server initialization
export const env = loadEnvConfig();

export const isDevMode = env.NODE_ENV === "development";
