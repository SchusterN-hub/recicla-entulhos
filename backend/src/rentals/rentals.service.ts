import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import axios from 'axios';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

@Injectable()
export class RentalsService {
  constructor(private readonly prisma: PrismaService) {}

  private async fetchAddressByCep(cep: string): Promise<ViaCepResponse> {
    const cleanCep = cep.replace(/\D/g, '');
    try {
      const response = await axios.get<ViaCepResponse>(
        `https://viacep.com.br/ws/${cleanCep}/json/`,
        { timeout: 5000 },
      );
      if (response.data.erro) {
        throw new BadRequestException(`CEP "${cep}" não encontrado`);
      }
      return response.data;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'Não foi possível consultar o CEP. Verifique sua conexão.',
      );
    }
  }

  async create(createRentalDto: CreateRentalDto) {
    const dumpster = await this.prisma.dumpster.findUnique({
      where: { id: createRentalDto.dumpsterId },
    });

    if (!dumpster) {
      throw new NotFoundException(
        `Caçamba com id "${createRentalDto.dumpsterId}" não encontrada`,
      );
    }

    if (dumpster.isRented) {
      throw new BadRequestException(
        `A caçamba "${dumpster.serialNumber}" já está alugada no momento`,
      );
    }

    const address = await this.fetchAddressByCep(createRentalDto.cep);

    const rental = await this.prisma.$transaction(async (tx) => {
      const newRental = await tx.rental.create({
        data: {
          dumpsterId: createRentalDto.dumpsterId,
          cep: address.cep,
          street: address.logradouro || 'Não informado',
          neighborhood: address.bairro || 'Não informado',
          city: `${address.localidade}/${address.uf}`,
          expectedEndDate: createRentalDto.expectedEndDate
            ? new Date(createRentalDto.expectedEndDate)
            : null,
        },
      });

      await tx.dumpster.update({
        where: { id: createRentalDto.dumpsterId },
        data: { isRented: true },
      });

      return newRental;
    });

    return this.prisma.rental.findUnique({
      where: { id: rental.id },
      include: { dumpster: true },
    });
  }

  async finishRental(id: string) {
    const rental = await this.prisma.rental.findUnique({
      where: { id },
      include: { dumpster: true },
    });

    if (!rental) {
      throw new NotFoundException(`Aluguel com id "${id}" não encontrado`);
    }

    if (rental.endDate) {
      throw new BadRequestException(
        `Este aluguel já foi finalizado em ${rental.endDate.toLocaleDateString('pt-BR')}`,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.rental.update({
        where: { id },
        data: { endDate: new Date() },
      });

      await tx.dumpster.update({
        where: { id: rental.dumpsterId },
        data: { isRented: false },
      });
    });

    return this.prisma.rental.findUnique({
      where: { id },
      include: { dumpster: true },
    });
  }
}
