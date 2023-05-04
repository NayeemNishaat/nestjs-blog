import { Inject, Injectable } from "@nestjs/common";
import { Model, UpdateQuery } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Article } from "../../models/article.entity";
import { User } from "../../models/user.entity";
import { CreateArticleDto, LikeDislikeArticleDto } from "./dto/article.dto";
import { SEARCH_CLIENT } from "../../constants/module.constant";
import { ClientProxy } from "@nestjs/microservices";
import { INDEX_ARTICLE, SEARCH_ARTICLE } from "../../constants/broker.constant";
import { firstValueFrom } from "rxjs";

interface iArticle extends Article {
  id: string;
}
@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private articleModel: Model<Article>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    @Inject(SEARCH_CLIENT) private client: ClientProxy
  ) {}

  async createArticle(createArticleDto: CreateArticleDto): Promise<Article> {
    const createdArticle = new this.articleModel(createArticleDto);
    await createdArticle.save();
    createArticleDto["id"] = createdArticle._id;
    console.log(this.client);
    const res = this.client.send(INDEX_ARTICLE, createArticleDto);
    res.subscribe();

    return createdArticle;
  }

  async searchArticles(text: string, page: number, limit: number) {
    const results = await firstValueFrom<{ _source: iArticle }[]>(
      this.client.send(SEARCH_ARTICLE, text)
    );

    const ids = results.map((result) => result._source.id);
    if (!ids.length) {
      return [];
    }
    return this.articleModel
      .find({
        _id: { $in: ids }
      })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async getArticleById(id: string): Promise<Article> {
    return await this.articleModel.findOne({ _id: id }).populate([
      { path: "author", model: "User" },
      {
        path: "comments",
        model: "Comment",
        populate: { path: "author", model: "User" }
      }
    ]);
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
