import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { ArticleModule } from "../src/modules/article/article.module";
import { UserModule } from "../src/modules/user/user.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerModule } from "@nestjs/throttler";
import { ArticleService } from "../src/modules/article/article.service";
import { UserService } from "../src/modules/user/user.service";
import { ConfigModule } from "@nestjs/config";

describe("ArticleController (e2e)", () => {
  let app: INestApplication;
  let articleService: ArticleService;
  let userService: UserService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({
          ttl: +process.env.THROTTLE_TTL,
          limit: +process.env.THROTTLE_LIMIT
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ".env.test"
        }),
        MongooseModule.forRootAsync({
          useFactory: () => ({
            uri: process.env.MONGO_URI
          })
        }),
        ArticleModule,
        UserModule
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    articleService = moduleRef.get<ArticleService>(ArticleService);
    userService = moduleRef.get<UserService>(UserService);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    // Note: Trancate DB
    await articleService.deleteAllArticle();
    await userService.deleteAllUser();
  });

  it("/article (POST)", async () => {
    await request(app.getHttpServer())
      .post("/article")
      .send({
        name: "My Article",
        body: "This is my article",
        author: "6439383e06b3b43356b39e4f",
        categories: ["tech", "science"],
        tags: ["Ok", "Good"]
      })
      .set("Content-Type", "application/json")
      .expect(201);
  });

  it("/user (GET)", async () => {
    const article = await articleService.createArticle({
      name: "My Article",
      body: "This is my article",
      author: "6439383e06b3b43356b39e4f",
      categories: ["tech", "science"],
      tags: ["Ok", "Good"]
    });

    const { body } = await request(app.getHttpServer())
      .get("/article")
      .expect(200);

    expect(body.data).toHaveLength(1);
    expect(body.data[0].name).toEqual(article.name);
  });

  it("/article/:id (GET)", async () => {
    const article = await articleService.createArticle({
      name: "My Article",
      body: "This is my article",
      author: "6439383e06b3b43356b39e4f",
      categories: ["tech", "science"],
      tags: ["Ok", "Good"]
    });

    const { body } = await request(app.getHttpServer())
      .get(`/article/${article._id.toString()}`)
      .accept("application/json")
      .expect(200);

    expect(body.data._id).toEqual(article._id.toString());
  });

  it("/article/like (PATCH)", async () => {
    const article = await articleService.createArticle({
      name: "My Article",
      body: "This is my article",
      author: "6439383e06b3b43356b39e4f",
      categories: ["tech", "science"],
      tags: ["Ok", "Good"]
    });

    await request(app.getHttpServer())
      .patch(`/article/like`)
      .set("Content-Type", "application/json")
      .send({
        articleId: article._id.toString(),
        userId: "6439383e06b3b43356b39e4f"
      })
      .expect(200);

    const likedArticle = await articleService.getArticleById(
      article._id.toString()
    );

    expect(likedArticle._id).toEqual(article._id);
    expect(likedArticle.likes).toEqual(1);
  });

  it("/article/dislike (PATCH)", async () => {
    const article = await articleService.createArticle({
      name: "My Article",
      body: "This is my article",
      author: "6439383e06b3b43356b39e4f",
      categories: ["tech", "science"],
      tags: ["Ok", "Good"]
    });

    await request(app.getHttpServer())
      .patch(`/article/dislike`)
      .set("Content-Type", "application/json")
      .send({
        articleId: article._id.toString(),
        userId: "6439383e06b3b43356b39e4f"
      })
      .expect(200);

    const dislikedArticle = await articleService.getArticleById(
      article._id.toString()
    );

    expect(dislikedArticle._id).toEqual(article._id);
    expect(dislikedArticle.dislikes).toEqual(1);
  });

  it("likes and then dislikes an article by the same user", async () => {
    // Part: Create New User
    const user = await userService.createUser({
      email: "Myemail@gmail.com",
      firstName: "Nayee,",
      lastName: "Nishaat"
    });

    // Part: Create New Article
    const article = await articleService.createArticle({
      name: "My Article",
      body: "This is my article",
      author: user._id.toString(),
      categories: ["tech", "science"],
      tags: ["Ok", "Good"]
    });

    // Part: Like an Article
    await request(app.getHttpServer())
      .patch(`/article/like`)
      .set("Content-Type", "application/json")
      .send({
        articleId: article._id.toString(),
        userId: user._id.toString()
      })
      .expect(200);

    const likedArticle = await articleService.getArticleById(
      article._id.toString()
    );

    expect(likedArticle.likes).toEqual(1);
    expect(likedArticle.dislikes).toEqual(0);

    // Part: Dislike an Article by the Same User
    await request(app.getHttpServer())
      .patch(`/article/dislike`)
      .set("Content-Type", "application/json")
      .send({
        articleId: article._id.toString(),
        userId: user._id.toString()
      })
      .expect(200);

    const dislikedArticle = await articleService.getArticleById(
      article._id.toString()
    );

    expect(dislikedArticle.dislikes).toEqual(1);
    expect(dislikedArticle.likes).toEqual(0);
  });
});
