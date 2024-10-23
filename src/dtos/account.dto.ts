import { IsNotEmpty, IsIn, IsNumber, IsNumberString } from "class-validator";

export class AccountCreateDTO {
    type: string;
    user_id: number;
    agency: string;
    number: string;
    credit_limit: number;
    credit_rate:  number;
    balance: number;
    status: string;
    password: string;
}

export class AccountOpenDTO {
    @IsIn(["checking", "savings"])
    type: string;

    @IsNumber()
    @IsNotEmpty()
    user_id: number;

    @IsNumberString()
    @IsNotEmpty()
    password: string;
}

export class AccountSearchDTO {
    @IsNotEmpty()
    agency: string;

    @IsNotEmpty()
    number: string;
}