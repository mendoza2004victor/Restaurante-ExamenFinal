// En: src/reservas/dto/create-reserva.dto.ts
import { IsDateString, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateReservaDto {
  // Usamos IsDateString para que acepte un formato estándar
  // como "2025-11-10T14:30:00.000Z"
  @IsDateString()
  @IsNotEmpty()
  fecha_hora: string; // El frontend enviará un string ISO

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  numero_personas: number;

  // El DTO no recibirá el objeto Cliente/Mesa,
  // sino sus IDs para que los busquemos.
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  clienteId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  mesaId: number;
}