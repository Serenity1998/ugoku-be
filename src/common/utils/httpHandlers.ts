import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError, ZodSchema } from 'zod';

import { ServiceResponse } from '../types/serviceResponse';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response): void => {
  try {
    response.status(serviceResponse.statusCode).send(serviceResponse);
  } catch (error) {
    console.error('Error sending response:', error);
    response.status(500).send({ message: 'Internal Server Error' });
  }
};

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({ body: req.body, query: req.query, params: req.params });
    next();
  } catch (err) {
    const errorMessage = `Invalid input: ${(err as ZodError).errors.map((e) => e.message).join(', ')}`;
    const statusCode = StatusCodes.BAD_REQUEST;
    const serviceResponse = ServiceResponse.failure(errorMessage, null, statusCode);
    return handleServiceResponse(serviceResponse, res);
  }
};

export interface AuthRequest extends Request {
  user: DecodedIdToken;
  token: string;
  isSuperAdmin: boolean;
}

export const zodErrorHandler = (ex: unknown): string => {
  let errorMessage = '';
  if (ex instanceof ZodError) {
    errorMessage = `validation error: $${(ex as Error).message}`;
  } else {
    errorMessage = `database error: $${ex}`;
  }
  return errorMessage;
};
