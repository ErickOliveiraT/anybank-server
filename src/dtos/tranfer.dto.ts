import { IsNumber, IsPositive } from "class-validator";

export class TransferDTO {
    @IsNumber()
    source_account_id: number;

    @IsNumber()
    dest_account_id: number;

    @IsNumber()
    @IsPositive()
    amount: number;
}