import { ApiProperty } from "@nestjs/swagger";

export class ResponseBaseDTO<T> {
  @ApiProperty({
    name: "error",
    type: Boolean,
    description:
      "A boolean value indicating whether the response is an error or not.",
    example: false
  })
  readonly error: boolean;

  @ApiProperty({
    name: "code",
    type: String,
    description:
      "A constant value representing the response. Ideal for making specific client side checks.",
    example: "RESPONSE_SUCCESSFUL"
  })
  readonly statusString?: string;

  @ApiProperty({
    name: "statusCode",
    type: Number,
    description: "A constant value representing the response status code.",
    example: 200
  })
  readonly statusCode: number;

  @ApiProperty({
    name: "message",
    type: String,
    description: "A human readable message describing the response status",
    example: "successful"
  })
  readonly message: string;

  @ApiProperty({
    name: "type",
    type: String,
    description: "The data type of the returned data (array|object)",
    example: "array"
  })
  readonly type: string;

  @ApiProperty({
    name: "data",
    description: "The data returned by the API"
  })
  readonly data: T;
}
