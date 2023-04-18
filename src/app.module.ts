import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerModule } from "@nestjs/throttler";
import { UserModule } from "./modules/user/user.module";
import { ArticleModule } from "./modules/article/article.module";
import { CommentModule } from "./modules/comment/comment.module";
import { SearchModule } from "./modules/search/search.module";

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: +process.env.THROTTLE_TTL,
      limit: +process.env.THROTTLE_LIMIT
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI
      })
    }),
    SearchModule,
    UserModule,
    ArticleModule,
    CommentModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
