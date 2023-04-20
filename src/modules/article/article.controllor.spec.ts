import { ArticleController } from "./article.controller";
import { ArticleService } from "./article.service";
import { getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { Article, ArticleDocument } from "../../models/article.entity";
import { User } from "../../models/user.entity";
import { Model } from "mongoose";
import { CreateArticleDto } from "./dto/article.dto";
import { getArticle } from "./stub/article.stub";
import { ClientsModule } from "@nestjs/microservices";
import { CacheModule } from "@nestjs/cache-manager";
import { SEARCH_CLIENT } from "../../constants/module.constant";

describe("ArticleController", () => {
  let articleController: ArticleController;
  let articleService: ArticleService;
  let mockArticleModel: Model<ArticleDocument>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: SEARCH_CLIENT
          }
        ]),
        CacheModule.register()
      ],
      controllers: [ArticleController],
      providers: [
        ArticleService,
        {
          provide: getModelToken(Article.name),
          useValue: {
            create: jest.fn().mockResolvedValue(getArticle()),
            findOne: jest.fn().mockResolvedValue(getArticle()),
            find: jest.fn().mockResolvedValue([getArticle()])
          }
        },
        {
          provide: getModelToken(User.name),
          useValue: User
        }
      ]
    }).compile();

    articleService = moduleRef.get<ArticleService>(ArticleService);
    articleController = moduleRef.get<ArticleController>(ArticleController);
    mockArticleModel = moduleRef.get<Model<ArticleDocument>>(
      getModelToken(Article.name)
    );
  });

  describe("createArticle", () => {
    it("should create a new article", async () => {
      let createArticleDto: CreateArticleDto;

      const spy = jest
        .spyOn(articleService, "createArticle")
        .mockImplementation(async () => {
          const article = await mockArticleModel.create(createArticleDto);
          return article;
        });

      const result = await articleController.createArticle(createArticleDto);

      expect(spy).toBeCalledWith(createArticleDto);
      expect(result).toEqual(getArticle());
    });
  });

  describe("getArticleById", () => {
    it("should get an article by id", async () => {
      const spy = jest
        .spyOn(articleService, "getArticleById")
        .mockImplementation(async () => {
          const article = await mockArticleModel.findOne({
            _id: getArticle()._id
          });

          return article;
        });

      const result = await articleController.getArticleById(getArticle()._id);

      expect(spy).toBeCalledWith(getArticle()._id);
      expect(result).toEqual(getArticle());
    });
  });

  describe("getAllArticles", () => {
    it("should get all articles", async () => {
      const spy = jest
        .spyOn(articleService, "getAllArticles")
        .mockImplementation(async () => {
          const articles = await mockArticleModel.find({
            _id: getArticle()._id
          });
          return articles;
        });

      const result = await articleController.getAllArticles();

      expect(spy).toHaveBeenCalled();
      expect(result).toEqual([getArticle()]);
    });
  });
});
