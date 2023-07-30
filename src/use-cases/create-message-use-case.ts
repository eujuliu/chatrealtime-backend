import { ValidationError } from 'core/errors';
import { Result, exception, success } from 'core/logic/result';
import { Message } from 'domain/message';
import { MessagesRepository } from 'repositories/messages-repository';
import { UsersRepository } from 'repositories/users-repository';

interface Request {
  message: string;
  from: string;
  where: string;
  reply: string | null;
}

export class CreateMessageUseCase {
  constructor(
    private messagesRepository: MessagesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    message,
    from,
    reply,
    where,
  }: Request): Promise<Result<ValidationError, Message>> {
    const user = await this.usersRepository.show('id', from);
    const replyMessage = await this.messagesRepository.show(reply ? reply : '');

    if (user === null) {
      return exception(new ValidationError());
    }

    if (replyMessage) {
      replyMessage.reply = null;
    }

    const messageOrError = Message.create({
      message,
      from: {
        id: user.id as string,
        nickname: user.nickname,
      },
      where,
      reply: replyMessage,
    });

    if (messageOrError.exception()) {
      return exception(messageOrError.answer);
    }

    const persistenceMessage = await this.messagesRepository.store(
      messageOrError.answer,
    );

    return success(persistenceMessage);
  }
}
