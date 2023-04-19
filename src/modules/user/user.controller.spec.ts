import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { User, UserDocument } from "../../models/user.entity";
import mongoose, { Model } from "mongoose";

describe("UserController", () => {
  let userController: UserController;
  let userService: UserService;
  let mockUserModel: Model<UserDocument>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: User
        }
      ]
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userController = moduleRef.get<UserController>(UserController);
    mockUserModel = moduleRef.get<Model<UserDocument>>(
      getModelToken(User.name)
    );
  });

  describe("createUser", () => {
    it("should return the newly created user", async () => {
      const user = new User();

      jest.spyOn(userService, "createUser").mockResolvedValue(user);

      expect(
        await userController.createUser({
          firstName: "John",
          lastName: "Doe",
          email: "abc@gmail.com"
        })
      ).toBe(user);
    });
  });

  describe("getUserById", () => {
    it("should return a user by it's id", async () => {
      const id = new mongoose.Types.ObjectId() as unknown as string;
      const user = new User();
      user["_id"] = id;

      const spy = jest
        .spyOn(userService, "getUserById")
        .mockImplementation(async () => user);

      const result = await userController.getUserById(id);

      expect(spy).toBeCalledWith(id);
      expect(result).toEqual(user);
    });
  });
});