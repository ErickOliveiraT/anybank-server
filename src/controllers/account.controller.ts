import { Body, Controller, Post } from "@nestjs/common";
import { AccountService } from "src/services/account.service";
import { AccountOpenDTO } from "src/dtos/account_open.dto";
import { DepositService } from "src/services/deposit.service";
import { faker } from "@faker-js/faker";

@Controller('accounts')
export class AccountController {
    constructor (
        private readonly accountService: AccountService,
        private readonly depositService: DepositService,
    ) {}
    
    @Post()
    async createAccount(@Body() body: AccountOpenDTO) {
        const account = await this.accountService.createAccount(body);
        return account;
    }

    @Post('seed')
    async generateAccount() {
        const accounts = await this.accountService.generateAccounts();
        const depositPromises = [];
        for (const account of accounts) {
            depositPromises.push(
                this.depositService.depositToAccount(
                    account.id,
                    Number(faker.number.float({min: 0, max: 10000}).toFixed(2))
                )
            );
        }
        await Promise.all(depositPromises);
        return accounts;
    }

    




}