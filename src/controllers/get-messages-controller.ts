import { InternalServerError, ValidationError } from 'core/errors';
import { Request, Response } from 'express';
import { GetMessagesUseCase } from 'use-cases/get-messages-use-case';
import { convertZodErrorToString } from 'utils/convert-zod-error-to-string';
import { z } from 'zod';

const GetMessagesSchema = z
  .object({
    where: z.string().nonempty(),
    take: z.number().min(0).optional(),
    skip: z.number().min(0).optional(),
  })
  .strict();

export type QueryParams = z.infer<typeof GetMessagesSchema>;

export class GetMessagesController {
  constructor(private getMessagesUseCase: GetMessagesUseCase) {}
  async handle(
    request: Request<unknown, unknown, unknown, QueryParams>,
    response: Response,
  ) {
    try {
      const queryParams = request.query;
      const validQueryParams = GetMessagesSchema.safeParse(queryParams);

      if (!validQueryParams.success) {
        return response.status(422).json(
          new ValidationError({
            statusCode: 422,
            message: convertZodErrorToString(validQueryParams.error.issues),
          }),
        );
      }

      const responseOrError = await this.getMessagesUseCase.execute({
        ...validQueryParams.data,
      });

      return response.status(200).json(responseOrError.answer);
    } catch (error) {
      return response
        .status(500)
        .json(new InternalServerError({ message: (error as Error).message }));
    }
  }
}
