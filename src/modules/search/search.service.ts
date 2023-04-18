import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { CreateArticleDto } from "../article/dto/article.dto";
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  Transport
} from "@nestjs/microservices";
import { INDEX_ARTICLE } from "src/constants/broker.constant";

interface iCreateArticleDto extends CreateArticleDto {
  id: string;
}

@Injectable()
export class SearchService {
  index = "articles";

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  @MessagePattern(INDEX_ARTICLE, Transport.RMQ)
  async indexArticle(
    @Payload() article: CreateArticleDto,
    @Ctx() context: RmqContext
  ) {
    console.log(67);
    const channel = context.getChannelRef();
    // const originalMsg = context.getMessage();
    const result = this.elasticsearchService.index({
      index: this.index,
      body: article
    });

    channel.ack(result);
  }

  async remove(articleId: number) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: articleId
          }
        }
      }
    });
  }

  async update(article: iCreateArticleDto) {
    const script = Object.entries(article).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, "");

    return this.elasticsearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: article.id
          }
        },
        script: {
          source: script
        }
      }
    });
  }

  async search(text: string) {
    const { hits } = await this.elasticsearchService.search({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ["tags", "categories"]
          }
        }
      }
    });

    return hits.hits;
  }
}
