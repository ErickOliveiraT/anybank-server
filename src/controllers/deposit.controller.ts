import { Controller, Post, Body } from '@nestjs/common';
import { DepositDTO } from 'src/dtos/deposit.dto';
import { DepositService } from 'src/services/deposit.service';

@Controller('deposits')
export class DepositController {
    constructor(private readonly depositService: DepositService) {}

    @Post()
    async depositToAccount(@Body() body: DepositDTO) {
        const deposit = await this.depositService.depositToAccount(
            body.account_id,
            body.amount
        );

        return deposit;
    }
}