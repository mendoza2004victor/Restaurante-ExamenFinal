// En: src/mesas/mesas.module.ts
import { Module } from '@nestjs/common';
import { MesasService } from './mesas.service';
import { MesasController } from './mesas.controller';

// --- 👇 AÑADIMOS LAS IMPORTACIONES ---
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mesa } from './entities/mesa.entity';
import { Reserva } from 'src/reservas/entities/reserva.entity';

@Module({
  // --- 👇 AQUÍ LE DAMOS ACCESO A LAS ENTIDADES ---
  imports: [
    TypeOrmModule.forFeature([Mesa, Reserva]) // Añadimos Mesa y Reserva
  ],
  
  controllers: [MesasController],
  providers: [MesasService],
})
export class MesasModule {}