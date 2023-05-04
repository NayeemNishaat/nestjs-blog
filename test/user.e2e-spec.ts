import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { UserModule } from "../src/modules/user/user.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerModule } from "@nestjs/throttler";
import { UserService } from "../src/modules/user/user.service";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let userService: UserService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        MongooseModule.forRootAsync({
          useFactory: () => ({
            uri: "mongodb://localhost:27017/test_blog" // Remark: Using test_blog db for testing
          })
        }),
        ThrottlerModule.forRoot({
          ttl: 60,
          limit: 10
        })
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    userService = moduleRef.get<UserService>(UserService);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    // Note: Trancate DB
    await userService.deleteAllUser();
  });

  it("/user (POST)", () => {
    return request(app.getHttpServer())
      .post("/user")
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "abc@gmail.com"
      })
      .set("Content-Type", "application/json")
      .expect(201);
  });

  it("/user (GET)", async () => {
    const user = await userService.createUser({
      firstName: "John",
      lastName: "Doe",
      email: "abc@gmail.com"
    });

    const { body } = await request(app.getHttpServer())
      .get("/user")
      .expect(200);

    expect(body.data).toHaveLength(1);
    expect(body.data[0].email).toEqual(user.email);
  });

  it("/user/:id (GET)", async () => {
    const user = await userService.createUser({
      firstName: "John",
      lastName: "Doe",
      email: "abc@gmail.com"
    });

    const { body } = await request(app.getHttpServer())
      .get(`/user/${user._id.toString()}`)
      .accept("application/json")
      .expect(200);

    expect(body.data._id).toEqual(user._id.toString());
  });

  it("/user/:id (PATCH)", async () => {
    const user = await userService.createUser({
      firstName: "John",
      lastName: "Doe",
      email: "abc@gmail.com"
    });
    const email = "new@mail.com";

    await request(app.getHttpServer())
      .patch(`/user/${user._id.toString()}`)
      .set("Content-Type", "application/json")
      .send({ email })
      .expect(200);

    const updatedUser = await userService.getUserById(user._id.toString());

    expect(updatedUser.email).toEqual(email);
  });

  it("/user/:id (DELETE)", async () => {
    const user = await userService.createUser({
      firstName: "John",
      lastName: "Doe",
      email: "abc@gmail.com"
    });

    await request(app.getHttpServer())
      .delete(`/user/${user._id.toString()}`)
      .expect(200);

    const retrieveUser = await userService.getUserById(user._id.toString());

    expect(retrieveUser).toBe(null);
  });
});
