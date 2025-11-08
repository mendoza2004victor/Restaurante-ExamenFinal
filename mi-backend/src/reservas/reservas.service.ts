// En: src/reservas/reservas.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { Repository, Between } from 'typeorm'; // <-- 'Between' ya está aquí
import { Mesa } from 'src/mesas/entities/mesa.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';

@Injectable()
export class ReservasService {
  // Horario de apertura (12:00) y cierre (22:00)
  private readonly HORA_APERTURA = 12;
  private readonly HORA_CIERRE = 22; // Cierre a las 22:00
  private readonly DURACION_RESERVA_MS = 2 * 60 * 60 * 1000 - 1; // 2 horas (menos 1ms para no solapar)

  constructor(
    @InjectRepository(Reserva)
    private readonly reservasRepository: Repository<Reserva>,
    @InjectRepository(Mesa) // <-- Inyectar repositorio de Mesas
    private readonly mesasRepository: Repository<Mesa>,
    @InjectRepository(Cliente) // <-- Inyectar repositorio de Clientes
    private readonly clientesRepository: Repository<Cliente>,
  ) {}

  /**
   * -----------------------------------------------------------------
   * CREAR UNA NUEVA RESERVA (CON VALIDACIONES)
   * -----------------------------------------------------------------
   */
  async create(createReservaDto: CreateReservaDto) {
    // ... (Tu lógica de 'create' que ya tienes... la dejamos intacta)
    const { clienteId, mesaId, numero_personas, fecha_hora } = createReservaDto;

    // --- 1. Buscar entidades relacionadas ---
    const cliente = await this.clientesRepository.findOneBy({ id: clienteId });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${clienteId} no encontrado`);
    }

    const mesa = await this.mesasRepository.findOneBy({ id: mesaId });
    if (!mesa) {
      throw new NotFoundException(`Mesa con ID ${mesaId} no encontrada`);
    }

    const fechaReserva = new Date(fecha_hora);

    // --- VALIDACIÓN 1: Horario Laborable ---
    const horaReserva = fechaReserva.getHours();
    if (horaReserva < this.HORA_APERTURA || horaReserva >= this.HORA_CIERRE) {
      throw new BadRequestException(
        `El restaurante está cerrado a esa hora. (Horario: ${this.HORA_APERTURA}:00 - ${this.HORA_CIERRE}:00)`,
      );
    }

    // --- VALIDACIÓN 2: Capacidad de la Mesa ---
    if (numero_personas > mesa.capacidad) {
      throw new BadRequestException(
        `El número de personas (${numero_personas}) excede la capacidad de la mesa (${mesa.capacidad})`,
      );
    }

    // --- VALIDACIÓN 3: Doble Reserva (la más importante) ---
    const inicioBloque = new Date(fechaReserva.getTime() - this.DURACION_RESERVA_MS);
    const finBloque = new Date(fechaReserva.getTime() + this.DURACION_RESERVA_MS);

    const reservaExistente = await this.reservasRepository.findOne({
      where: {
        mesa: { id: mesaId },
        estado: 'confirmada',
        fecha_hora: Between(inicioBloque, finBloque),
      },
    });

    if (reservaExistente) {
      throw new BadRequestException(
        `La mesa ya está reservada en ese horario o en un horario cercano.`,
      );
    }

    // --- CREACIÓN DE LA RESERVA ---
    const nuevaReserva = this.reservasRepository.create({
      fecha_hora: fechaReserva,
      numero_personas: numero_personas,
      cliente: cliente,
      mesa: mesa,
      estado: 'confirmada',
    });

    return this.reservasRepository.save(nuevaReserva);
  }

  /* -----------------------------------------------------------------
   * MÉTODOS CRUD BÁSICOS (GENERADOS POR EL CLI)
   * ----------------------------------------------------------------- */

  findAll() {
    return this.reservasRepository.find({
      relations: ['cliente', 'mesa'],
    });
  }

  findOne(id: number) {
    const reserva = this.reservasRepository.findOne({
      where: { id },
      relations: ['cliente', 'mesa'],
    });
    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }
    return reserva;
  }

  async remove(id: number) {
    const reserva = await this.findOne(id);
    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }
    reserva.estado = 'cancelada';
    return this.reservasRepository.save(reserva);
  }

  // --- 👇 AQUÍ ESTÁ EL NUEVO MÉTODO DE LAS INSTRUCCIONES ---

  /**
   * -----------------------------------------------------------------
   * CONSULTA ESPECIAL: Reservas del Día
   * -----------------------------------------------------------------
   */
  async findReservasDelDia() {
    // 1. Definir el rango del día de "hoy"
    const hoyInicio = new Date();
    hoyInicio.setHours(0, 0, 0, 0); // Medianoche de hoy

    const hoyFin = new Date();
    hoyFin.setHours(23, 59, 59, 999); // Fin del día de hoy

    // 2. Buscar reservas confirmadas en ese rango
    
    return this.reservasRepository.find({
      where: {
        fecha_hora: Between(hoyInicio, hoyFin),
        estado: 'confirmada',
      },
      relations: ['cliente', 'mesa'], // Cargar datos de cliente y mesa
      order: {
        fecha_hora: 'ASC', // Ordenarlas por hora
      },
    });
  }
}