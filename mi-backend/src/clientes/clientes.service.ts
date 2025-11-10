// En: src/clientes/clientes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClientesService {
  
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  /**
   * -----------------------------------------------------------------
   * MÉTODOS CRUD REALES
   * -----------------------------------------------------------------
   */

  /**
   * Lógica de "Buscar o Crear" (Find or Create).
   * Esto soluciona tu error de 'clientId'.
   */
  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    // 1. Buscamos si el cliente ya existe por su email
    const clienteExistente = await this.clienteRepository.findOne({
      where: { email: createClienteDto.email },
    });

    // 2. Si ya existe, lo devolvemos (así el frontend obtiene su ID)
    if (clienteExistente) {
      return clienteExistente;
    }

    // 3. Si no existe, creamos uno nuevo, lo guardamos y lo devolvemos
    const nuevoCliente = this.clienteRepository.create(createClienteDto);
    return this.clienteRepository.save(nuevoCliente);
  }

  async findAll(): Promise<Cliente[]> {
    return this.clienteRepository.find();
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOneBy({ id });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.clienteRepository.preload({
      id: id,
      ...updateClienteDto,
    });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return this.clienteRepository.save(cliente);
  }

  async remove(id: number): Promise<Cliente> {
    const cliente = await this.findOne(id); // findOne ya maneja el 404
    return this.clienteRepository.remove(cliente);
  }

  /**
   * -----------------------------------------------------------------
   * CONSULTA ESPECIAL (La que ya tenías)
   * -----------------------------------------------------------------
   */
  async findHistorial(id: number) {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: ['reservas', 'reservas.mesa'],
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return cliente.reservas;
  }
}