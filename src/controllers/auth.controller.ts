import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { LoginDTO } from 'src/dtos/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() data: LoginDTO, @Res() res: Response) {
        const login_res = await this.authService.login(data);
        return res.status(login_res.statusCode || 500).send(login_res);
    }
}