// En: src/mesas/dto/create-mesa.dto.ts
import { IsInt, IsNotEmpty, IsPositive, IsString, Min } from 'class-validator';

export class CreateMesaDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  numero: number;

  @IsInt()
  @Min(1) // Mínimo 1 persona por mesa
  @IsNotEmpty()
  capacidad: number;

  @IsString()
  @IsNotEmpty()
  ubicacion: string;
}