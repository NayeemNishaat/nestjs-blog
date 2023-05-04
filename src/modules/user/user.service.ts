import { Injectable } from "@nestjs/common";
import { Model, UpdateQuery } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../models/user.entity";
import { CreateUserDto, UpdateUserDto } from "./dto/user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async getUserById(id: string): Promise<UserDocument> {
    return await this.userModel.findOne({ _id: id }).populate("likedArticles");
  }

  async getAllUsers(page: number, limit: number): Promise<UserDocument[]> {
    return await this.userModel
      .find({})
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<UpdateQuery<UserDocument>> {
    return await this.userModel.updateOne({ _id: id }, { ...updateUserDto });
  }

  async deleteUser(id: string): Promise<UpdateQuery<UserDocument>> {
    return await this.userModel.deleteOne({ _id: id });
  }

  async deleteAllUser(): Promise<UpdateQuery<UserDocument>> {
    return await this.userModel.deleteMany();
  }
}
