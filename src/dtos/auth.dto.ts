import { IsNotEmpty, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class UserLoginDTO {
    @IsNotEmpty()
    cpf: string;

    @IsNotEmpty()
    password: string;
}

export class AccountLoginDTO {
    @IsNotEmpty()
    id_public: string;

    @ArrayMinSize(6)
    @ArrayMaxSize(6)
    password: string[];
}

export class TokenValidationDTO {
    @IsNotEmpty()
    token: string;
}