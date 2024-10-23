import { Injectable } from "@nestjs/common";
import { genAccount } from "src/seeders/account.seeder";
import { AccountRepository } from "../repositories/account.repository";
import { UserRepository } from "src/repositories/user.repository";
import { AccountCreateDTO } from "src/dtos/account.dto";
import { AccountOpenDTO } from "src/dtos/account.dto";
import { DepositService } from "src/services/deposit.service";
import { faker } from "@faker-js/faker";
import { hash } from 'argon2';
import { TransactionRepository } from "src/repositories/transaction.repository";
import { Account } from "src/entities/account.entity";
import { User } from "src/entities/user.entity";

interface AccountDefaultResponse {
    opened: boolean;
    account?: any;
    error?: any;
    status_code?: number;
    message?: string[];
}

interface AccontInfoResponse {
    status_code: number;
    balance: number;
    credit_limit: number;
    last_transactions: {
        created_at: Date,
        amount: number;
        type: "credit" | "debit",
        description: string;
    }[];
}

@Injectable()
export class AccountService {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly userRepository: UserRepository,
        private readonly transactionRepository: TransactionRepository,
        private readonly depositService: DepositService
    ) { }

    async createAccount(data: AccountOpenDTO): Promise<AccountDefaultResponse> {
        const user_accounts = await this.accountRepository.findByUser(data.user_id);
        if (user_accounts.length > 0) {
            return {
                opened: false,
                error: "Exists account for user",
                message: ["This user already has an account"],
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
                        Number(faker.number.float({ min: 0, max: 10000 }).toFixed(2))
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

    async getAccountInfo(id: string): Promise<AccontInfoResponse | AccountDefaultResponse> {
        const account = await this.accountRepository.findByPublicId(id);
        if (!account) {
            return {
                status_code: 404,
                error: "Not found",
                message: ["Account not found"]
            } as AccountDefaultResponse;
        }

        const last_transactions = await this.transactionRepository.getLastTransactions(account.id, 4);

        return {
            status_code: 200,
            balance: account.balance,
            credit_limit: account.credit_limit,
            last_transactions: last_transactions.map(t => {
                return {
                    amount: t.amount,
                    type: t.type,
                    created_at: t.created_at,
                    description: t.description,
                }
            })
        } as AccontInfoResponse;
    }

    async getByAgencyAndNumber(agency: string, number: string): Promise<{ account: Account | null, user: User | null }> {
        const account = await this.accountRepository.findByAgencyAndNumber(agency, number);
        if (!account) return { account: null, user: null };
        const user = await this.userRepository.findById(account.user_id);
        return {
            account,
            user
        };
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