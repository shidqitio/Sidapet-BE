import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { errorLogger } from "@config/logger";
import { httpCode } from "@utils/prefix";

export interface IErrorResponse {
  code: number;
  status?: string;
  message: string;
}

export default class CustomError extends Error implements IErrorResponse {
  readonly status: string;

  constructor(public code: number, status : string, public message: string) {
    super(message);

    this.code = code;

    this.status = status;

    this.message = message;
  }
}

export const errorhandler = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  errorLogger.error(error);

  if (error instanceof CustomError) {
    return res.status(error.code).json({
      code: error.code,
      status: error.status,
      message: error.message,
    });
  } else if (
    error instanceof multer.MulterError &&
    error.code === "LIMIT_FILE_SIZE"
  ) {
    return res.status(httpCode.badRequest).json({
      code: httpCode.badRequest,
      status: "error",
      message: "Ukuran file maksimal 2mb",
    });
  } else {
    return res
      .status(httpCode.internalServerError)
      .json({
        code: httpCode.internalServerError,
        status: "error",
        message: error.message,
      });
  }
};
