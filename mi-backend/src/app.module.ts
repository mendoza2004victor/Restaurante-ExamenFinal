// En: src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MesasModule } from './mesas/mesas.module';
import { ClientesModule } from './clientes/clientes.module';
import { ReservasModule } from './reservas/reservas.module';
import { Mesa } from './mesas/entities/mesa.entity';
import { Cliente } from './clientes/entities/cliente.entity';
import { Reserva } from './reservas/entities/reserva.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      
      // 👇 ¡¡CAMBIA ESTAS DOS LÍNEAS!! 👇
      username: 'postgres', // Ej: 'postgres'
      password: '12345678', // Tu contraseña de Postgres
      // 👆 ¡¡CAMBIA ESTAS DOS LÍNEAS!! 👆
      
      database: 'prueba_examen', // La base de datos que creamos
      entities: [Mesa, Cliente, Reserva],
      synchronize: true, // ¡SOLO PARA DESARROLLO!
    }),
    // Los módulos de nuestra aplicación
    MesasModule,
    ClientesModule,
    ReservasModule,
  ],
  controllers: [], // Vacío, ya no usamos AppController
  providers: [],   // Vacío, ya no usamos AppService
})
export class AppModule {}