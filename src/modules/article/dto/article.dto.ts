import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty } from "class-validator";

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
