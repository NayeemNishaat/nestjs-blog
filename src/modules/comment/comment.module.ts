import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Comment, CommentSchema } from "src/models/comment.entity";
import { Article, ArticleSchema } from "src/models/article.entity";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }])
  ],
  controllers: [CommentController],
  providers: [
    CommentService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class CommentModule {}
