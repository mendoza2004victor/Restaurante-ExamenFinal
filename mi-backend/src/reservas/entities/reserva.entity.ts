// En: src/reservas/entities/reserva.entity.ts
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Mesa } from 'src/mesas/entities/mesa.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'reservas' })
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  fecha_hora: Date;

  @Column()
  numero_personas: number;

  @Column({ default: 'confirmada' })
  estado: string; // <-- ¡ESTE TAMBIÉN ES IMPORTANTE PARA OTRO ERROR!

  // --- RELACIONES (AQUÍ ESTÁ LA SOLUCIÓN) ---

  @ManyToOne(() => Cliente, (cliente) => cliente.reservas, { eager: true })
  cliente: Cliente; // <-- Asegúrate que esta línea exista

  @ManyToOne(() => Mesa, { eager: true })
  mesa: Mesa; // <-- Asegúrate que esta línea exista
}