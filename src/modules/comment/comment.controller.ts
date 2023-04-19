import { CommentService } from "./comment.service";
import { ILogger, Logger } from "../../libs/logging/logger";
import { CreateCommentDto } from "./dto/comment.dto";

import { Controller, Post, Body, UseInterceptors } from "@nestjs/common";
import { ResponseInterceptor } from "src/libs/core/response.interceptor";
import { ApiTags, ApiOperation, ApiCreatedResponse } from "@nestjs/swagger";

@ApiTags("Comment API")
@Controller("comment")
@UseInterceptors(ResponseInterceptor)
export class CommentController {
  private readonly logger: ILogger = Logger.getLogger();
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiCreatedResponse({
    description: "This api creates a new comment to an article.",
    type: () => CreateCommentDto
  })
  @ApiOperation({
    summary: "Create a new comment to an article"
  })
  async createComment(@Body() createCommentDto: CreateCommentDto) {
    this.logger.info(
      `[POST - /comment] => ${JSON.stringify(createCommentDto)}`
    );

    return await this.commentService.createComment(createCommentDto);
  }
}
