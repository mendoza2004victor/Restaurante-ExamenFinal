// En: src/clientes/dto/create-cliente.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEmail() // Valida que sea un formato de email correcto
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional() // El teléfono no es obligatorio
  telefono?: string;
}