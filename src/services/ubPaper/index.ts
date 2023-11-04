// Node modules.
import { UBPaper, Prisma, PrismaClient } from '@prisma/client';
// Relative modules.
import prisma from '@utils/dbClient';

type UBPaperServiceDependencies = {
  model: PrismaClient['uBPaper'];
};

export class UBPaperService {
  private model: PrismaClient['uBPaper'];

  constructor(
    dependencies: UBPaperServiceDependencies = {
      model: prisma.uBPaper,
    },
  ) {
    this.model = dependencies.model;
  }

  async create(args: Prisma.UBPaperCreateArgs): Promise<UBPaper> {
    return await this.model.create(args);
  }

  async count(args: Prisma.UBPaperCountArgs): Promise<number> {
    return await this.model.count(args);
  }

  async delete(id: string): Promise<UBPaper> {
    return await this.model.delete({
      where: { id },
    });
  }

  async deleteMany(
    args: Prisma.UBPaperDeleteManyArgs,
  ): Promise<Prisma.BatchPayload> {
    return await this.model.deleteMany(args);
  }

  async find(args: Prisma.UBPaperFindFirstArgs): Promise<UBPaper | null> {
    return await this.model.findFirst(args);
  }

  async findMany(args: Prisma.UBPaperFindManyArgs): Promise<UBPaper[]> {
    return await this.model.findMany(args);
  }

  async get(id: string): Promise<UBPaper | null> {
    return await this.model.findFirst({
      where: { id },
    });
  }

  async update(id: string, data: Prisma.UBPaperUpdateInput): Promise<UBPaper> {
    return await this.model.update({
      where: { id },
      data,
    });
  }

  async upsert(args: Prisma.UBPaperUpsertArgs): Promise<UBPaper> {
    return await this.model.upsert(args);
  }
}
