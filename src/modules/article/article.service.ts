import { Injectable, HttpException } from "@nestjs/common";
import { Model, UpdateQuery } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Article } from "src/models/article.entity";
import { User } from "src/models/user.entity";
import { CreateArticleDto, LikeDislikeArticleDto } from "./dto/article.dto";

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private articleModel: Model<Article>,
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {}

  async createArticle(createArticleDto: CreateArticleDto): Promise<Article> {
    const createdArticle = new this.articleModel(createArticleDto);
    return await createdArticle.save();
  }

  async getArticleById(id: string): Promise<Article> {
    return await this.articleModel.findOne({ _id: id }).populate("author");
  }

  async getAllArticles(page: number, limit: number): Promise<Article[]> {
    return await this.articleModel
      .find({})
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async likeArticle(
    likeDislikeArticleDto: LikeDislikeArticleDto
  ): Promise<UpdateQuery<Article>> {
    // Part: If user already disliked the article, remove it
    const alreadyDisliked = await this.userModel.count({
      _id: likeDislikeArticleDto.userId,
      dislikedArticles: { $in: [likeDislikeArticleDto.articleId] }
    });

    if (alreadyDisliked) {
      await this.userModel.updateOne(
        { _id: likeDislikeArticleDto.userId },
        {
          $pull: { dislikedArticles: likeDislikeArticleDto.articleId }
        }
      );

      await this.articleModel.updateOne(
        { _id: likeDislikeArticleDto.articleId },
        {
          $inc: { dislikes: -1 }
        }
      );
    }

    // Part: If user already liked the article, then unlike it
    const alreadyLiked = await this.userModel.count({
      _id: likeDislikeArticleDto.userId,
      likedArticles: { $in: [likeDislikeArticleDto.articleId] }
    });

    if (alreadyLiked) {
      await this.userModel.updateOne(
        { _id: likeDislikeArticleDto.userId },
        {
          $pull: { likedArticles: likeDislikeArticleDto.articleId }
        }
      );

      return await this.articleModel.updateOne(
        { _id: likeDislikeArticleDto.articleId },
        {
          $inc: { likes: -1 }
        }
      );
    }

    // Part: If user already disliked the article, then remove dislike and add like
    await this.userModel.updateOne(
      { _id: likeDislikeArticleDto.userId },
      {
        $addToSet: { likedArticles: likeDislikeArticleDto.articleId }
      }
    );
    return await this.articleModel.updateOne(
      { _id: likeDislikeArticleDto.articleId },
      {
        $inc: { likes: 1 }
      }
    );
  }

  async dislikeArticle(
    likeDislikeArticleDto: LikeDislikeArticleDto
  ): Promise<UpdateQuery<Article>> {
    // Part: If user already liked the article, remove it
    const alreadyLiked = await this.userModel.count({
      _id: likeDislikeArticleDto.userId,
      likedArticles: { $in: [likeDislikeArticleDto.articleId] }
    });

    if (alreadyLiked) {
      await this.userModel.updateOne(
        { _id: likeDislikeArticleDto.userId },
        {
          $pull: { likedArticles: likeDislikeArticleDto.articleId }
        }
      );

      await this.articleModel.updateOne(
        { _id: likeDislikeArticleDto.articleId },
        {
          $inc: { likes: -1 }
        }
      );
    }

    // Part: If user already disliked the article remove it
    const alreadyDisliked = await this.userModel.count({
      _id: likeDislikeArticleDto.userId,
      dislikedArticles: { $in: [likeDislikeArticleDto.articleId] }
    });

    if (alreadyDisliked) {
      await this.userModel.updateOne(
        { _id: likeDislikeArticleDto.userId },
        {
          $pull: { dislikedArticles: likeDislikeArticleDto.articleId }
        }
      );

      return await this.articleModel.updateOne(
        { _id: likeDislikeArticleDto.articleId },
        {
          $inc: { dislikes: -1 }
        }
      );
    }

    // Part: If user didn't like or dislike the article before add it to disliked articles
    await this.userModel.updateOne(
      { _id: likeDislikeArticleDto.userId },
      {
        $addToSet: { dislikedArticles: likeDislikeArticleDto.articleId }
      }
    );
    return await this.articleModel.updateOne(
      { _id: likeDislikeArticleDto.articleId },
      {
        $inc: { dislikes: 1 }
      }
    );
  }
}
