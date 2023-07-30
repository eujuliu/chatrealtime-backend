import { ValidationError } from 'core/errors';
import { Result, exception, success } from 'core/logic/result';

interface From {
  id: string;
  nickname: string;
}

interface MessageProps {
  id: string | null;
  message: string;
  from: From;
  where: string;
  reply: Message | null;
}

export class Message {
  readonly id: string | null;
  readonly message: string;
  readonly from: From;
  readonly where: string;
  reply: Message | null;

  constructor({ id, message, from, where, reply }: MessageProps) {
    this.id = id;
    this.message = message;
    this.from = from;
    this.where = where;
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
        id: null,
        message,
        from,
        where,
        reply,
      }),
    );
  }
}
