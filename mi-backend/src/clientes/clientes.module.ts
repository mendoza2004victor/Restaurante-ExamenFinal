// En: src/clientes/clientes.module.ts
import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- 1. IMPORTAR
import { Cliente } from './entities/cliente.entity'; // <-- 2. IMPORTAR

@Module({
  imports: [
    TypeOrmModule.forFeature([Cliente]) // <-- 3. AÑADIR ESTA LÍNEA
  ],
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class ClientesModule {}