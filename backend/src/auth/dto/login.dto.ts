import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@recicla.com' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'recicla123' })
  @IsString()
  @IsNotEmpty({ message: 'Senha obrigatória' })
  password: string;
}
