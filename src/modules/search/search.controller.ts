import { SearchService } from "./search.service";
import { ILogger, Logger } from "../../libs/logging/logger";
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  Transport
} from "@nestjs/microservices";
import { INDEX_ARTICLE, SEARCH_ARTICLE } from "src/constants/broker.constant";
import { Controller } from "@nestjs/common";
import { CreateArticleDto } from "../article/dto/article.dto";
import { RpcException } from "@nestjs/microservices";

@Controller("search")
export class SearchController {
  private readonly logger: ILogger = Logger.getLogger();
  constructor(private readonly searchService: SearchService) {}

  @MessagePattern(INDEX_ARTICLE, Transport.RMQ)
  async index(
    @Payload() article: CreateArticleDto,
    @Ctx() context: RmqContext
  ) {
    this.logger.info(
      `[MessagePattern - ${INDEX_ARTICLE}] => ${JSON.stringify(article)}`
    );

    try {
      return await this.searchService.index(article, context);
    } catch (error: any) {
      throw new RpcException(error);
    }
  }

  @MessagePattern(SEARCH_ARTICLE, Transport.RMQ)
  async search(@Payload() text: string, @Ctx() context: RmqContext) {
    this.logger.info(
      `[MessagePattern - ${SEARCH_ARTICLE}] => ${JSON.stringify(text)}`
    );

    try {
      return await this.searchService.search(text, context);
    } catch (error: any) {
      throw new RpcException(error);
    }
  }
}
