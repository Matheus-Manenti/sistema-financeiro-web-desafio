import { Module } from '@nestjs/common';
import { UsersController } from 'src/controllers/UserController';
import { UsersService } from 'src/service/UserService';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], 
})
export class UsersModule {}