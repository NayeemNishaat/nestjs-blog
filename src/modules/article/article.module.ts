import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CacheModule } from "@nestjs/cache-manager";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { Article, ArticleSchema } from "src/models/article.entity";
import { User, UserSchema } from "src/models/user.entity";
import { ArticleService } from "./article.service";
import { ArticleSearchService } from "./article-search.service";
import { ArticleController } from "./article.controller";
import { SearchModule } from "../search/search.module";

@Module({
  imports: [
    CacheModule.register({
      ttl: +process.env.TTL, // Remark: Caching expires after 30 seconds.
      max: +process.env.MAX_ITEMS
    }),
    SearchModule,
    // ElasticsearchModule.registerAsync({
    //   useFactory: () => ({
    //     node: process.env.ELASTIC_URI
    //   })
    // }),
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleSearchService]
})
export class ArticleModule {}
