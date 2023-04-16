import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./modules/user/user.module";
import { ArticleModule } from "./modules/article/article.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.URI),
    UserModule,
    ArticleModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
