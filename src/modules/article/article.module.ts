import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CacheModule } from "@nestjs/cache-manager";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { Article, ArticleSchema } from "../../models/article.entity";
import { User, UserSchema } from "../../models/user.entity";
import { Comment, CommentSchema } from "../../models/comment.entity";
import { ArticleService } from "./article.service";
import { ArticleController } from "./article.controller";
import { SEARCH_CLIENT } from "../../constants/module.constant";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";

@Module({
  imports: [
    CacheModule.register({
      ttl: +process.env.TTL, // Remark: Caching expires after 30 seconds.
      max: +process.env.MAX_ITEMS
    }),
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }])
  ],
  controllers: [ArticleController],
  providers: [
    ArticleService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: SEARCH_CLIENT,
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URI],
            queue: process.env.RABBITMQ_QUEUE,
            noAck: false,
            queueOptions: { durable: false }
          }
        })
    }
  ]
})
export class ArticleModule {}
