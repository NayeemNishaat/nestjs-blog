import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { User } from "../../models/user.entity";
import mongoose from "mongoose";

describe("UserController", () => {
  let userController: UserController;
  let userService: UserService;

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
  });

  describe("createUser", () => {
    it("should return the newly created user", async () => {
      const user = new User();

      jest.spyOn(userService, "createUser").mockResolvedValue(user);

      expect(await userController.createUser(user)).toBe(user);
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

  describe("getAllUsers", () => {
    it("should return all the users", async () => {
      const spy = jest.spyOn(userService, "getAllUsers").mockResolvedValue([]);

      const result = await userController.getAllUsers();

      expect(spy).toBeCalled();
      expect(result).toEqual([]);
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      const id = new mongoose.Types.ObjectId() as unknown as string;
      const spy = jest.spyOn(userService, "deleteUser").mockResolvedValue({});

      await userController.deleteUser(id);

      expect(spy).toBeDefined();
      expect(spy).toBeCalledWith(id);
    });
  });
});
