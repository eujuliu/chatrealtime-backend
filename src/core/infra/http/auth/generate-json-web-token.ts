import { SECRET } from 'config';
import jwt from 'jsonwebtoken';

interface Props {
  id: string;
  nickname: string;
}

export function generateJsonWebToken({ id, nickname }: Props): string {
  const token = jwt.sign({ id, nickname }, SECRET, { expiresIn: '12h' });

  return token;
}
