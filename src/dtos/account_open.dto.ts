import { 
    IsNotEmpty,
    IsIn,
    IsNumber
} from 'class-validator';

export class AccountOpenDTO {
    @IsIn(["checking", "savings"])
    type: string;

    @IsNumber()
    @IsNotEmpty()
    user_id: number;
}