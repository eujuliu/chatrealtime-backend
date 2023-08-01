import { Message } from 'domain/message';

export interface MessagesRepository {
  store(message: Message): Promise<Message>;
  show(id: string): Promise<Message | null>;
  index(where: string, take?: number, skip?: number): Promise<Message[]>;
}
