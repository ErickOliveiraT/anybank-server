import { Body, Controller, Post } from "@nestjs/common";
import { AccountService } from "src/services/account.service";
import { AccountOpenDTO } from "src/dtos/account_open.dto";

@Controller('accounts')
export class AccountController {
    constructor (
        private readonly accountService: AccountService,
    ) {}
    
    @Post()
    async createAccount(@Body() body: AccountOpenDTO) {
        const account = await this.accountService.createAccount(body);
        return account;
    }

    @Post('seed')
    async generateAccount() {
        return await this.accountService.generateAccounts();
    }

}