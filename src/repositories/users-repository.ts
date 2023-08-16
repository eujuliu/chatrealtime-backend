import { DomainUser } from 'mappers/user-mapper';

export interface IndexUser {
  id: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersRepository {
  exists(nickname: string): Promise<boolean>;
  store(user: DomainUser): Promise<{ id: string; nickname: string }>;
  show(by: 'id' | 'nickname', value: string): Promise<DomainUser | null>;
}
