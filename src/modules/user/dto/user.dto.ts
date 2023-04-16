import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail, IsOptional } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    type: String,
    name: "firstName",
    description: "First name of the user",
    required: true,
    title: "First Name",
    example: "John"
  })
  @IsNotEmpty()
  @IsString()
  public firstName: string;

  @ApiProperty({
    type: String,
    name: "lastName",
    description: "Last name of the user",
    required: true,
    title: "Last Name",
    example: "Doe"
  })
  @IsNotEmpty()
  @IsString()
  public lastName: string;

  @ApiProperty({
    type: String,
    name: "email",
    title: "Email",
    description: "Email of the user",
    required: true,
    example: "abc@gmail.com"
  })
  @IsEmail()
  public email: string;
}

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    name: "firstName",
    description: "First name of the user",
    required: false,
    title: "First Name",
    example: "John"
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  public firstName: string;

  @ApiProperty({
    type: String,
    name: "lastName",
    description: "Last name of the user",
    required: false,
    title: "Last Name",
    example: "Doe"
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  public lastName: string;

  @ApiProperty({
    type: String,
    name: "email",
    title: "Email",
    description: "Email of the user",
    required: false,
    example: "abc@gmail.com"
  })
  @IsEmail()
  @IsOptional()
  public email: string;
}

export class UserResDto {
  @ApiProperty({ type: Boolean, example: false })
  error: boolean;

  @ApiProperty({ type: Number, example: 201 })
  statusCode: number;

  @ApiProperty({ type: String, example: "CREATED" })
  message: string;

  @ApiProperty({ type: String, example: "object" })
  type: string;

  @ApiProperty({
    type: Object,
    properties: {
      firstName: { type: "string", example: "John" },
      lastName: { type: "string", example: "Doe" },
      email: { type: "string", example: "abc@gmassil.com" },
      likedArticles: { type: "array", example: [] },
      _id: { type: "string", example: "6439383e06b3b43356b39e4f" },
      createdAt: { type: "string", example: "2023-04-14T11:25:50.461Z" },
      updatedAt: { type: "string", example: "2023-04-14T11:25:50.461Z" },
      __v: { type: "number", example: 0 }
    }
  })
  data: {
    firstName: string;
    lastName: string;
    email: string;
    likedArticles: [];
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}
