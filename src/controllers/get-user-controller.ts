import { InternalServerError, ValidationError } from 'core/errors';
import { Request, Response } from 'express';
import { generateJsonWebToken } from 'infra/app/auth/generate-json-web-token';
import { GetUserUseCase } from 'use-cases/get-user-use-case';
import { convertZodErrorToString } from 'utils/convert-zod-error-to-string';
import { z } from 'zod';

const GetUserSchema = z
  .object({
    nickname: z.string().min(5).max(16).nonempty(),
    password: z.string().min(8).nonempty(),
  })
  .strict();

type BodyProps = z.infer<typeof GetUserSchema>;

export class GetUserController {
  constructor(private getUserUseCase: GetUserUseCase) {}
  async handle(
    request: Request<unknown, unknown, BodyProps>,
    response: Response,
  ) {
    try {
      const bodyProps = request.body;
      const validBodyProps = GetUserSchema.safeParse(bodyProps);

      if (!validBodyProps.success) {
        return response.status(422).json(
          new ValidationError({
            statusCode: 422,
            message: convertZodErrorToString(validBodyProps.error.issues),
          }),
        );
      }

      const responseOrError = await this.getUserUseCase.execute({
        ...validBodyProps.data,
      });

      if (responseOrError.exception()) {
        return response
          .status(responseOrError.answer.statusCode)
          .json(responseOrError.answer);
      }

      const token = generateJsonWebToken({
        id: responseOrError.answer.id,
        nickname: responseOrError.answer.nickname,
      });

      return response.status(200).json({
        token,
        user: {
          id: responseOrError.answer.id,
          nickname: responseOrError.answer.nickname,
        },
      });
    } catch (error) {
      return response
        .status(500)
        .json(new InternalServerError({ message: (error as Error).message }));
    }
  }
}
