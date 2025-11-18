import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Registra o filtro de exceção globalmente
  app.useGlobalFilters(new HttpExceptionFilter());

  // Habilita o CORS para permitir requisições de outros domínios
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
