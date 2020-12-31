import * as express from "express"; 
import { Application, NextFunction } from 'express';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import * as supertest from 'supertest';

import { getErrorHandlerMiddleware, HttpError } from '../../src/index';
describe('#getErrorHandlerMiddleware', function () {
  let expressApp: Application;
  let logFn: jest.Mock;
  let errorFn: jest.Mock;
  
  beforeAll(function() {
    logFn = jest.fn();
    errorFn = jest.fn();
    expressApp = express();
    expressApp.use('/avi', errorFn);
    expressApp.use(getErrorHandlerMiddleware(logFn));
  });
  describe('production', function() {
    beforeAll(function() {
      process.env.NODE_ENV = 'production';
    });
    describe('Errors with statusCode', function() {
      it('for non 500 requests return the info and status code', async function () {
        errorFn.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
          const error: HttpError = new Error('meow');
          error.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
          return next(error);
        });
        const response = await supertest.agent(expressApp).get('/avi');
        expect(response).toHaveProperty('body.message', 'meow');
        expect(response.status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
      });
      it('for 500 requests return the info and status code', async function () {
        errorFn.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
          const error: HttpError = new Error('meow');
          error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
          return next(error);
        });
        const response = await supertest.agent(expressApp).get('/avi');
        expect(response).toHaveProperty('body.message', getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
        expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      });
    });
  });
  describe('non_production', function() {
    beforeAll(function() {
      process.env.NODE_ENV = 'non_production';
    });
    describe('Errors with statusCode', function() {
      it('for non 500 requests return the info and status code', async function () {
        errorFn.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
          const error: HttpError = new Error('meow');
          error.statusCode = StatusCodes.IM_A_TEAPOT;
          return next(error);
        });
        const response = await supertest.agent(expressApp).get('/avi');
        expect(response).toHaveProperty('body.message', 'meow');
        expect(response.status).toEqual(StatusCodes.IM_A_TEAPOT);
      });
      it('for 500 requests return the info and status code', async function () {
        errorFn.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
          const error: HttpError = new Error('meow');
          error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
          return next(error);
        });
        const response = await supertest.agent(expressApp).get('/avi');
        expect(response).toHaveProperty('body.message', 'meow');
        expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      });
    });
  });
});
