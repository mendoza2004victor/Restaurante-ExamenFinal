// En: src/reservas/reservas.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe, // Importamos el Pipe para validar IDs
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
  remove(@Param('id', ParseIntPipe) id: number) { // <-- AQUÍ ESTABA EL ERROR (KParseIntPipe)
    // Recordar que tu servicio 'remove' hace una cancelación (lógica),
    // lo cual es una excelente práctica.
    return this.reservasService.remove(id);
  }
}