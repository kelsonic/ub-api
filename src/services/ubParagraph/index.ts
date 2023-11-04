// Node modules.
import { UBParagraph, Prisma, PrismaClient } from '@prisma/client';
// Relative modules.
import prisma from '@utils/dbClient';

type UBParagraphServiceDependencies = {
  model: PrismaClient['uBParagraph'];
};

export class UBParagraphService {
  private model: PrismaClient['uBParagraph'];

  constructor(
    dependencies: UBParagraphServiceDependencies = {
      model: prisma.uBParagraph,
    },
  ) {
    this.model = dependencies.model;
  }

  async create(args: Prisma.UBParagraphCreateArgs): Promise<UBParagraph> {
    return await this.model.create(args);
  }

  async count(args: Prisma.UBParagraphCountArgs): Promise<number> {
    return await this.model.count(args);
  }

  async delete(id: string): Promise<UBParagraph> {
    return await this.model.delete({
      where: { id },
    });
  }

  async deleteMany(
    args: Prisma.UBParagraphDeleteManyArgs,
  ): Promise<Prisma.BatchPayload> {
    return await this.model.deleteMany(args);
  }

  async find(
    args: Prisma.UBParagraphFindFirstArgs,
  ): Promise<UBParagraph | null> {
    return await this.model.findFirst(args);
  }

  async findMany(args: Prisma.UBParagraphFindManyArgs): Promise<UBParagraph[]> {
    return await this.model.findMany(args);
  }

  async get(id: string): Promise<UBParagraph | null> {
    return await this.model.findFirst({
      where: { id },
    });
  }

  async update(
    id: string,
    data: Prisma.UBParagraphUpdateInput,
  ): Promise<UBParagraph> {
    return await this.model.update({
      where: { id },
      data,
    });
  }

  async upsert(args: Prisma.UBParagraphUpsertArgs): Promise<UBParagraph> {
    return await this.model.upsert(args);
  }
}
