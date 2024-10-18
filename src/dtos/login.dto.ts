import { IsNotEmpty } from 'class-validator';

export class UserLoginDTO {
    @IsNotEmpty()
    cpf: string;

    @IsNotEmpty()
    password: string;
}

export class AccountLoginDTO {
    @IsNotEmpty()
    id_public: string;

    @IsNotEmpty()
    password: string;
}