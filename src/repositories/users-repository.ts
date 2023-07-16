import { PersistenceUser } from 'core/utils/mappers/user-mapper';

export interface UsersRepository {
  exists(nickname: string): Promise<boolean>;
  store(user: PersistenceUser): Promise<{ id: string; nickname: string }>;
  show(nickname: string): Promise<PersistenceUser | null>;
}
