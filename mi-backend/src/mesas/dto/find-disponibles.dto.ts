// En: src/mesas/dto/find-disponibles.dto.ts
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class FindDisponiblesDto {
  @IsDateString()
  @IsNotEmpty()
  fecha_hora: string;

  @Type(() => Number) // Transforma el string de la URL a número
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  numero_personas: number;
}