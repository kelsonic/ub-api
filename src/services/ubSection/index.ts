// Node modules.
import { UBSection, Prisma, PrismaClient } from '@prisma/client';
// Relative modules.
import prisma from '@utils/dbClient';

type UBSectionServiceDependencies = {
  model: PrismaClient['uBSection'];
};

export class UBSectionService {
  private model: PrismaClient['uBSection'];

  constructor(
    dependencies: UBSectionServiceDependencies = {
      model: prisma.uBSection,
    },
  ) {
    this.model = dependencies.model;
  }

  async create(args: Prisma.UBSectionCreateArgs): Promise<UBSection> {
    return await this.model.create(args);
  }

  async count(args: Prisma.UBSectionCountArgs): Promise<number> {
    return await this.model.count(args);
  }

  async delete(id: string): Promise<UBSection> {
    return await this.model.delete({
      where: { id },
    });
  }

  async deleteMany(
    args: Prisma.UBSectionDeleteManyArgs,
  ): Promise<Prisma.BatchPayload> {
    return await this.model.deleteMany(args);
  }

  async find(args: Prisma.UBSectionFindFirstArgs): Promise<UBSection | null> {
    return await this.model.findFirst(args);
  }

  async findMany(args: Prisma.UBSectionFindManyArgs): Promise<UBSection[]> {
    return await this.model.findMany(args);
  }

  async get(id: string): Promise<UBSection | null> {
    return await this.model.findFirst({
      where: { id },
    });
  }

  async update(
    id: string,
    data: Prisma.UBSectionUpdateInput,
  ): Promise<UBSection> {
    return await this.model.update({
      where: { id },
      data,
    });
  }

  async upsert(args: Prisma.UBSectionUpsertArgs): Promise<UBSection> {
    return await this.model.upsert(args);
  }
}
