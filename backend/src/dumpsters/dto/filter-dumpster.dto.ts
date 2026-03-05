import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBooleanString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterDumpsterDto {
  @ApiPropertyOptional({
    example: 'CAC-001',
    description: 'Filtrar por número de série (busca parcial)',
  })
  @IsString()
  @IsOptional()
  serialNumber?: string;

  @ApiPropertyOptional({
    example: 'true',
    description: 'Filtrar por status de aluguel',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isRented?: boolean | string;
}
