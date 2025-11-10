// En: mi-backend/src/mesas/mesas.module.ts
import { Module } from '@nestjs/common';
import { MesasService } from './mesas.service';
import { MesasController } from './mesas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mesa } from './entities/mesa.entity';
import { Reserva } from 'src/reservas/entities/reserva.entity'; // <-- 1. IMPORTAR

@Module({
  imports: [
    TypeOrmModule.forFeature([Mesa, Reserva]) // <-- 2. AÑADIR RESERVA AQUÍ
  ],
  controllers: [MesasController],
  providers: [MesasService],
})
export class MesasModule {}