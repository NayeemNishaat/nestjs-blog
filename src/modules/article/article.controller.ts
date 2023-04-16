import { ArticleService } from "./article.service";
import { ILogger, Logger } from "../../libs/logging/logger";
import {
  CreateArticleDto,
  LikeDislikeArticleDto as LikeDislikeArticleDto
} from "./dto/article.dto";

import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  Query,
  UseInterceptors,
  HttpException
} from "@nestjs/common";
import { ResponseInterceptor } from "src/libs/core/response.interceptor";
import {
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiCreatedResponse
} from "@nestjs/swagger";

@ApiTags("Article API")
@Controller("article")
@UseInterceptors(ResponseInterceptor)
export class ArticleController {
  private readonly logger: ILogger = Logger.getLogger();
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @ApiCreatedResponse({
    description: "This api creates a new Article.",
    type: () => CreateArticleDto
  })
  @ApiOperation({
    summary: "Create a new Article"
  })
  async createArticle(@Body() createArticleDto: CreateArticleDto) {
    try {
      this.logger.info(
        `[POST - /article] => ${JSON.stringify(createArticleDto)}`
      );
      return await this.articleService.createArticle(createArticleDto);
    } catch (err: any) {
      throw new HttpException("Name must be unique", 400);
    }
  }

  @Get(":id")
  @ApiOkResponse({
    description: "Get an Article by id",
    type: CreateArticleDto
  })
  @ApiOperation({
    summary: "Get an Article by id"
  })
  async getArticleById(@Param("id") id: string) {
    this.logger.info(`[GET - /user/:id] => ${JSON.stringify({ id })}`);

    try {
      return await this.articleService.getArticleById(id);
    } catch (err: any) {
      throw new HttpException("Article not found", 404);
    }
  }

  @Get()
  @ApiOkResponse({
    description: "Get all Articles",
    type: CreateArticleDto,
    isArray: true
  })
  @ApiOperation({
    summary: "Get all Articles"
  })
  async getAllArticles(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ) {
    this.logger.info(`[GET - /user] => ${JSON.stringify(null)}`);

    if (page < 1) throw new HttpException("Page must be greater than 0", 400);

    return await this.articleService.getAllArticles(page, limit);
  }

  @Patch("/like")
  @ApiOkResponse({
    description: "This api is used to like an Article.",
    type: LikeDislikeArticleDto
  })
  @ApiOperation({
    summary: "Like an Article"
  })
  async likeArticle(@Body() likeDislikeArticleDto: LikeDislikeArticleDto) {
    this.logger.info(
      `[Patch - /user/:id] =>\n\n${JSON.stringify(
        { likeDislikeArticleDto },
        null,
        2
      )}`
    );

    return await this.articleService.likeArticle(likeDislikeArticleDto);
  }

  @Patch("/dislike")
  @ApiOkResponse({
    description: "This api is used to dislike an Article.",
    type: LikeDislikeArticleDto
  })
  @ApiOperation({
    summary: "Disike an Article"
  })
  async dislikeArticle(@Body() likeDislikeArticleDto: LikeDislikeArticleDto) {
    this.logger.info(
      `[Patch - /user/:id] =>\n\n${JSON.stringify(
        { likeDislikeArticleDto },
        null,
        2
      )}`
    );

    return await this.articleService.dislikeArticle(likeDislikeArticleDto);
  }
}
