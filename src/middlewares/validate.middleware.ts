import { AnySchema, ValidationError } from "yup";
import { NextFunction, Request, Response } from "express";

const validateSchemaYup =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.validate(
        {
          body: req.body,
          query: req.query,
          params: req.params,
        },
        {
          abortEarly: false,
          stripUnknown: true,
        }
      );

      next();
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).json({
          statusCode: 400,
          message: err.errors, // ✅ Hợp lệ: `errors` có thật trong ValidationError
          typeError: "validateSchema",
        });
      } else {
        next(err); // Nếu không phải lỗi validation thì chuyển tiếp
      }
    }
  };

export default validateSchemaYup;
