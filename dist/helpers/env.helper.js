"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDevMode = exports.env = void 0;
exports.loadEnvConfig = loadEnvConfig;
const dotenv_1 = __importDefault(require("dotenv"));
const yup = __importStar(require("yup"));
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
function loadEnvConfig() {
    // Load .env file
    dotenv_1.default.config();
    try {
        // Validate environment variables
        const parsedEnv = EnvSchema.validateSync(process.env, {
            abortEarly: false,
        });
        console.log("✅ Environment variables loaded successfully");
        return parsedEnv;
    }
    catch (error) {
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
exports.env = loadEnvConfig();
exports.isDevMode = exports.env.NODE_ENV === "development";
//# sourceMappingURL=env.helper.js.map