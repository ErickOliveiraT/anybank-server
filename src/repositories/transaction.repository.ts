import { Transaction, StatementTransaction } from "src/entities/transaction.entity";
import prisma from '../database/connection';
import { TransactionStoreDTO } from "src/dtos/transaction.dto";

interface TransactionRepo {
    create(data: TransactionStoreDTO): Promise<Transaction>;
}

export class TransactionRepository implements TransactionRepo {
    async create(data: TransactionStoreDTO): Promise<Transaction> {
        try {
            const transaction = await prisma.transaction.create({
                data: data as any
            });
            return transaction as Transaction;
        }
        catch (err) {
            throw new Error(err);
        }
    }

    async getByAccountIdAndDate(
        account_id: number,
        start_date: string,
        end_date: string
    ): Promise<StatementTransaction[]> {
        try {
            const transactions = await prisma.transaction.findMany({
                where: {
                    account_id: account_id,
                    created_at: {
                        gte: new Date(start_date),
                        lte: new Date(end_date)
                    }
                }
            });
            return transactions
                .map(transaction => this.normalizeStatementTransaction(transaction as Transaction));
        }
        catch (err) {
            throw new Error(err);
        }
    }

    async getLastTransactions(account_id: number, limit: number): Promise<StatementTransaction[]> {
        try {
            const transactions = await prisma.transaction.findMany({
                where: {
                    account_id: account_id
                },
                orderBy: {
                    created_at: 'desc'
                },
                take: limit
            });
            return transactions
                .map(transaction => this.normalizeStatementTransaction(transaction as Transaction));
        }
        catch (err) {
            throw new Error(err);
        }
    }

    private normalizeStatementTransaction(transaction: Transaction): StatementTransaction {
        return {
            id_public: transaction.id_public,
            amount: transaction.amount,
            type: transaction.type,
            description: transaction.description,
            created_at: transaction.created_at
        }
    }
}