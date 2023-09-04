import { ValidationError } from 'core/errors';
import { Result, exception, success } from 'utils/result';
import { v4 as uuid } from 'uuid';

interface From {
  id: string;
  nickname: string;
}

export interface Reply extends Omit<Message, 'from' | 'createdAt'> {
  from: string;
}

interface MessageProps {
  id?: string | null;
  message: string;
  from: From;
  where: string;
  reply: Reply | null;
}

export class Message {
  readonly id: string | null;
  readonly message: string;
  readonly from: From;
  readonly where: string;
  readonly createdAt: string;
  reply: Reply | null;

  constructor({ id, message, from, where, reply }: MessageProps) {
    this.id = id || uuid();
    this.message = message;
    this.from = from;
    this.where = where;
    this.createdAt = new Date().toISOString();
    this.reply = reply;
  }

  static create({
    message,
    from,
    where,
    reply,
  }: Omit<MessageProps, 'id'>): Result<ValidationError, Message> {
    if (message.length > 280) {
      return exception(
        new ValidationError({
          message: 'The length of the message exceeds the limit.',
          statusCode: 400,
        }),
      );
    }

    return success(
      new Message({
        message,
        from,
        where,
        reply,
      }),
    );
  }
}
