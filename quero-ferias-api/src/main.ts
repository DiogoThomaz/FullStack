import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';

/*
Instancias:
useGlobalPipes --> valida o DTO recebido
*/

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  //app.useGlobalFilters(new HttpExceptionFilter()); //* habilita o filtro de exceções
  app.enableCors();                                  //! habilita o cors 
  await app.listen(3001);
}
bootstrap();

