import { Message } from 'domain/message';

export interface MessagesRepository {
  store(message: Message): Promise<Message>;
}
