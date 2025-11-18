import { Module } from '@nestjs/common';
import { ClientController } from 'src/controllers/ClientController';
import { ClientService } from 'src/service/ClientService';

@Module({
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientsModule {}