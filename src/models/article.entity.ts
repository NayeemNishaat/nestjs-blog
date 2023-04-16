import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongoSchema } from "mongoose";
import { Comment } from "./comment.entity";
import { User } from "./user.entity";

export type ArticleDocument = HydratedDocument<Article>;

@Schema({ timestamps: true })
export class Article {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, required: true })
  body: string;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: "User" })
  author: User;

  @Prop({ type: Number, default: 0 })
  likes: number;

  @Prop({ type: Number, default: 0 })
  dislikes: number;

  @Prop({
    type: Array,
    default: []
  })
  categories: string[];

  @Prop({
    type: Array,
    default: []
  })
  tags: string[];

  @Prop({ type: [{ type: MongoSchema.Types.ObjectId, ref: "Comment" }] })
  comments: Comment[];
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
