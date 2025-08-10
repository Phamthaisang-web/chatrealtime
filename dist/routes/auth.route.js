"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const auth_validation_1 = __importDefault(require("../validations/auth.validation"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post("/login", (0, validate_middleware_1.default)(auth_validation_1.default.loginSchema), auth_controller_1.default.login);
router.get("/get-profile", auth_middleware_1.authenticateToken, auth_controller_1.default.getProfile);
exports.default = router;
//# sourceMappingURL=auth.route.js.map