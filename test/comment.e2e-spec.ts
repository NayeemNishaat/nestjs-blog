import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { CommentModule } from "../src/modules/comment/comment.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerModule } from "@nestjs/throttler";
import { ConfigModule } from "@nestjs/config";

describe("CommentController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        CommentModule,
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
        })
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("/comment (POST)", () => {
    return request(app.getHttpServer())
      .post("/comment")
      .send({
        body: "This is a comment",
        author: "6439383e06b3b43356b39e4f",
        article: "6439383e06b3b43356b39e4f"
      })
      .set("Content-Type", "application/json")
      .expect(201);
  });
});
