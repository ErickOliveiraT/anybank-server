import { Injectable } from "@nestjs/common";
import { UserRepository } from "src/repositories/user.repository";
import { AccountLoginDTO, UserLoginDTO } from "src/dtos/auth.dto";
import { verify } from "argon2";
import { User, UserWithCredentials } from "src/entities/user.entity";
import { AccountRepository } from "src/repositories/account.repository";
import { Account } from "src/entities/account.entity";
import * as jwt from 'jsonwebtoken';
import { TransactionRepository } from "src/repositories/transaction.repository";

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly accountRepository: AccountRepository,
        private readonly transactionRepository: TransactionRepository
    ) { }

    async userLogin(data: UserLoginDTO) {
        const user = await this.userRepository.findByCPF(data.cpf);
        if (!user) {
            return {
                message: ["User not found"],
                error: "Not Found",
                statusCode: 404
            }
        }
        const valid = await verify(user.password, data.password);
        if (!valid) {
            return {
                message: ["Invalid password"],
                error: "Unauthorized",
                statusCode: 401
            }
        }
        const token = jwt.sign(
            user,
            process.env.JWT_SECRET,
            { expiresIn: '168h' }
        );
        const accounts = await this.accountRepository.findByUser(user.id);
        return {
            message: ["Login successful"],
            statusCode: 200,
            user: this.hidePassword(user),
            accounts: this.hideAccountInfo(accounts),
            token
        }
    }

    async accountLogin(data: AccountLoginDTO) {
        const account = await this.accountRepository.findFullAccountByPublicId(data.id_public);
        if (!account) {
            return {
                message: ["Account not found"],
                error: "Not Found",
                statusCode: 404
            }
        }
        const valid = await verify(account.password, data.password);
        if (!valid) {
            return {
                message: ["Invalid password"],
                error: "Unauthorized",
                statusCode: 401
            }
        }
        const token = jwt.sign(
            account,
            process.env.JWT_SECRET,
            { expiresIn: '168h' }
        );

        const user = await this.userRepository.findById(account.user_id);
        const last_transactions = await this.transactionRepository.getLastTransactions(account.id, 5);

        delete account.password;
        return {
            message: ["Login successful"],
            statusCode: 200,
            account: {
                ...account
            },
            user,
            last_transactions,
            token
        }
    }

    async validateAccountToken(
        token: string
    ): Promise<{
        valid: boolean,
        statusCode: number,
        decodedToken?: any,
        message?: string[]
    }> {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return {valid: true, decodedToken: decoded, statusCode: 200};
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return {valid: false, statusCode: 401, message: ["Expired token"]};
            } else if (error.name === 'JsonWebTokenError') {
                return {valid: false, statusCode: 401, message: ["Invalid token"]};
            } 
            else return {valid: false, statusCode: 500, message: ["Error while validating token"]};
        }
    }

    private hideAccountInfo(accounts: Account[]) {
        for (const account of accounts) {
            delete account.balance;
            delete account.updated_at;
            delete account.user_id;
            delete account.credit_limit;
            delete account.credit_rate;
            delete account.id;
        }
        return accounts;
    }

    private hidePassword(user: UserWithCredentials): User {
        delete user.password;
        return user as User;
    }
}