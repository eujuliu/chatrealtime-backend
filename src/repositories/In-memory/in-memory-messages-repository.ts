import { Message } from 'domain/message';
import { MessagesRepository } from 'repositories/messages-repository';
import { v4 as uuid } from 'uuid';

export class InMemoryMessagesRepository implements MessagesRepository {
  private readonly messages: Message[] = [];

  async store(message: Message): Promise<Message> {
    const messageWithId = {
      ...message,
      id: uuid(),
    };

    this.messages.push(messageWithId);

    return messageWithId;
  }

  async show(id: string): Promise<Message | null> {
    const message = this.messages.find((message) => message.id == id);

    if (!message) {
      return null;
    }

    return message;
  }
}
