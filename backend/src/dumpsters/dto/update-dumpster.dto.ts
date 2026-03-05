import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateDumpsterDto {
  @ApiPropertyOptional({
    example: 'CAC-001',
    description: 'Número de série único da caçamba',
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  serialNumber?: string;

  @ApiPropertyOptional({
    example: 'Verde',
    description: 'Cor da caçamba',
  })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  color?: string;
}
