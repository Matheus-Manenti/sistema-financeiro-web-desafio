import { Module } from '@nestjs/common';
import { OrderController } from 'src/controllers/OrderController';
import { OrderService } from 'src/service/OrderService';
import { ClientsModule } from 'prisma/ClientModule';

@Module({
  imports: [ClientsModule], 
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
