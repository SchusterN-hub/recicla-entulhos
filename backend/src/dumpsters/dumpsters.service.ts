import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDumpsterDto } from './dto/create-dumpster.dto';
import { UpdateDumpsterDto } from './dto/update-dumpster.dto';
import { FilterDumpsterDto } from './dto/filter-dumpster.dto';

@Injectable()
export class DumpstersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDumpsterDto: CreateDumpsterDto) {
    const existing = await this.prisma.dumpster.findUnique({
      where: { serialNumber: createDumpsterDto.serialNumber },
    });

    if (existing) {
      throw new ConflictException(
        `Já existe uma caçamba com o número de série "${createDumpsterDto.serialNumber}"`,
      );
    }

    return this.prisma.dumpster.create({
      data: createDumpsterDto,
    });
  }

  async findAll(filters: FilterDumpsterDto) {
    const where: any = {};

    if (filters.serialNumber) {
      where.serialNumber = {
        contains: filters.serialNumber,
        mode: 'insensitive',
      };
    }

    if (filters.isRented !== undefined && filters.isRented !== '') {
      where.isRented =
        typeof filters.isRented === 'boolean'
          ? filters.isRented
          : filters.isRented === 'true';
    }

    return this.prisma.dumpster.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { rentals: true } },
      },
    });
  }

  async findOne(id: string) {
    const dumpster = await this.prisma.dumpster.findUnique({
      where: { id },
      include: {
        rentals: {
          orderBy: { startDate: 'desc' },
          take: 1,
        },
        _count: { select: { rentals: true } },
      },
    });

    if (!dumpster) {
      throw new NotFoundException(`Caçamba com id "${id}" não encontrada`);
    }

    return dumpster;
  }

  async update(id: string, updateDumpsterDto: UpdateDumpsterDto) {
    await this.findOne(id);

    if (updateDumpsterDto.serialNumber) {
      const existing = await this.prisma.dumpster.findUnique({
        where: { serialNumber: updateDumpsterDto.serialNumber },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Já existe uma caçamba com o número de série "${updateDumpsterDto.serialNumber}"`,
        );
      }
    }

    return this.prisma.dumpster.update({
      where: { id },
      data: updateDumpsterDto,
    });
  }

  async getRentalHistory(id: string) {
    await this.findOne(id);

    return this.prisma.rental.findMany({
      where: { dumpsterId: id },
      orderBy: { startDate: 'desc' },
    });
  }
}
