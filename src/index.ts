import { NextFunction, ErrorRequestHandler } from 'express';
import { StatusCodes, getReasonPhrase } from "http-status-codes";
export interface HttpError extends Error {
  statusCode?: StatusCodes;
};

export interface ErrorResponse {
  statusCode: StatusCodes;
  message: string;
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
    if (err.statusCode) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }
    if(process.env.NODE_ENV === 'production') {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
      return;
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
  };
