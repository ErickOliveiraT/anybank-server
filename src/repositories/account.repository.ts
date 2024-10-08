
import { AccountCreateDTO } from "src/dtos/account_create.dto";
import { Account } from "src/entities/account.entity";
import prisma from '../database/connection';

interface AccountRepo {
    create(data: AccountCreateDTO): Promise<Account>;
    findByNumber(number: string): Promise<Account|null>;
    findByUser(user_id: number): Promise<Account[]>;
    findById(id: number): Promise<Account|null>;
    update(id: number, account: Account): Promise<Account>;
}

export class AccountRepository implements AccountRepo {
    async findById(id: number): Promise<Account | null> {
        try {
            const account = await prisma.account.findFirst({
                where: {
                    id: id
                }
            });
            if (!account) return null;
            return this.normalizeAccount(account);
        }
        catch (err) {
            throw new Error(err);
        }
    }

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

    async findByNumber(number: string): Promise<Account|null> {
        try {
            const account = await prisma.account.findFirst({
                where: {
                    number: number
                }
            });
            if (!account) return null;
            return this.normalizeAccount(account);
        }
        catch (err) {
            throw new Error(err);
        }
    }

    async findByUser(user_id: number): Promise<Account[]> {
        try {
            const accounts = await prisma.account.findMany({
                where: {
                    user_id: user_id
                }
            });
            return accounts.map(account => this.normalizeAccount(account));
        }
        catch (err) {
            throw new Error(err);
        }
    }

    async update(id: number, account: Account): Promise<Account> {
        try {
            const updatedAccount = await prisma.account.update({
                where: {
                    id: id
                },
                data: account as any
            });
            return this.normalizeAccount(updatedAccount);
        }
        catch (err) {
            throw new Error(err);
        }
    }

    async getByPublicId(id: string) {
        try {
            const account = await prisma.account.findFirst({
                where: {
                    id_public: id
                }
            });
            if (!account) return null;
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