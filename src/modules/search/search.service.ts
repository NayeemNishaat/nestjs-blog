import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { CreateArticleDto } from "../article/dto/article.dto";
import { RmqContext } from "@nestjs/microservices";

interface iCreateArticleDto extends CreateArticleDto {
  id: string;
}

@Injectable()
export class SearchService {
  idx = "articles";

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async index(article: CreateArticleDto, context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.elasticsearchService.index({
      index: this.idx,
      body: article
    });

    channel.ack(originalMsg);
  }

  async remove(articleId: number) {
    this.elasticsearchService.deleteByQuery({
      index: this.idx,
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
      index: this.idx,
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

  async search(text: string, context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    const { hits } = await this.elasticsearchService.search({
      index: this.idx,
      body: {
        query: {
          query_string: {
            query: `*${text}*`,
            fields: ["tags", "categories"]
          }
        }
      }
    });

    channel.ack(originalMsg);
    return hits.hits;
  }
}
