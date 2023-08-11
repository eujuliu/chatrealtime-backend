import { InternalServerError, ValidationError } from 'core/errors';
import { Request, Response } from 'express';
import { generateJsonWebToken } from 'core/infra/http/auth/generate-json-web-token';
import { CreateUserUseCase } from 'use-cases/create-user-use-case';
import { z } from 'zod';
import { convertZodErrorToString } from 'utils/convert-zod-error-to-string';

const CreateUserSchema = z
  .object({
    nickname: z.string().min(5).max(30).nonempty().toLowerCase(),
    password: z.string().min(8).nonempty(),
  })
  .strict();

type BodyProps = z.infer<typeof CreateUserSchema>;

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handle(
    request: Request<unknown, unknown, BodyProps>,
    response: Response,
  ) {
    try {
      const bodyProps = request.body;
      const parseBodyResult = CreateUserSchema.safeParse(bodyProps);

      if (!parseBodyResult.success) {
        return response.status(422).json(
          new ValidationError({
            statusCode: 422,
            message: convertZodErrorToString(parseBodyResult.error.issues),
          }),
        );
      }

      const responseOrError = await this.createUserUseCase.execute({
        nickname: parseBodyResult.data.nickname,
        password: parseBodyResult.data.password,
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

      return response
        .status(201)
        .cookie('token', token, {
          secure: true,
          httpOnly: false,
          sameSite: 'lax',
          expires: (() => {
            const date = new Date();
            date.setHours(date.getHours() + 12);

            return date;
          })(),
        })
        .send();
    } catch (err) {
      return response
        .status(500)
        .json(new InternalServerError({ message: (err as Error).message }));
    }
  }
}
