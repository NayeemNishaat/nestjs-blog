import { Module } from "@nestjs/common";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { SearchService } from "./search.service";
import { SearchController } from "./search.controller";

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: process.env.ELASTIC_URI
      })
    })
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [ElasticsearchModule]
})
export class SearchModule {}

// docker run \
//       --name elasticsearch \
//       --net elastic \
//       -p 9200:9200 \
//       -e discovery.type=single-node\
//       -e xpack.security.enabled=false \
// elasticsearch:8.7.0
