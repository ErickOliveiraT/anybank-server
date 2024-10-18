import { Injectable } from "@nestjs/common";
import { error } from "console";
import { AccountRepository } from "src/repositories/account.repository";
import { TransactionRepository } from "src/repositories/transaction.repository";

@Injectable()
export class StatementService {
    constructor(
        private readonly transactionRepository: TransactionRepository,
        private readonly accountRepository: AccountRepository
    ) {}

    async getStatement(
        account_id: string,
        start_date: string,
        end_date: string
    ) {
        const account = await this.accountRepository.findByPublicId(account_id);
        if (!account) return {
            statusCode: 404,
            error: 'Not Found',
            message: ['Account not found']
        }

        return await this.transactionRepository.getByAccountIdAndDate(
            account.id,
            start_date,
            end_date
        );
    }
}