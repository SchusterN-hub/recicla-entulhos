import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateDumpsterDto {
  @ApiProperty({
    example: 'CAC-001',
    description: 'Número de série único da caçamba',
  })
  @IsString()
  @IsNotEmpty({ message: 'O número de série é obrigatório' })
  @MinLength(3, { message: 'Número de série deve ter no mínimo 3 caracteres' })
  @MaxLength(50, { message: 'Número de série deve ter no máximo 50 caracteres' })
  serialNumber: string;

  @ApiProperty({
    example: 'Amarela',
    description: 'Cor da caçamba',
  })
  @IsString()
  @IsNotEmpty({ message: 'A cor é obrigatória' })
  @MaxLength(30, { message: 'Cor deve ter no máximo 30 caracteres' })
  color: string;
}
