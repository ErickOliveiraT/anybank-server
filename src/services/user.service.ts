import { hash } from 'argon2';
import { Injectable } from '@nestjs/common';
import { genUser } from 'src/seeders/user.seeder';
import { UserCreateDTO } from 'src/dtos/user_create.dto';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async createUser(data: UserCreateDTO) {
        data.password = await hash(data.password);
        return await this.userRepository.create(data);
    }

    async generateUser(quantity?: number) {
        if (!quantity) quantity = 1;
        const user_promises = [];
        for (let i = 0; i < quantity; i++) {
            user_promises.push(this.createUser(genUser()));
        }
        return await Promise.all(user_promises);
    }

    async clearUsers() {
        return await this.userRepository.clear();
    }
}