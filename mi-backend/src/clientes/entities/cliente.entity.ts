// En: src/clientes/entities/cliente.entity.ts
import { Reserva } from 'src/reservas/entities/reserva.entity'; // <-- ¡Correcto!
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'; // <-- ¡Correcto!

@Entity({ name: 'clientes' }) // La tabla se llamará "clientes"
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true }) // El email debe ser único para identificarlo
  email: string;

  @Column({ nullable: true }) // El teléfono es opcional
  telefono?: string;

  // --- HISTORIAL DE RESERVAS ---
  @OneToMany(() => Reserva, (reserva) => reserva.cliente) // <-- ¡Perfecto!
  reservas: Reserva[];
  
  // (Las líneas duplicadas comentadas se han eliminado)
}