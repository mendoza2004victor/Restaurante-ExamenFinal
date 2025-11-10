// En: mi-backend/src/mesas/mesas.service.ts
import { 
  Injectable, 
  NotFoundException, 
  BadRequestException // <-- 1. Importar BadRequest
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesa } from './entities/mesa.entity';
import { Reserva } from 'src/reservas/entities/reserva.entity';
import { FindDisponiblesDto } from './dto/find-disponibles.dto';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';

@Injectable()
export class MesasService {
  private readonly DURACION_RESERVA_MS = 2 * 60 * 60 * 1000 - 1;

  constructor(
    @InjectRepository(Mesa)
    private readonly mesasRepository: Repository<Mesa>,
    @InjectRepository(Reserva) // <-- 2. Inyectar Repositorio de Reservas
    private readonly reservasRepository: Repository<Reserva>,
  ) {}

  // --- CRUD REAL ---
  async create(createMesaDto: CreateMesaDto): Promise<Mesa> {
    const existe = await this.mesasRepository.findOneBy({ numero: createMesaDto.numero });
    if (existe) {
      throw new BadRequestException(`Ya existe una mesa con el número ${createMesaDto.numero}`);
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
    const mesa = await this.mesasRepository.preload({
      id: id,
      ...updateMesaDto,
    });
    if (!mesa) {
      throw new NotFoundException(`Mesa con ID ${id} no encontrada`);
    }
    return this.mesasRepository.save(mesa);
  }

  // --- 3. MÉTODO REMOVE CORREGIDO ---
  async remove(id: number): Promise<Mesa> {
    // 3a. Revisar si la mesa tiene reservas (confirmadas o futuras)
    const reservasAsociadas = await this.reservasRepository.count({
      where: { 
        mesa: { id: id },
        estado: 'confirmada' 
      }
    });

    // 3b. Si tiene, lanzar un error 400 (amigable)
    if (reservasAsociadas > 0) {
      throw new BadRequestException(
        'No se puede eliminar la mesa: tiene reservas confirmadas asociadas.'
      );
    }

    // 3c. Si no tiene, buscarla y eliminarla
    const mesa = await this.findOne(id);
    return this.mesasRepository.remove(mesa);
  }

  // --- CONSULTA ESPECIAL (la que ya tenías) ---
  async findDisponibles(query: FindDisponiblesDto): Promise<Mesa[]> {
    const { fecha_hora, numero_personas } = query;
    const fechaReserva = new Date(fecha_hora);
    const inicioBloque = new Date(fechaReserva.getTime() - this.DURACION_RESERVA_MS);
    const finBloque = new Date(fechaReserva.getTime() + this.DURACION_RESERVA_MS);

    const subQuery = this.reservasRepository.createQueryBuilder('reserva')
      .select('reserva.mesaId')
      .where('reserva.fecha_hora BETWEEN :inicioBloque AND :finBloque', {
        inicioBloque,
        finBloque,
      })
      .andWhere('reserva.estado = :estado', { estado: 'confirmada' });

    return this.mesasRepository.createQueryBuilder('mesa')
      .where('mesa.capacidad >= :numero_personas', { numero_personas })
      .andWhere(`mesa.id NOT IN (${subQuery.getQuery()})`)
      .setParameters(subQuery.getParameters())
      .getMany();
  }
}