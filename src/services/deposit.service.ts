import { Injectable } from "@nestjs/common";
import { TransactionStoreDTO } from "src/dtos/transaction.dto";
import { AccountRepository } from "src/repositories/account.repository";
import { TransactionRepository } from "src/repositories/transaction.repository";

@Injectable() 
export class DepositService {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly transactionRepository: TransactionRepository
    ) { }

    async depositToAccount(account_id: number, amount: number) {
        const account = await this.accountRepository.findById(account_id);
        if (!account) return {
            statusCode: 404,
            error: "Not Found",
            message: ["Account not found"]
        }

        account.balance += amount;

        const transaction: TransactionStoreDTO = {
            account_id: account_id,
            amount: amount,
            type: 'credit',
            description: 'Depósito em conta'
        }

        await this.transactionRepository.create(transaction);
        await this.accountRepository.update(account.id, account);

        return transaction;
    }
}