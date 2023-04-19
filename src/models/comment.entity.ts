import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongoSchema } from "mongoose";
import { User } from "./user.entity";

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: String, required: true })
  body: string;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: "User" })
  author: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
