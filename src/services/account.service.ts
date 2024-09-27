import { Injectable } from "@nestjs/common";
import { genAccount } from "src/seeders/account.seeder";
import { AccountRepository } from "../repositories/account.repository";
import { UserRepository } from "src/repositories/user.repository";
import { AccountCreateDTO } from "src/dtos/account_create.dto";
import { AccountOpenDTO } from "src/dtos/account_open.dto";
import { faker } from "@faker-js/faker";

@Injectable()
export class AccountService {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly userRepository: UserRepository
    ) { }

    async createAccount(data: AccountOpenDTO) {
        const account = {
            ...data,
            balance: 0,
            credit_limit: 0,
            credit_rate: 0,
            status: "active",
            agency: "001",
            number: this.genAccountNumber()
        } as AccountCreateDTO;
        
        return await this.accountRepository.create(account);
    }

    async generateAccounts() {
        const account_promises = [];
        const users = await this.userRepository.list();
        users.forEach(user => {
            account_promises.push(this.accountRepository.create(genAccount(user.id)));
        });
        return await Promise.all(account_promises);
    }

    private genAccountNumber() {
        const account_pre = faker.string.numeric(5);
        const account_suf = faker.string.numeric(1);
        const account_number = `${account_pre}-${account_suf}`;
        return account_number;
    }
}