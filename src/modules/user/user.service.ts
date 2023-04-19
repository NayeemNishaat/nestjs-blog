import { Injectable } from "@nestjs/common";
import { Model, UpdateQuery } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../../models/user.entity";
import { CreateUserDto, UpdateUserDto } from "./dto/user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async getUserById(id: string): Promise<User> {
    return await this.userModel.findOne({ _id: id }).populate("likedArticles");
  }

  async getAllUsers(page: number, limit: number): Promise<User[]> {
    return await this.userModel
      .find({})
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<UpdateQuery<User>> {
    return await this.userModel.updateOne({ _id: id }, { ...updateUserDto });
  }

  async deleteUser(id: string): Promise<UpdateQuery<User>> {
    return await this.userModel.deleteOne({ _id: id });
  }
}
