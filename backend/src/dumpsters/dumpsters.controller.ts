import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { DumpstersService } from './dumpsters.service';
import { CreateDumpsterDto } from './dto/create-dumpster.dto';
import { UpdateDumpsterDto } from './dto/update-dumpster.dto';
import { FilterDumpsterDto } from './dto/filter-dumpster.dto';

@ApiTags('Dumpsters')
@Controller('dumpsters')
export class DumpstersController {
  constructor(private readonly dumpstersService: DumpstersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastrar nova caçamba' })
  @ApiResponse({ status: 201, description: 'Caçamba criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Número de série já cadastrado' })
  create(@Body() createDumpsterDto: CreateDumpsterDto) {
    return this.dumpstersService.create(createDumpsterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as caçambas' })
  @ApiQuery({
    name: 'serialNumber',
    required: false,
    description: 'Filtrar por número de série',
  })
  @ApiQuery({
    name: 'isRented',
    required: false,
    enum: ['true', 'false'],
    description: 'Filtrar por status de aluguel',
  })
  @ApiResponse({ status: 200, description: 'Lista de caçambas retornada' })
  findAll(@Query() filters: FilterDumpsterDto) {
    return this.dumpstersService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar caçamba por ID' })
  @ApiParam({ name: 'id', description: 'UUID da caçamba' })
  @ApiResponse({ status: 200, description: 'Caçamba encontrada' })
  @ApiResponse({ status: 404, description: 'Caçamba não encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.dumpstersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar caçamba' })
  @ApiParam({ name: 'id', description: 'UUID da caçamba' })
  @ApiResponse({ status: 200, description: 'Caçamba atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Caçamba não encontrada' })
  @ApiResponse({ status: 409, description: 'Número de série já em uso' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDumpsterDto: UpdateDumpsterDto,
  ) {
    return this.dumpstersService.update(id, updateDumpsterDto);
  }

  @Get(':id/rentals')
  @ApiOperation({ summary: 'Histórico de aluguéis da caçamba' })
  @ApiParam({ name: 'id', description: 'UUID da caçamba' })
  @ApiResponse({ status: 200, description: 'Histórico retornado com sucesso' })
  @ApiResponse({ status: 404, description: 'Caçamba não encontrada' })
  getRentalHistory(@Param('id', ParseUUIDPipe) id: string) {
    return this.dumpstersService.getRentalHistory(id);
  }
}
