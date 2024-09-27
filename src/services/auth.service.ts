import { Injectable } from "@nestjs/common";
import { UserRepository } from "src/repositories/user.repository";
import { LoginDTO } from "src/dtos/login.dto";
import { verify } from "argon2";
import { User, UserWithCredentials } from "src/entities/user.entity";
import { AccountRepository } from "src/repositories/account.repository";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly accountRepository: AccountRepository
    ) {}

    async login(data: LoginDTO) {
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
            accounts,
            token
        }
    }

    private hidePassword(user: UserWithCredentials): User {
        delete user.password;
        return user as User;
    }
}