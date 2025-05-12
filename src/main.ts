import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule);
    

    app.enableCors();
    

    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`Запускаемся на http://localhost:${port}`);
  } catch (error) {
    logger.error('Ошибка при запуске :(', error);
    process.exit(1);
  }
}

bootstrap();