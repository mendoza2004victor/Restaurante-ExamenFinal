// En: src/clientes/clientes.service.ts

// --- 👇 AÑADIMOS LAS IMPORTACIONES ---
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClientesService {
  
  // --- 👇 PASO 1: INYECTAR EL REPOSITORIO (¡Esto es lo que te falta!) ---
  // Ahora la clase tiene 'this.clienteRepository' para hablar con la DB
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  // --- (Tus métodos antiguos. Los dejamos como están por ahora) ---

  create(createClienteDto: CreateClienteDto) {
    return 'This action adds a new cliente';
  }

  findAll() {
    return `This action returns all clientes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cliente`;
  }

  update(id: number, updateClienteDto: UpdateClienteDto) {
    return `This action updates a #${id} cliente`;
  }

  remove(id: number) {
    return `This action removes a #${id} cliente`;
  }

  // --- 👇 PASO 2: AÑADIR EL NUEVO MÉTODO DE LAS INSTRUCCIONES ---

  /**
   * -----------------------------------------------------------------
   * CONSULTA ESPECIAL: Historial de Reservas de un Cliente
   * -----------------------------------------------------------------
   */
  async findHistorial(id: number) {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      // ¡Pedimos a TypeORM que cargue la relación 'reservas'
      // y también las 'mesas' de esas reservas!
      relations: ['reservas', 'reservas.mesa'],
    });

    

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    // Devolvemos solo la lista de reservas del cliente
    return cliente.reservas;
  }
}