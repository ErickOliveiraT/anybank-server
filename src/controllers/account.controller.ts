import { Body, Controller, Post, Res } from "@nestjs/common";
import { AccountService } from "src/services/account.service";
import { AccountOpenDTO } from "src/dtos/account_open.dto";
import { Response } from 'express';

@Controller('accounts')
export class AccountController {
    constructor (
        private readonly accountService: AccountService,
    ) {}
    
    @Post()
    async createAccount(@Body() body: AccountOpenDTO, @Res() res: Response) {
        const account_creation_res = await this.accountService.createAccount(body);
        if (account_creation_res.opened && account_creation_res.account) {
            return res.status(201).send(account_creation_res.account);
        }
        return res.status(account_creation_res.status_code || 500).send(account_creation_res);
    }

    @Post('seed')
    async generateAccount() {
        return await this.accountService.generateAccounts();
    }

}