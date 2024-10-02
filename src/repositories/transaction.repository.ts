import { Transaction } from "src/entities/transaction.entity";
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
}