import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { UserLoginDTO, AccountLoginDTO, TokenValidationDTO } from 'src/dtos/auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/user/login')
    async login(@Body() data: UserLoginDTO, @Res() res: Response) {
        const login_res = await this.authService.userLogin(data);
        return res.status(login_res.statusCode || 500).send(login_res);
    }

    @Post('/account/login')
    async AccountLogin(@Body() data: AccountLoginDTO, @Res() res: Response) {
        const login_res = await this.authService.accountLogin(data);
        return res.status(login_res.statusCode || 500).send(login_res);
    }

    @Post('/token/validate')
    async validateAccountToken(@Body() data: TokenValidationDTO, @Res() res: Response) {
        const validation = await this.authService.validateAccountToken(data.token);
        return res.status(validation.statusCode).send(validation);
    }
}