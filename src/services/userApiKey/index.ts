// Node modules.
import { UserApiKey, Prisma, PrismaClient } from '@prisma/client';
// Relative modules.
import prisma from '@utils/dbClient';

type UserApiKeyServiceDependencies = {
  model: PrismaClient['userApiKey'];
};

export class UserApiKeyService {
  private model: PrismaClient['userApiKey'];

  constructor(
    dependencies: UserApiKeyServiceDependencies = {
      model: prisma.userApiKey,
    },
  ) {
    this.model = dependencies.model;
  }

  async create(args: Prisma.UserApiKeyCreateArgs): Promise<UserApiKey> {
    return await this.model.create(args);
  }

  async count(args: Prisma.UserApiKeyCountArgs): Promise<number> {
    return await this.model.count(args);
  }

  async delete(id: string): Promise<UserApiKey> {
    return await this.model.delete({
      where: { id },
    });
  }

  async deleteMany(
    args: Prisma.UserApiKeyDeleteManyArgs,
  ): Promise<Prisma.BatchPayload> {
    return await this.model.deleteMany(args);
  }

  async find(args: Prisma.UserApiKeyFindFirstArgs): Promise<UserApiKey | null> {
    return await this.model.findFirst(args);
  }

  async findMany(args: Prisma.UserApiKeyFindManyArgs): Promise<UserApiKey[]> {
    return await this.model.findMany(args);
  }

  async get(id: string): Promise<UserApiKey | null> {
    return await this.model.findFirst({
      where: { id },
    });
  }

  async update(
    id: string,
    data: Prisma.UserApiKeyUpdateInput,
  ): Promise<UserApiKey> {
    return await this.model.update({
      where: { id },
      data,
    });
  }

  async upsert(args: Prisma.UserApiKeyUpsertArgs): Promise<UserApiKey> {
    return await this.model.upsert(args);
  }
}
