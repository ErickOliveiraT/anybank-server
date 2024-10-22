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
            { expiresIn: '7d' }
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
        const password_promises = [];
        let passwords = [];
        try {
            passwords = JSON.parse(data.password);
        }
        catch (err) {
            return {
                statusCode: 400,
                message: ["The provided password is not an array of strings"],
                error: "Error while decoding passwords"
            }
        }
        const possible_passwors = this.generatePossiblePasswords(passwords);
        possible_passwors.forEach(pass => {
            password_promises.push(this.verifyPasswordPromise(account.password, pass));
        });
        
        try {
            await Promise.any(password_promises);
            const token = jwt.sign(
                account,
                process.env.JWT_SECRET,
                { expiresIn: 300 }
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
        catch (err) {    
            return {
                message: ["Invalid password"],
                error: "Unauthorized",
                statusCode: 401
            }
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
            return { valid: true, decodedToken: decoded, statusCode: 200 };
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return { valid: false, statusCode: 401, message: ["Expired token"] };
            } else if (error.name === 'JsonWebTokenError') {
                return { valid: false, statusCode: 401, message: ["Invalid token"] };
            }
            else return { valid: false, statusCode: 500, message: ["Error while validating token"] };
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

    private generatePossiblePasswords(input: string[]): string[] {
        function getPossibleDigits(pair: string): string[] {
            return pair.split('.');
        }

        function generateCombinations(current_index: number, current_password: string, all_passwords: string[]) {
            if (current_index === input.length) {
                all_passwords.push(current_password);
                return;
            }
            const possibleDigits = getPossibleDigits(input[current_index]);
            for (let digit of possibleDigits) {
                generateCombinations(current_index + 1, current_password + digit, all_passwords);
            }
        }

        const passwords: string[] = [];
        generateCombinations(0, '', passwords);

        return passwords;
    }

    private async verifyPasswordPromise(correct_hash: string, password: string) {
        return new Promise(async (resolve, reject) => {
            const valid = await verify(correct_hash, password);
            if (valid) return resolve(true);
            else return reject(false);
        })
    }
}