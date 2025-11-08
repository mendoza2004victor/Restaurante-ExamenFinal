// En: src/clientes/clientes.controller.ts

// --- 👇 'ParseIntPipe' FUE AÑADIDO AQUÍ ---
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  findAll() {
    return this.clientesService.findAll();
  }

  // --- 👇 MEJORADO CON ParseIntPipe ---
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.findOne(id);
  }

  // --- 👇 MEJORADO CON ParseIntPipe ---
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(id, updateClienteDto);
  }

  // --- 👇 MEJORADO CON ParseIntPipe ---
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.remove(id);
  }

  // --- 👇 AQUÍ ESTÁ EL NUEVO ENDPOINT DE LAS INSTRUCCIONES ---
  /**
   * CONSULTA ESPECIAL: Historial de Reservas
   */
  
  @Get(':id/historial')
  findHistorial(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.findHistorial(id);
  }
}