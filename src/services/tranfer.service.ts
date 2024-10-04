import { Injectable } from "@nestjs/common";
import { AccountRepository } from "src/repositories/account.repository";
import { TransferDTO } from "src/dtos/tranfer.dto";
import { TransactionStoreDTO } from "src/dtos/transaction.dto";
import { TransactionRepository } from "src/repositories/transaction.repository";
import { Transaction } from "@prisma/client";

interface TransferResponse {
    statusCode: number;
    error?: string;
    message: string[];
    transactions?: Transaction[]
}

@Injectable()
export class TransferService {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly transactionRepository: TransactionRepository
    ) {}

    async transfer(data: TransferDTO): Promise<TransferResponse> {
        const source_account = await this.accountRepository.findById(data.source_account_id);
        if (!source_account) return {
            statusCode: 404,
            error: "Not Found",
            message: ["Source account not found"]
        }
        if ((source_account.balance + source_account.credit_limit) < data.amount) return {
            statusCode: 400,
            error: "Bad Request",
            message: ["Insufficient funds"]
        }

        const dest_account = await this.accountRepository.findById(data.dest_account_id);
        if (!dest_account) return {
            statusCode: 404,
            error: "Not Found",
            message: ["Destination account not found"]
        }

        const transaction_source: TransactionStoreDTO = {
            account_id: data.source_account_id,
            amount: data.amount,
            type: 'debit',
            description: `Transferência para conta ${data.dest_account_id}`
        }
        
        const transaction_dest: TransactionStoreDTO = {
            account_id: data.dest_account_id,
            amount: data.amount,
            type: 'credit',
            description: `Transferência recebida da conta ${data.source_account_id}`
        }

        source_account.balance -= data.amount;
        dest_account.balance += data.amount;

        const ts = await this.transactionRepository.create(transaction_source);
        const td = await this.transactionRepository.create(transaction_dest);
        await this.accountRepository.update(source_account.id, source_account);
        await this.accountRepository.update(dest_account.id, dest_account);

        return {
            statusCode: 201,
            message: ["Transfer successful"],
            transactions: [ts, td]
        }
    }
}