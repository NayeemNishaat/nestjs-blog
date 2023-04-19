import { UserService } from "./user.service";
import { ILogger, Logger } from "../../libs/logging/logger";
import { CreateUserDto, UserResDto, UpdateUserDto } from "./dto/user.dto";
import {
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  HttpException
} from "@nestjs/common";
import { ResponseInterceptor } from "src/libs/core/response.interceptor";
import {
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiCreatedResponse
} from "@nestjs/swagger";

@ApiTags("User API")
@Controller("user")
@UseInterceptors(ResponseInterceptor)
export class UserController {
  private readonly logger: ILogger = Logger.getLogger();
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({
    description: "This api creates a new User.",
    type: () => UserResDto
  })
  @ApiOperation({
    summary: "Create a new User"
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      this.logger.info(`[POST - /user] => ${JSON.stringify(createUserDto)}`);
      return await this.userService.createUser(createUserDto);
    } catch (err: any) {
      throw new HttpException("Email must be unique", 400);
    }
  }

  @Get(":id")
  @ApiOkResponse({
    description: "Get a User by id",
    type: UserResDto
  })
  @ApiOperation({
    summary: "Get a User by id"
  })
  async getUserById(@Param("id") id: string) {
    this.logger.info(`[GET - /user/:id] => ${JSON.stringify({ id })}`);

    try {
      return await this.userService.getUserById(id);
    } catch (err: any) {
      throw new HttpException("User not found", 404);
    }
  }

  @Get("/")
  @ApiOkResponse({
    description: "Get all Users",
    type: CreateUserDto,
    isArray: true
  })
  @ApiOperation({
    summary: "Get all Users"
  })
  async getAllUsers(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ) {
    this.logger.info(`[GET - /user/:page/:limit] => ${JSON.stringify(null)}`);

    if (page < 1) throw new HttpException("Page must be greater than 0", 400);

    return await this.userService.getAllUsers(page, limit);
  }

  @Patch(":id")
  @ApiOkResponse({
    description: "This api partially updates an existing User.",
    type: UserResDto
  })
  @ApiOperation({
    summary: "Update an existing User by it's id"
  })
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param("id") id: string
  ) {
    this.logger.info(
      `[Patch - /user/:id] =>\n\n${JSON.stringify(
        { updateUserDto, id },
        null,
        2
      )}`
    );

    try {
      return await this.userService.updateUser(id, updateUserDto);
    } catch (err: any) {
      throw new HttpException(err, 500);
    }
  }

  @Delete(":id")
  @ApiOkResponse({
    description: "This api deletes an existing User."
  })
  @ApiOperation({
    summary: "Delete a User"
  })
  async deleteFileUrl(@Param("id") id: string) {
    this.logger.info(`[DELETE - /user/:id] => ${JSON.stringify({ id })}`);

    try {
      return await this.userService.deleteUser(id);
    } catch (err: any) {
      throw new HttpException(err, 500);
    }
  }
}
