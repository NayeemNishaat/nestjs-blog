import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerGuard } from "@nestjs/throttler";
import { User, UserSchema } from "src/models/user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class UserModule {}
