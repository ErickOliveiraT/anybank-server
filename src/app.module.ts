import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { AccountService } from './services/account.service';
import { AccountRepository } from './repositories/account.repository';
import { AccountController } from './controllers/account.controller';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { DepositController } from './controllers/deposit.controller';
import { DepositService } from './services/deposit.service';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransferController } from './controllers/tranfer.controller';
import { TransferService } from './services/tranfer.service';

@Module({
  imports: [],
  controllers: [UserController, AccountController, AuthController, DepositController, TransferController],
  providers: [UserService, UserRepository, AccountService, AccountRepository, AuthService, DepositService, TransactionRepository, TransferService],
})
export class AppModule {}
