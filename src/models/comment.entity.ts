import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongoSchema } from "mongoose";
import { User } from "./user.entity";
import { Article } from "./article.entity";

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ type: String, required: true })
  body: string;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: "User" })
  author: User;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: "Article" })
  article: Article;

  //   @Prop()
  //   createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
