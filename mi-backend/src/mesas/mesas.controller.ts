// En: src/mesas/mesas.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe, // <-- AÑADIDO (Mejor práctica)
  Query, // <-- IMPORTADO (Para leer la URL)
} from '@nestjs/common';
import { MesasService } from './mesas.service';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { FindDisponiblesDto } from './dto/find-disponibles.dto'; // <-- IMPORTADO (Tu DTO de consulta)

@Controller('mesas')
export class MesasController {
  constructor(private readonly mesasService: MesasService) {}

  /**
   * -----------------------------------------------------------------
   * CONSULTA ESPECIAL: Disponibilidad
   * (Este es el nuevo método de las instrucciones)
   * -----------------------------------------------------------------
   */
  // 
  @Get('disponibles')
  findDisponibles(@Query() query: FindDisponiblesDto) {
    // Gracias al ValidationPipe en main.ts,
    // 'query' ya está validado y transformado.
    return this.mesasService.findDisponibles(query);
  }

  // --- Tus métodos CRUD ---

  @Post()
  create(@Body() createMesaDto: CreateMesaDto) {
    return this.mesasService.create(createMesaDto);
  }

  @Get()
  findAll() {
    return this.mesasService.findAll();
  }

  // --- 👇 MEJORADO CON ParseIntPipe ---
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mesasService.findOne(id);
  }

  // --- 👇 MEJORADO CON ParseIntPipe ---
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMesaDto: UpdateMesaDto) {
    return this.mesasService.update(id, updateMesaDto);
  }

  // --- 👇 MEJORADO CON ParseIntPipe ---
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mesasService.remove(id);
  }
}