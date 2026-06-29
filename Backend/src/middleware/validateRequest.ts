import { type RequestHandler } from "express";
import { type ZodType, ZodError } from "zod";

type RequestValidationSchema = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

export const validateRequest =
  (schema: RequestValidationSchema): RequestHandler =>
  (req, res, next) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      if (schema.params) {
        req.params = schema.params.parse(req.params) as typeof req.params;
      }

      if (schema.query) {
        req.query = schema.query.parse(req.query) as typeof req.query;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Validation failed",
          issues: error.issues,
        });
        return;
      }

      next(error);
    }
  };
