import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Message } from './message.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<Message | null> { // Añade async y el tipo de retorno
  return this.appService.getHello();
}
}
