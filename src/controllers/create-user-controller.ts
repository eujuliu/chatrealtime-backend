import { InternalServerError, ValidationError } from 'core/errors';
import { Request, Response } from 'express';
import { generateJsonWebToken } from 'infra/app/auth/generate-json-web-token';
import { CreateUserUseCase } from 'use-cases/create-user-use-case';
import { z } from 'zod';
import { convertZodErrorToString } from 'utils/convert-zod-error-to-string';

const CreateUserSchema = z
  .object({
    nickname: z.string().min(5).max(30).nonempty().toLowerCase().trim(),
    password: z.string().min(8).nonempty(),
  })
  .strict();

type BodyProps = z.infer<typeof CreateUserSchema>;

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const bodyProps: BodyProps = await request.body;
      const validateBodyProps = CreateUserSchema.safeParse(bodyProps);

      if (!validateBodyProps.success) {
        return response.status(422).json(
          new ValidationError({
            statusCode: 422,
            message: convertZodErrorToString(validateBodyProps.error.issues),
          }),
        );
      }

      const responseOrError = await this.createUserUseCase.execute({
        nickname: validateBodyProps.data.nickname,
        password: validateBodyProps.data.password,
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

      return response.status(201).json({
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
