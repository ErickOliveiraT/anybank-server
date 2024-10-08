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
import { StatementController } from './controllers/statement.controller';
import { StatementService } from './services/statement.service';

@Module({
  imports: [],
  controllers: [
    UserController,
    AccountController,
    AuthController,
    DepositController,
    TransferController,
    StatementController
  ],
  providers: [
    UserService,
    UserRepository,
    AccountService,
    AccountRepository,
    AuthService,
    DepositService,
    TransactionRepository,
    TransferService,
    StatementService,
  ],
})
export class AppModule {}
