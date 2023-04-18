import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { AllExceptionFilter } from "./libs/core/all-exception.filter";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";

async function server() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URI],
      queue: process.env.RABBITMQ_QUEUE,
      noAck: false,
      queueOptions: { durable: false }
    }
  });

  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix("api/v1");

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFilter(httpAdapter));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true
    })
  );

  const config = new DocumentBuilder()
    .setTitle("Blog API")
    .setDescription("This API exposes the features for the Blog!")
    .setVersion("1.0.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
}
server();
