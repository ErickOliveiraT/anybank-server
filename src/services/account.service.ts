import { Injectable } from "@nestjs/common";
import { genAccount } from "src/seeders/account.seeder";
import { AccountRepository } from "../repositories/account.repository";
import { UserRepository } from "src/repositories/user.repository";
import { AccountCreateDTO } from "src/dtos/account_create.dto";
import { AccountOpenDTO } from "src/dtos/account_open.dto";
import { DepositService } from "src/services/deposit.service";
import { faker } from "@faker-js/faker";
import { hash } from 'argon2';

interface OpenAccountResponse {
    opened: boolean;
    account?: any;
    error?: any;
    status_code?: number;
    message?: string;
}

@Injectable()
export class AccountService {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly userRepository: UserRepository,
        private readonly depositService: DepositService
    ) { }

    async createAccount(data: AccountOpenDTO): Promise<OpenAccountResponse> {
        const user_accounts = await this.accountRepository.findByUser(data.user_id);
        if (user_accounts.length > 0) {
            return {
                opened: false,
                error: "Exists account for user",
                message: "This user already has an account",
                status_code: 400
            }
        }

        const number = await this.genAccountNumber();
        const password = await hash(data.password);
        const account_data = {
            type: data.type,
            user_id: data.user_id,
            balance: 0,
            credit_limit: 0,
            credit_rate: 0,
            status: "active",
            agency: "001",
            number,
            password
        } as AccountCreateDTO;

        const account = await this.accountRepository.create(account_data);
        return {
            opened: true,
            account
        }
    }

    async generateAccounts() {
        const account_promises = [];
        const users = await this.userRepository.list();
        users.forEach(user => {
            account_promises.push(this.createAccount(genAccount(user.id)));
        });
        const accounts = await Promise.all(account_promises);
        const depositPromises = [];
        for (const account of accounts) {
            if (account.opened) {
                depositPromises.push(
                    this.depositService.depositToAccount(
                        account.account.id,
                        Number(faker.number.float({min: 0, max: 10000}).toFixed(2))
                    )
                );
            }
        }
        const deposits = await Promise.all(depositPromises);
        deposits.forEach(deposit => {
            accounts.find(acc => acc.account.id === deposit.account_id).balance = deposit.amount;
        });
        return accounts;
    }

    private async genAccountNumber() {
        let colliding = true;
        let account_number = "";
        while (colliding) {
            const account_pre = faker.string.numeric(5);
            const account_suf = faker.string.numeric(1);
            account_number = `${account_pre}-${account_suf}`;
            const acc_qry = await this.accountRepository.findByNumber(account_number);
            if (!acc_qry) colliding = false;
        }

        return account_number;
    }
}