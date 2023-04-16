import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongoSchema } from "mongoose";
import { Article } from "./article.entity";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, trim: true })
  firstName: string;

  @Prop({ type: String, required: true, trim: true })
  lastName: string;

  @Prop({
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    // Note: Already validating in DTO
    // validate: {
    //   validator: function (v: string) {
    //     return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
    //   },
    //   message: "Please enter a valid email"
    // },
    required: [true, "Email required"]
  })
  email: string;

  @Prop({ type: [{ type: MongoSchema.Types.ObjectId, ref: "Article" }] })
  likedArticles: Article[];

  @Prop({ type: [{ type: MongoSchema.Types.ObjectId, ref: "Article" }] })
  dislikedArticles: Article[];

  @Prop({ type: Date })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
