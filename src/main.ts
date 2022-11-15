import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as session from 'express-session';


async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  
  const swaggerConfig = new DocumentBuilder()
    .setTitle ('MMM')
    .setDescription ('Fintech Startup')
    .setVersion ('0.0.1')
    .build()
  
  const swaggerInstance = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup ('docs', app, swaggerInstance)

  // app.useGlobalGuards()
  

  app.use(
    session({
      secret: 'sdfsdfsdf45345r4yt5454345345',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 30000,
      }
      // store: 
    }),
  );





  await app.listen(PORT, () => { console.log(`server started on port ${PORT}`); });
}
start();
