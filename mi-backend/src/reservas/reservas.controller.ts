// En: src/reservas/reservas.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query, // <-- 1. IMPORTAR Query
  BadRequestException, // <-- 2. IMPORTAR BadRequestException
} from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  create(@Body() createReservaDto: CreateReservaDto) {
    return this.reservasService.create(createReservaDto);
  }

  /**
   * CONSULTA ESPECIAL: Reservas del Día
   */
  @Get('hoy') // Queda como GET /reservas/hoy
  findReservasDelDia() {
    return this.reservasService.findReservasDelDia();
  }

  // --- 👇 AQUÍ ESTÁ EL ENDPOINT NUEVO AÑADIDO ---
  
  /**
   * CONSULTA ESPECIAL: Reservas por Fecha
   */
  @Get('por-fecha')
  findReservasPorFecha(@Query('fecha') fecha: string) {
    if (!fecha) {
      throw new BadRequestException('El parámetro "fecha" es requerido');
    }
    // (Idealmente, validaríamos que 'fecha' sea una fecha ISO 'YYYY-MM-DD')
    return this.reservasService.findReservasPorFecha(fecha);
  }

  // --- 👆 HASTA AQUÍ ---

  @Get()
  findAll() {
    return this.reservasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.findOne(id);
  }

  // (El método 'update' (Patch) lo omitimos por ahora)

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { 
    return this.reservasService.remove(id);
  }
}