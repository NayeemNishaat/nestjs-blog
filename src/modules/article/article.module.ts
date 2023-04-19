import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CacheModule } from "@nestjs/cache-manager";
import { ClientsModule } from "@nestjs/microservices";
import { Article, ArticleSchema } from "src/models/article.entity";
import { User, UserSchema } from "src/models/user.entity";
import { ArticleService } from "./article.service";
import { ArticleController } from "./article.controller";
import { SEARCH_CLIENT } from "src/constants/module.constant";
import { Transport } from "@nestjs/microservices";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";

@Module({
  imports: [
    CacheModule.register({
      ttl: +process.env.TTL, // Remark: Caching expires after 30 seconds.
      max: +process.env.MAX_ITEMS
    }),
    ClientsModule.register([
      {
        name: SEARCH_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost:5672"],
          queue: "laby",
          noAck: false,
          queueOptions: { durable: false }
        }
      }
    ]),
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [ArticleController],
  providers: [
    ArticleService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class ArticleModule {}
