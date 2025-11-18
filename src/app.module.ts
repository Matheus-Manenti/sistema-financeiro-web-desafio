import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'prisma/UsersModule';
import { ClientsModule } from 'prisma/ClientModule';
import { PrismaModule } from 'prisma/PrismaModule';

@Module({
  imports: [
    PrismaModule,  // Fornece o PrismaService para toda a aplicação
    UsersModule,   // Módulo que encapsula tudo de Usuários
    ClientsModule, // Módulo que encapsula tudo de Clientes
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
