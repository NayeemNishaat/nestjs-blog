import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Article } from "../../models/article.entity";
import { Comment } from "../../models/comment.entity";
import { CreateCommentDto } from "./dto/comment.dto";

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Article.name)
    private articleModel: Model<Article>,
    @InjectModel(Comment.name)
    private commentModel: Model<Comment>
  ) {}

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const createdComment = new this.commentModel(createCommentDto);
    const newComment = await createdComment.save();

    await this.articleModel.updateOne(
      { _id: createCommentDto.article },
      { $push: { comments: newComment._id } }
    );

    return newComment;
  }
}
