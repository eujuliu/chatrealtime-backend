import { Message } from 'core/domain/message';
import { MessageModel } from 'infra/mongodb/models/message-model';
import { MessagesRepository } from 'repositories/messages-repository';

export class MongoDBMessagesRepository implements MessagesRepository {
  async store(message: Message): Promise<Message> {
    const create = new MessageModel(message);
    const response = await create.save();

    return {
      id: response.id,
      message: response.message,
      from: {
        id: response.from.id,
        nickname: response.from.nickname,
      },
      where: response.where,
      createdAt: response.createdAt,
      reply: response.reply
        ? {
            id: response.reply.id,
            message: response.reply.message,
            from: response.reply.from,
            where: response.reply.where,
            reply: null,
          }
        : null,
    };
  }

  async index(
    where: string,
    take?: number | undefined,
    skip?: number | undefined,
  ): Promise<Message[]> {
    const messages = await MessageModel.find(
      {
        where,
      },
      {},
      {
        limit: take,
        skip,
      },
    ).sort({ createdAt: -1 });

    return messages.map(({ id, from, message, createdAt, reply, where }) => ({
      id,
      message,
      from: {
        id: from.id,
        nickname: from.nickname,
      },
      where,
      createdAt,
      reply: reply
        ? {
            id: reply.id,
            message: reply.message,
            from: reply.from,
            where: reply.where,
            reply: null,
          }
        : null,
    }));
  }

  async show(id: string): Promise<Message | null> {
    const message = await MessageModel.findOne({
      id,
    });

    if (!message) {
      return null;
    }

    return {
      id: message.id,
      message: message.message,
      from: {
        id: message.from.id,
        nickname: message.from.nickname,
      },
      createdAt: message.createdAt,
      where: message.where,
      reply: message.reply
        ? {
            ...message.reply,
            reply: null,
          }
        : null,
    };
  }
}
