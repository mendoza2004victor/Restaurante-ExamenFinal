import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Habilitar CORS

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Ignora data que no esté en el DTO
    forbidNonWhitelisted: true, // Lanza error si llega data extraña
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

