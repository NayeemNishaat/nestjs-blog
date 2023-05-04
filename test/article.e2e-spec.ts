import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { ArticleModule } from "../src/modules/article/article.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerModule } from "@nestjs/throttler";
import { ArticleService } from "../src/modules/article/article.service";
import { ConfigModule } from "@nestjs/config";

describe("ArticleController (e2e)", () => {
  let app: INestApplication;
  let articleService: ArticleService;

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
        ArticleModule
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    articleService = moduleRef.get<ArticleService>(ArticleService);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    // Note: Trancate DB
    await articleService.deleteAllArticle();
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

  // it("/user/:id (PATCH)", async () => {
  //   const user = await userService.createUser({
  //     firstName: "John",
  //     lastName: "Doe",
  //     email: "abc@gmail.com"
  //   });
  //   const email = "new@mail.com";

  //   await request(app.getHttpServer())
  //     .patch(`/user/${user._id.toString()}`)
  //     .set("Content-Type", "application/json")
  //     .send({ email })
  //     .expect(200);

  //   const updatedUser = await userService.getUserById(user._id.toString());

  //   expect(updatedUser.email).toEqual(email);
  // });

  // it("/user/:id (DELETE)", async () => {
  //   const user = await userService.createUser({
  //     firstName: "John",
  //     lastName: "Doe",
  //     email: "abc@gmail.com"
  //   });

  //   await request(app.getHttpServer())
  //     .delete(`/user/${user._id.toString()}`)
  //     .expect(200);

  //   const retrieveUser = await userService.getUserById(user._id.toString());

  //   expect(retrieveUser).toBe(null);
  // });
});
