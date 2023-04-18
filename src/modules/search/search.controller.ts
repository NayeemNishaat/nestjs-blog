import { SearchService } from "./search.service";
import { ILogger, Logger } from "../../libs/logging/logger";
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  Transport
} from "@nestjs/microservices";
import { INDEX_ARTICLE } from "src/constants/broker.constant";
import { Controller, UseInterceptors } from "@nestjs/common";
import { ResponseInterceptor } from "src/libs/core/response.interceptor";
import { CreateArticleDto } from "../article/dto/article.dto";
import { ElasticsearchService } from "@nestjs/elasticsearch";

@Controller("search")
@UseInterceptors(ResponseInterceptor)
export class SearchController {
  private readonly logger: ILogger = Logger.getLogger();
  constructor(
    private readonly searchService: SearchService,
    private readonly elasticsearchService: ElasticsearchService
  ) {}

  index = "articles";

  @MessagePattern(INDEX_ARTICLE, Transport.RMQ)
  async indexArticle(
    @Payload() article: CreateArticleDto,
    @Ctx() context: RmqContext
  ) {
    this.logger.info(
      `[MessagePattern - ${INDEX_ARTICLE}] => ${JSON.stringify(article)}`
    );

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    const result = this.elasticsearchService.index({
      index: this.index,
      body: article
    });

    channel.ack(originalMsg);
  }
}
