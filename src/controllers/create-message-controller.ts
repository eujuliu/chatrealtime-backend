import { InternalServerError, ValidationError } from 'core/errors';
import { Server } from 'socket.io';
import { CreateMessageUseCase } from 'use-cases/create-message-use-case';
import { convertZodErrorToString } from 'utils/convert-zod-error-to-string';
import { z } from 'zod';

const CreateMessageSchema = z
  .object({
    message: z.string().min(1).max(280).nonempty(),
    from: z.string().min(1).nonempty(),
    where: z.string().min(1).nonempty(),
    reply: z.string().min(1).nullable(),
  })
  .strict();

export type CreateMessageProps = z.infer<typeof CreateMessageSchema>;

export class CreateMessageController {
  constructor(private createMessageUseCase: CreateMessageUseCase) {}

  async handle(
    message: CreateMessageProps,
    socket: Server,
    acknowledgements: (e: ValidationError | InternalServerError) => void,
  ) {
    try {
      const validMessage = CreateMessageSchema.safeParse(message);

      if (!validMessage.success) {
        return acknowledgements(
          new ValidationError({
            statusCode: 422,
            message: convertZodErrorToString(validMessage.error.issues),
          }),
        );
      }

      const responseOrError = await this.createMessageUseCase.execute({
        ...validMessage.data,
      });

      if (responseOrError.exception()) {
        return acknowledgements(responseOrError.answer);
      }

      socket
        .to(validMessage.data.where)
        .emit('message_created', responseOrError.answer);
    } catch (error) {
      return acknowledgements(
        new InternalServerError({ message: (error as Error).message }),
      );
    }
  }
}
