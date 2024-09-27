import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { AccountService } from './services/account.service';
import { AccountRepository } from './repositories/account.repository';
import { AccountController } from './controllers/account.controller';

@Module({
  imports: [],
  controllers: [UserController, AccountController],
  providers: [UserService, UserRepository, AccountService, AccountRepository],
})
export class AppModule {}
