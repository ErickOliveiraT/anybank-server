import { hash } from 'argon2';
import { Injectable } from '@nestjs/common';
import { genUser } from 'src/seeders/user.seeder';
import { UserCreateDTO } from 'src/models/user.model';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async createUser(data: UserCreateDTO) {
        data.password = await hash(data.password);
        return await this.userRepository.create(data);
    }

    async generateUser() {
        const user = genUser();
        return await this.userRepository.create(user);
    }
}