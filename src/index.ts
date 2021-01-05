import { NextFunction, ErrorRequestHandler } from 'express';
import { StatusCodes, getReasonPhrase } from "http-status-codes";
export interface HttpError extends Error {
  statusCode?: StatusCodes;
};

export interface ErrorResponse {
  message: string;
  stacktrace?: string;
};

export const getErrorHandlerMiddleware: (log: (message: string) => void) => ErrorRequestHandler = (log) =>
   (
    err: HttpError,
    req,
    res,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
    ): void => {
    log(`${req.method} request to ${req.originalUrl}  has failed with error: ${err.message}`);
    const errorResponse: ErrorResponse = {
      message: err.message
    };
    const responseStatusCode = err.statusCode === undefined ? StatusCodes.INTERNAL_SERVER_ERROR : err.statusCode;

    if(responseStatusCode >= StatusCodes.INTERNAL_SERVER_ERROR) {
      if (process.env.NODE_ENV === 'production') {
        errorResponse.message = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);
      } else {
        errorResponse.stacktrace = err.stack;
      }
    }
    res.status(responseStatusCode).json(errorResponse);
  };
