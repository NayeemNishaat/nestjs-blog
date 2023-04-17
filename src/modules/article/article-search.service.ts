import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { CreateArticleDto } from "./dto/article.dto";

@Injectable()
export class ArticleSearchService {
  index = "articles";

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexArticle(article: CreateArticleDto) {
    return this.elasticsearchService.index({
      index: this.index,
      body: article
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
// <{
//     hits: {
//       total: number;
//       hits: Array<{
//         _source: Article;
//       }>;
//     };
//   }>
