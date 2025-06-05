import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule);
    
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }));

    const config = new DocumentBuilder()
      .setTitle('Магазин')
      .setDescription('API для управления интернет-магазином электроники')
      .setVersion('8.800.555.35.35')
      .addTag('products', 'Управление товарами и их характеристиками')
      .addTag('categories', 'Управление категориями товаров')
      .addTag('orders', 'Управление заказами и их статусами')
      .addTag('users', 'Управление пользователями и их данными')
      .addTag('cart', 'Управление корзиной покупок')
      .addTag('wishlist', 'Управление списком желаний')
      .addTag('reviews', 'Управление отзывами о товарах')
      .addTag('addresses', 'Управление адресами доставки')
      .addTag('order-statuses', 'Управление статусами заказов')
      .addTag('payment-methods', 'Управление способами оплаты')
      .addTag('warehouses', 'Управление складами и инвентарем')
      .addTag('system', 'Системные эндпоинты')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

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