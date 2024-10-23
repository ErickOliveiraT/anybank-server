import { Body, Controller, Post, Res, Get, Query } from "@nestjs/common";
import { AccountService } from "src/services/account.service";
import { AccountOpenDTO } from "src/dtos/account.dto";
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

    @Get('info')
    async getAccountInfo(@Query('account_id') account_id: string, @Res() res: Response) {
        const info = await this.accountService.getAccountInfo(account_id);
        if (info.status_code && info.status_code === 200) {
            return res.status(info.status_code).send(info);
        }
        else return res.status(info.status_code || 500).send(info);
    }

    @Get('find')
    async findAccount(@Query('agency') agency: string, @Query('number') number: string, @Res() res: Response) {
        const info = await this.accountService.getByAgencyAndNumber(agency, number);
        if (!info.account) {
            return res.status(404).send({
                message: ["Account not found"],
                statusCode: 404,
                error: "Not found"
            });
        }
        if (!info.user) {
            return res.status(404).send({
                message: ["User not found"],
                statusCode: 404,
                error: "Not found"
            });
        }
        return res.status(200).send(info);
    }
}