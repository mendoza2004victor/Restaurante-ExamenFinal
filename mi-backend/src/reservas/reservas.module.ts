// En: src/reservas/reservas.module.ts
import { Module } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';

// --- 👇 AÑADIMOS LAS IMPORTACIONES ---
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { Mesa } from 'src/mesas/entities/mesa.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';

@Module({
  // --- 👇 AQUÍ LE DAMOS ACCESO A LAS ENTIDADES ---
  imports: [
    TypeOrmModule.forFeature([Reserva, Mesa, Cliente]),
  ],
  
  controllers: [ReservasController],
  providers: [ReservasService],
})
export class ReservasModule {}