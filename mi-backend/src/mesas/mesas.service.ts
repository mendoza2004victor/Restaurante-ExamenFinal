// En: src/mesas/mesas.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesa } from './entities/mesa.entity';
import { Reserva } from 'src/reservas/entities/reserva.entity';
import { FindDisponiblesDto } from './dto/find-disponibles.dto';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';

@Injectable()
export class MesasService {
  // Constante para la duración del bloqueo de reserva
  private readonly DURACION_RESERVA_MS = 2 * 60 * 60 * 1000 - 1; // 2 horas (menos 1ms)

  constructor(
    @InjectRepository(Mesa)
    private readonly mesasRepository: Repository<Mesa>,
    @InjectRepository(Reserva)
    private readonly reservasRepository: Repository<Reserva>,
  ) {}

  /**
   * -----------------------------------------------------------------
   * CRUD REAL (Estos son los métodos que sí funcionan)
   * -----------------------------------------------------------------
   */
  async create(createMesaDto: CreateMesaDto): Promise<Mesa> {
    // Validar si el número de mesa ya existe
    const existe = await this.mesasRepository.findOneBy({ numero: createMesaDto.numero });
    if (existe) {
      throw new NotFoundException(`Ya existe una mesa con el número ${createMesaDto.numero}`);
    }
    const nuevaMesa = this.mesasRepository.create(createMesaDto);
    return this.mesasRepository.save(nuevaMesa);
  }

  findAll(): Promise<Mesa[]> {
    return this.mesasRepository.find();
  }

  async findOne(id: number): Promise<Mesa> {
    const mesa = await this.mesasRepository.findOneBy({ id });
    if (!mesa) {
      throw new NotFoundException(`Mesa con ID ${id} no encontrada`);
    }
    return mesa;
  }

  async update(id: number, updateMesaDto: UpdateMesaDto): Promise<Mesa> {
    // preload carga la entidad existente y aplica los nuevos cambios
    const mesa = await this.mesasRepository.preload({
      id: id,
      ...updateMesaDto,
    });
    if (!mesa) {
      throw new NotFoundException(`Mesa con ID ${id} no encontrada`);
    }
    return this.mesasRepository.save(mesa);
  }

  async remove(id: number): Promise<Mesa> {
    const mesa = await this.findOne(id); // findOne ya maneja el error 404
    return this.mesasRepository.remove(mesa);
  }

  /**
   * -----------------------------------------------------------------
   * CONSULTA ESPECIAL: Disponibilidad (Completa y Corregida)
   * -----------------------------------------------------------------
   */
  async findDisponibles(query: FindDisponiblesDto): Promise<Mesa[]> {
    const { fecha_hora, numero_personas } = query;

    // 1. Calcular el bloque de tiempo
    const fechaReserva = new Date(fecha_hora);
    const inicioBloque = new Date(fechaReserva.getTime() - this.DURACION_RESERVA_MS);
    const finBloque = new Date(fechaReserva.getTime() + this.DURACION_RESERVA_MS);

    // 2. Construir la Sub-Consulta (Mesas OCUPADAS)
    const subQuery = this.reservasRepository.createQueryBuilder('reserva')
      .select('reserva.mesaId') // Selecciona solo el ID de la mesa
      .where('reserva.fecha_hora BETWEEN :inicioBloque AND :finBloque', {
        inicioBloque,
        finBloque,
      })
      .andWhere('reserva.estado = :estado', { estado: 'confirmada' });

    // 3. Construir la Consulta Principal (Mesas DISPONIBLES)
    // Selecciona mesas que cumplan capacidad Y NO ESTÉN en la subconsulta
    return this.mesasRepository.createQueryBuilder('mesa')
      .where('mesa.capacidad >= :numero_personas', { numero_personas })
      .andWhere(`mesa.id NOT IN (${subQuery.getQuery()})`) // <-- La parte que faltaba
      .setParameters(subQuery.getParameters()) // Importante: pasar los parámetros
      .getMany(); // Devuelve la lista de mesas disponibles
  }
}