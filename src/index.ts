import { NextFunction, ErrorRequestHandler } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

export interface HttpError extends Error {
  statusCode?: StatusCodes;
  status?: StatusCodes;
}

export interface ErrorResponse {
  message: string;
  stacktrace?: string;
}

export const getErrorHandlerMiddleware: () => ErrorRequestHandler = () => {
  const mapColoniesErrorExpressHandler: ErrorRequestHandler = (
    err: HttpError,
    req,
    res,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ): void => {
    const errorResponse: ErrorResponse = {
      message: err.message,
    };
    const responseStatusCode = err.statusCode ?? err.status ?? StatusCodes.INTERNAL_SERVER_ERROR;

    if (responseStatusCode >= StatusCodes.INTERNAL_SERVER_ERROR) {
      //@ts-ignore pino-http looks for this property for error info
      res.err = err;
      if (process.env.NODE_ENV === 'production') {
        errorResponse.message = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);
      } else {
        errorResponse.stacktrace = err.stack;
      }
    }
    res.status(responseStatusCode).json(errorResponse);
  };

  return mapColoniesErrorExpressHandler;
};
