import {Controller, Post, Body} from "@nestjs/common";
import { UserService } from "src/services/user.service";

@Controller('users')
export class UserController {
    constructor (private readonly userService: UserService) {}
    
    @Post()
    createUser(@Body() body: any) {
        console.log('Controller received', JSON.stringify(body))

        const user = this.userService.createUser(body);

        return user;
    }




}