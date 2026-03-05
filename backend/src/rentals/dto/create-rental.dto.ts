import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  Matches,
  IsOptional,
  IsDateString,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from "class-validator";

@ValidatorConstraint({ name: "isAfterToday", async: false })
class IsAfterTodayConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    if (!value) return true;
    const date = new Date(value);
    const today = new Date();
    
    date.setUTCHours(0, 0, 0, 0);
    today.setUTCHours(0, 0, 0, 0);
    console.log("Validating date:", date);
    console.log("today:", today);
   
    return date >= today; 
  }

  defaultMessage(_args: ValidationArguments) {
    return "A data de previsão de fim não pode ser anterior a hoje";
  }
}

export class CreateRentalDto {
  @ApiProperty({
    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    description: "ID da caçamba a ser alugada",
  })
  @IsUUID("4", { message: "dumpsterId deve ser um UUID válido" })
  @IsNotEmpty({ message: "O ID da caçamba é obrigatório" })
  dumpsterId: string;

  @ApiProperty({
    example: "01310-100",
    description: "CEP do endereço de entrega",
  })
  @IsString()
  @IsNotEmpty({ message: "O CEP é obrigatório" })
  @Matches(/^\d{5}-?\d{3}$/, {
    message: "CEP inválido. Use o formato 00000-000",
  })
  cep: string;

  @ApiPropertyOptional({
    example: "2025-12-31",
    description: "Data prevista para devolução (não pode ser anterior a hoje)",
  })
  @IsOptional()
  @IsDateString({}, { message: "Data de previsão inválida" })
  @Validate(IsAfterTodayConstraint)
  expectedEndDate?: string;
}
