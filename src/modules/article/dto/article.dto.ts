import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  ArrayNotEmpty
} from "class-validator";

export class CreateArticleDto {
  @ApiProperty({
    type: String,
    name: "name",
    description: "Name of the article",
    required: true,
    title: "Article Name",
    example: "My Article"
  })
  @IsNotEmpty()
  @IsString()
  public name: string;

  @ApiProperty({
    type: String,
    name: "body",
    description: "Body of the article",
    required: true,
    title: "Article Body",
    example: "This is my article"
  })
  @IsNotEmpty()
  @IsString()
  public body: string;

  @ApiProperty({
    type: String,
    name: "author",
    title: "Author ID",
    description: "Unique author ID of the article",
    required: true,
    example: "6439383e06b3b43356b39e4f"
  })
  @IsNotEmpty()
  @IsString()
  public author: string;

  @ApiProperty({
    type: Array,
    name: "categories",
    title: "Category List",
    description: "Category of the article",
    required: true,
    example: ["tech", "science"]
  })
  @IsArray()
  @ArrayNotEmpty()
  public categories: string[];

  @ApiProperty({
    type: Array,
    name: "tags",
    title: "Tag List",
    description: "Tag of the article",
    required: true,
    example: ["Ok", "Good"]
  })
  @IsArray()
  @ArrayNotEmpty()
  public tags: string[];
}

export class LikeDislikeArticleDto {
  @ApiProperty({
    type: String,
    name: "articleId",
    title: "Article ID",
    description: "Unique ID of the article",
    required: true,
    example: "6439383e06b3b43356b39e4f"
  })
  @IsNotEmpty()
  @IsString()
  public articleId: string;

  @ApiProperty({
    type: String,
    name: "userId",
    title: "User ID",
    description: "Unique ID of the User",
    required: true,
    example: "6439383e06b3b43356b39e4f"
  })
  @IsNotEmpty()
  @IsString()
  public userId: string;
}

// export class UpdateUserDto {
//   @ApiProperty({
//     type: String,
//     name: "firstName",
//     description: "First name of the user",
//     required: false,
//     title: "First Name",
//     example: "John"
//   })
//   @IsNotEmpty()
//   @IsString()
//   @IsOptional()
//   public firstName: string;

//   @ApiProperty({
//     type: String,
//     name: "lastName",
//     description: "Last name of the user",
//     required: false,
//     title: "Last Name",
//     example: "Doe"
//   })
//   @IsNotEmpty()
//   @IsString()
//   @IsOptional()
//   public lastName: string;

//   @ApiProperty({
//     type: String,
//     name: "email",
//     title: "Email",
//     description: "Email of the user",
//     required: false,
//     example: "abc@gmail.com"
//   })
//   @IsEmail()
//   @IsOptional()
//   public email: string;
// }

// export class UserResDto {
//   @ApiProperty({ type: Boolean, example: false })
//   error: boolean;

//   @ApiProperty({ type: Number, example: 201 })
//   statusCode: number;

//   @ApiProperty({ type: String, example: "CREATED" })
//   message: string;

//   @ApiProperty({ type: String, example: "object" })
//   type: string;

//   @ApiProperty({
//     type: Object,
//     properties: {
//       firstName: { type: "string", example: "John" },
//       lastName: { type: "string", example: "Doe" },
//       email: { type: "string", example: "abc@gmassil.com" },
//       likedArticles: { type: "array", example: [] },
//       _id: { type: "string", example: "6439383e06b3b43356b39e4f" },
//       createdAt: { type: "string", example: "2023-04-14T11:25:50.461Z" },
//       updatedAt: { type: "string", example: "2023-04-14T11:25:50.461Z" },
//       __v: { type: "number", example: 0 }
//     }
//   })
//   data: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     likedArticles: [];
//     _id: string;
//     createdAt: string;
//     updatedAt: string;
//     __v: number;
//   };
// }
