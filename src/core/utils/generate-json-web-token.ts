import jwt from 'jsonwebtoken';
import { SECRET } from 'config';

interface Props {
  id: string;
  nickname: string;
}

export function generateJsonWebToken({ id, nickname }: Props): string {
  const token = jwt.sign({ id, nickname }, SECRET, { expiresIn: '12h' });

  return token;
}
