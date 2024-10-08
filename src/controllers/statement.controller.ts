import { Controller, Get, Query } from "@nestjs/common";
import { StatementService } from "src/services/statement.service";

@Controller('statements')
export class StatementController {
    constructor(private readonly statementService: StatementService) {}

    @Get()
    async getStatement(
        @Query('account_id') account_id: string,
        @Query('start_date') start_date: string,
        @Query('end_date') end_date: string
    ) {
        return await this.statementService.getStatement(account_id, start_date, end_date);
    }



} 