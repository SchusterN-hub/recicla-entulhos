import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';

@ApiTags('Rentals')
@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar novo aluguel',
    description:
      'Cria um aluguel para uma caçamba. O endereço é preenchido automaticamente via ViaCEP.',
  })
  @ApiResponse({ status: 201, description: 'Aluguel criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Caçamba já alugada ou CEP inválido' })
  @ApiResponse({ status: 404, description: 'Caçamba não encontrada' })
  create(@Body() createRentalDto: CreateRentalDto) {
    return this.rentalsService.create(createRentalDto);
  }

  @Patch(':id/finish')
  @ApiOperation({ summary: 'Finalizar aluguel' })
  @ApiParam({ name: 'id', description: 'UUID do aluguel' })
  @ApiResponse({ status: 200, description: 'Aluguel finalizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Aluguel já finalizado' })
  @ApiResponse({ status: 404, description: 'Aluguel não encontrado' })
  finish(@Param('id', ParseUUIDPipe) id: string) {
    return this.rentalsService.finishRental(id);
  }
}
