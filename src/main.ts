import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });
  await app.listen(3000);

  console.log(`App started at port - ${await app.getUrl()}`);
}
bootstrap();
