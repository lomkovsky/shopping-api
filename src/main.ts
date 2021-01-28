import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // swagger options
  const options = new DocumentBuilder()
    .setTitle('IvorySoft messenger')
    .setDescription('The IvorySoft messenger API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.API_PORT, () => {
    console.log(
      `API: http://${process.env.API_ADDRESS}:${process.env.API_PORT}`,
    );
  });
}
bootstrap();
