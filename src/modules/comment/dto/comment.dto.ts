import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateCommentDto {
  @ApiProperty({
    type: String,
    name: "body",
    description: "Body of a comment",
    required: true,
    title: "Comment body",
    example: "This is a comment"
  })
  @IsNotEmpty()
  @IsString()
  public body: string;

  @ApiProperty({
    type: String,
    name: "author",
    title: "Author ID",
    description: "Unique author ID of the Comment",
    required: true,
    example: "6439383e06b3b43356b39e4f"
  })
  @IsNotEmpty()
  @IsString()
  public author: string;

  @ApiProperty({
    type: String,
    name: "article",
    title: "Article ID",
    description: "Unique article ID of the Article",
    required: true,
    example: "6439383e06b3b43356b39e4f"
  })
  @IsNotEmpty()
  @IsString()
  public article: string;
}
