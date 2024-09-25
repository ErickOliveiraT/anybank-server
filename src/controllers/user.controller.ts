import {Controller, Post, Body} from "@nestjs/common";
import { UserCreateDTO } from "src/models/user.model";
import { UserService } from "src/services/user.service";

@Controller('users')
export class UserController {
    constructor (private readonly userService: UserService) {}
    
    @Post()
    createUser(@Body() body: any) {
        const user_data = body as UserCreateDTO;

        const user = this.userService.createUser(user_data);

        return user;
    }

    @Post('seed')
    generateUser() {
        return this.userService.generateUser();
    }



}