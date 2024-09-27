import {Controller, Post, Body} from "@nestjs/common";
import { UserCreateDTO } from "src/dtos/user_create.dto";
import { UserService } from "src/services/user.service";

@Controller('users')
export class UserController {
    constructor (private readonly userService: UserService) {}
    
    @Post()
    async createUser(@Body() body: UserCreateDTO) {
        const user = await this.userService.createUser(body);
        return user;
    }

    @Post('seed')
    async generateUser() {
        const generated_user = await this.userService.generateUser();
        return generated_user;
    }
}