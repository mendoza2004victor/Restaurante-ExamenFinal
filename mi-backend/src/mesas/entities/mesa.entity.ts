// En: src/mesas/entities/mesa.entity.ts

// --- 👇 IMPORTAMOS LO NUEVO ---
import { Reserva } from 'src/reservas/entities/reserva.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'mesas' })
export class Mesa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  numero: number;

  @Column()
  capacidad: number;

  @Column({ nullable: true })
  ubicacion?: string;

  // --- 👇 AÑADIMOS ESTA RELACIÓN ---
  // Una mesa puede tener muchas reservas
  @OneToMany(() => Reserva, (reserva) => reserva.mesa)
  reservas: Reserva[];
}