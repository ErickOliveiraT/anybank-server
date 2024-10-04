import { Controller, Body, Post, Res } from '@nestjs/common';
import { TransferDTO } from 'src/dtos/tranfer.dto';
import { TransferService } from 'src/services/tranfer.service';
import { Response } from "express";

@Controller('transfers')
export class TransferController {
    constructor(private readonly transferService: TransferService) {}

    @Post()
    async transfer(@Body() body: TransferDTO, @Res() res: Response) {
        const transfer = await this.transferService.transfer(body);
        return res.status(transfer.statusCode).send(transfer);
    }
}