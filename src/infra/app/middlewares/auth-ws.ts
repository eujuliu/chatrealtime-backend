import { ValidationError } from 'core/errors';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { SECRET } from 'config';
import jwt from 'jsonwebtoken';
import { Decoded } from './auth';

export function authenticateTokenWs(
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void,
) {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(
        new ValidationError({
          message: 'You need to login or create an account for access',
        }),
      );
    }

    const decoded = jwt.verify(token, SECRET) as Decoded;

    if (!decoded.id || !decoded.nickname) {
      return next(
        new ValidationError({
          message: 'This token is not valid',
        }),
      );
    }

    next();
  } catch (err) {
    next(err as Error);
  }
}
