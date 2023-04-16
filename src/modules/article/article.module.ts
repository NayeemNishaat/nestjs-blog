import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CacheModule } from "@nestjs/cache-manager";
import { Article, ArticleSchema } from "src/models/article.entity";
import { User, UserSchema } from "src/models/user.entity";
import { ArticleService } from "./article.service";
import { ArticleController } from "./article.controller";

@Module({
  imports: [
    CacheModule.register({
      ttl: 30 * 1000, // Remark: Caching expires after 30 seconds.
      max: 50
    }),
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [ArticleController],
  providers: [ArticleService]
})
export class ArticleModule {}
