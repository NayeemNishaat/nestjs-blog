import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Article, ArticleSchema } from "src/models/article.entity";
import { User, UserSchema } from "src/models/user.entity";
import { ArticleService } from "./article.service";
import { ArticleController } from "./article.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [ArticleController],
  providers: [ArticleService]
})
export class ArticleModule {}
