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
Object.defineProperty(exports, "__esModule", { value: true });
const yup_1 = require("yup");
const validateSchemaYup = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
        }, {
            abortEarly: false,
            stripUnknown: true,
        });
        next();
    }
    catch (err) {
        if (err instanceof yup_1.ValidationError) {
            res.status(400).json({
                statusCode: 400,
                message: err.errors, // ✅ Hợp lệ: `errors` có thật trong ValidationError
                typeError: "validateSchema",
            });
        }
        else {
            next(err); // Nếu không phải lỗi validation thì chuyển tiếp
        }
    }
});
exports.default = validateSchemaYup;
//# sourceMappingURL=validate.middleware.js.map