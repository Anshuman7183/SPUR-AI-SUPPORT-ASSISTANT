import { type ErrorRequestHandler } from "express";

type HttpError = Error & {
  statusCode?: number;
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const httpError = error as HttpError;
  const statusCode = httpError.statusCode ?? 500;

  res.status(statusCode).json({
    message:
      statusCode === 500
        ? "Internal server error"
        : httpError.message || "Request failed",
  });
};
