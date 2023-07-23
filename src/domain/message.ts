import { Result, exception, success } from 'core/logic/result';
import { ValidationError } from 'core/errors';

interface MessageProps {
  id: string | null;
  message: string;
  sender: string;
  where: string;
  reply: string | null;
}

export class Message {
  readonly id: string | null;
  readonly message: string;
  readonly sender: string;
  readonly where: string;
  readonly reply: string | null;
  readonly createdAt: string;

  constructor({ id, message, sender, where, reply }: MessageProps) {
    this.id = id;
    this.message = message;
    this.sender = sender;
    this.where = where;
    this.reply = reply;
    this.createdAt = new Date().toISOString();
  }

  static create({
    message,
    sender,
    where,
    reply,
  }: Omit<MessageProps, 'id'>): Result<ValidationError, Message> {
    if (message.length > 280) {
      return exception(
        new ValidationError({
          message: 'The length of the message exceeds the limit.',
          code: 400,
        }),
      );
    }

    return success(
      new Message({
        id: null,
        message,
        sender,
        where,
        reply,
      }),
    );
  }
}
