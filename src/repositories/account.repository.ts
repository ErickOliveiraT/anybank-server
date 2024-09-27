
import { AccountCreateDTO } from "src/dtos/account_create.dto";
import { Account } from "src/entities/account.entity";
import prisma from '../database/connection';

interface AccountRepo {
    create(data: AccountCreateDTO): Promise<Account>;
}

export class AccountRepository implements AccountRepo {
    async create(data: AccountCreateDTO): Promise<Account> {
        try {
            const account = await prisma.account.create({
                data: data as any
            });
            return this.normalizeAccount(account);
        }
        catch (err) {
            throw new Error(err);
        }
    }

    private normalizeAccount(account: any): Account {
        return {
            created_at: account.created_at,
            updated_at: account.updated_at,
            id: account.id,
            id_public: account.id_public,
            type: account.type,
            user_id: account.user_id,
            agency: account.agency,
            number: account.number,
            credit_limit: account.credit_limit,
            credit_rate: account.credit_rate,
            balance: account.balance,
            status: account.status
        } as Account;
    }
}