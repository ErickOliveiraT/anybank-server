import { 
    IsNotEmpty,
    IsIn,
    IsNumber,
    IsNumberString
} from 'class-validator';

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