// En: src/app.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class AppService implements OnModuleInit { // Implementamos OnModuleInit

  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  // Esto se ejecutará una vez al inicio para sembrar datos
  async onModuleInit() {
    const testMessage = await this.messageRepository.findOne({ where: { id: 1 } });
    if (!testMessage) {
      // Si no hay mensaje, crea uno
      const newMessage = this.messageRepository.create({ text: '¡Datos reales desde PostgreSQL!' });
      await this.messageRepository.save(newMessage);
    }
  }

  // El método que llamará el controlador
  async getHello(): Promise<Message | null> {
    // Busca el primer mensaje (o el de ID 1)
    return this.messageRepository.findOne({ where: { id: 1 } });
  }
}