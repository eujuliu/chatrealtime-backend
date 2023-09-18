import { SECRET } from 'config';
import { ValidationError } from 'core/errors';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface Decoded {
  id: string;
  nickname: string;
}

export interface RequestWithDecoded<
  P = unknown,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown,
  Locals extends Record<string, unknown> = Record<string, unknown>,
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  decoded: Decoded;
}

export async function authenticateToken(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const token = request.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return response.status(401).json(
        new ValidationError({
          message: 'Token not found',
        }),
      );
    }

    const decoded = jwt.verify(token, SECRET) as Decoded;

    (request as RequestWithDecoded).decoded = decoded;

    next();
  } catch (err) {
    return response.status(401).json(
      new ValidationError({
        message: (err as Error).message,
      }),
    );
  }
}
