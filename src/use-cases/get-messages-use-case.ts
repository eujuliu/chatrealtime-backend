import { Message } from 'core/domain/message';
import { MessagesRepository } from 'repositories/messages-repository';
import { Result, success } from 'utils/result';

interface Request {
  where: string;
  take?: number;
  skip?: number;
}

export class GetMessagesUseCase {
  constructor(private messagesRepository: MessagesRepository) {}

  async execute({
    where,
    take,
    skip,
  }: Request): Promise<Result<void, Message[]>> {
    const messages = await this.messagesRepository.index(where, take, skip);

    return success(messages);
  }
}
